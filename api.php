<?php
include 'db_connect.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Function to generate a simple, sequential ID for new records (since 'id' is VARCHAR)
function generateNextId($conn, $table) {
    $sql = "SELECT MAX(CAST(id AS UNSIGNED)) AS max_id FROM $table";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $nextId = (int)$row['max_id'] + 1;
    return (string)$nextId;
}

// --- HELPER FUNCTION: Fetch Reviews by User ID (UPDATED FOR ADMIN) ---
function fetchUserReviews($conn, $userId, $isAdmin = false) {
    $userId = $conn->real_escape_string($userId);
    $sql = "SELECT 
                r.id, 
                r.judul, 
                r.penulis, 
                r.penerbit,         
                r.tahun_terbit,     
                r.bintang, 
                r.komentar, 
                r.tanggal_komentar
            FROM review r
            WHERE r.id_akun = '$userId'
            ORDER BY r.tanggal_komentar DESC"; 
    
    $result = $conn->query($sql);
    
    $reviews = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            
            // Determine output structure based on whether it's for Admin or Profile
            $review = [
                'id' => $row['id'],
                'stars' => (int)$row['bintang'],
                'date' => $row['tanggal_komentar'],
                'imageBg' => 'bg-amber-800/40',
                'fullReview' => $row['komentar'] // Include full review text for Admin modal
            ];
            
            if ($isAdmin) {
                $review['book'] = $row['judul'];
                $review['snippet'] = substr($row['komentar'], 0, 50) . '...'; // Shorter snippet for Admin list
                // Mock Flagging for Admin
                if ($review['book'] === 'Moby Dick') {
                    $review['reason'] = 'Hateful content';
                }
            } else { // For Profile page
                $review['title'] = $row['judul'];
                $review['author'] = $row['penulis'];
                $review['publisher'] = $row['penerbit'];
                $review['publicationDate'] = $row['tahun_terbit'];
                $review['snippet'] = substr($row['komentar'], 0, 100) . '...';
            }
            
            $reviews[] = $review;
        }
    }
    return $reviews;
}

// --- ACTION: 1. GET ALL REVIEWS (for index.html feed) ---
if ($action == 'get_reviews') {
    $sql = "SELECT 
                r.id, r.judul, r.penulis, r.penerbit, r.tahun_terbit, r.bintang, r.komentar, a.username 
            FROM review r
            JOIN akun a ON r.id_akun = a.id
            ORDER BY r.tanggal_komentar DESC"; 
    
    $result = $conn->query($sql);
    
    $reviews = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $reviews[] = [
                'id' => (int)$row['id'],                  
                'title' => $row['judul'],
                'author' => $row['penulis'],
                'publisher' => $row['penerbit'],            
                'publicationDate' => $row['tahun_terbit'], 
                'stars' => (int)$row['bintang'],
                'fullReview' => $row['komentar'],
                'snippet' => substr($row['komentar'], 0, 100) . '...',
                'reviewer' => $row['username'],
                'imageBg' => 'bg-amber-800/40', 
            ];
        }
    }
    echo json_encode($reviews);

} 

// --- ACTION: 2. USER LOGIN ---
else if ($action == 'login' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']); 
    $ADMIN_EMAIL = 'admin@gede.book';
    $ADMIN_PASSWORD = 'gebukinadmin';
    
    if ($email === $ADMIN_EMAIL && $password === $ADMIN_PASSWORD) {
        echo json_encode(["success" => true, "user" => [
            "id" => "999", "username" => "Admin", "fullname" => "Administrator", "role" => "admin"
        ]]);
        return;
    }

    $sql = "SELECT id, username, fullname, email, role FROM akun WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows == 1) {
        $user = $result->fetch_assoc();
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    }
} 

// --- ACTION: 3. USER SIGNUP ---
else if ($action == 'signup' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $conn->real_escape_string($data['username']);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $fullname = $conn->real_escape_string($data['fullname']); 
    
    $check_sql = "SELECT id FROM akun WHERE username = '$username' OR email = '$email'";
    $check_result = $conn->query($check_sql);

    if ($check_result->num_rows > 0) {
        http_response_code(409); 
        echo json_encode(["success" => false, "message" => "Username or Email already in use."]);
        return;
    }

    $new_id = generateNextId($conn, 'akun'); 
    $insert_sql = "INSERT INTO akun (id, username, password, fullname, email, role, gambar) VALUES ('$new_id', '$username', '$password', '$fullname', '$email', 'anggota', '-')";

    if ($conn->query($insert_sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Account created successfully. Please log in."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error creating account: " . $conn->error]);
    }
}

// --- ACTION: 4. POST NEW REVIEW ---
else if ($action == 'post_review' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['title']) || empty($data['fullReview']) || empty($data['stars']) || empty($data['reviewerId'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required review fields (Title, Review Text, Stars, or User ID)."]);
        return;
    }

    $judul = $conn->real_escape_string($data['title']);
    $penulis = $conn->real_escape_string($data['author'] ?? 'Unknown Author');
    $penerbit = $conn->real_escape_string($data['publisher'] ?? '-');
    $tahun_terbit = (int)($data['publicationDate'] ?? 0);
    $komentar = $conn->real_escape_string($data['fullReview']);
    $bintang = (int)$data['stars'];
    $id_akun = $conn->real_escape_string($data['reviewerId']);
    $tanggal_komentar = date("d M Y"); 

    $new_id = generateNextId($conn, 'review');

    $sql = "INSERT INTO review (id, judul, penulis, penerbit, tahun_terbit, komentar, bintang, gambar, tanggal_komentar, id_akun) 
            VALUES (
                '$new_id', 
                '$judul', 
                '$penulis', 
                '$penerbit', 
                $tahun_terbit, 
                '$komentar', 
                $bintang, 
                '-', 
                '$tanggal_komentar', 
                '$id_akun'
            )";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Review posted successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error posting review: " . $conn->error]);
    }
}

// --- ACTION: 5. GET USER PROFILE DATA ---
else if ($action == 'get_user_data') {
    $userId = isset($_GET['user_id']) ? $conn->real_escape_string($_GET['user_id']) : null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID required."]);
        return;
    }

    $sql = "SELECT id, username, fullname, email, role FROM akun WHERE id = '$userId'";
    $result = $conn->query($sql);
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        $count_sql = "SELECT COUNT(*) AS total_reviews FROM review WHERE id_akun = '$userId'";
        $count_result = $conn->query($count_sql);
        $total_reviews = $count_result->fetch_assoc()['total_reviews'];

        // Pass false to fetchUserReviews for the regular user profile structure
        $user_reviews = fetchUserReviews($conn, $userId, false); 
        $user['member_since'] = "Nov 2024";

        echo json_encode(["success" => true, "user" => $user, "total_reviews" => (int)$total_reviews, "reviews" => $user_reviews]);

    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found."]);
    }
}

// --- ACTION: 6. DELETE REVIEW (User-specific) ---
else if ($action == 'delete_review' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $reviewId = $conn->real_escape_string($data['reviewId'] ?? '');
    $userId = $conn->real_escape_string($data['userId'] ?? '');

    if (empty($reviewId) || empty($userId)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Review ID and User ID required."]);
        return;
    }

    $sql = "DELETE FROM review WHERE id = '$reviewId' AND id_akun = '$userId'";

    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Review deleted successfully."]);
        } else {
            http_response_code(403); 
            echo json_encode(["success" => false, "message" => "Review not found or you don't have permission to delete it."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    }
}

// --- ACTION: 7. EDIT/UPDATE REVIEW ---
else if ($action == 'edit_review' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['reviewId']) || empty($data['title']) || empty($data['fullReview']) || empty($data['stars']) || empty($data['reviewerId'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields for update (Review ID, Title, Review Text, Stars, or User ID)."]);
        return;
    }

    $reviewId = $conn->real_escape_string($data['reviewId']);
    $id_akun = $conn->real_escape_string($data['reviewerId']);
    $judul = $conn->real_escape_string($data['title']);
    $penulis = $conn->real_escape_string($data['author'] ?? 'Unknown Author');
    $penerbit = $conn->real_escape_string($data['publisher'] ?? '-');
    $tahun_terbit = (int)($data['publicationDate'] ?? 0);
    $komentar = $conn->real_escape_string($data['fullReview']);
    $bintang = (int)$data['stars'];
    $tanggal_komentar = date("d M Y"); 
    
    $sql = "UPDATE review SET 
                judul = '$judul', 
                penulis = '$penulis', 
                penerbit = '$penerbit', 
                tahun_terbit = $tahun_terbit, 
                komentar = '$komentar', 
                bintang = $bintang, 
                tanggal_komentar = '$tanggal_komentar'
            WHERE id = '$reviewId' AND id_akun = '$id_akun'";

    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Review updated successfully."]);
        } else {
            echo json_encode(["success" => true, "message" => "Review saved, but no changes detected (or review not found)."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    }
}


// --- ACTION: 8. GET ADMIN DASHBOARD STATS (MOCKED) ---
else if ($action == 'get_admin_stats') {
    // NOTE: Returning the existing MOCK data structure to enable chart rendering.
    $stats = [
        ['month' => 'Jul', 'posts' => 150, 'accounts' => 50, 'visitors' => 2500],
        ['month' => 'Aug', 'posts' => 180, 'accounts' => 70, 'visitors' => 3100],
        ['month' => 'Sep', 'posts' => 210, 'accounts' => 85, 'visitors' => 3500],
        ['month' => 'Oct', 'posts' => 250, 'accounts' => 100, 'visitors' => 4200],
        ['month' => 'Nov', 'posts' => 280, 'accounts' => 115, 'visitors' => 4500],
        ['month' => 'Dec', 'posts' => 320, 'accounts' => 130, 'visitors' => 5000]
    ];
    echo json_encode(["success" => true, "stats" => $stats]);
}

// --- ACTION: 9. GET ALL USERS (for Admin list) ---
else if ($action == 'get_all_users') {
    $sql = "SELECT id, username, fullname, email, role FROM akun WHERE id != '999' ORDER BY id ASC";
    $result = $conn->query($sql);

    $users = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $userId = $row['id'];
            
            $count_sql = "SELECT COUNT(*) AS total_reviews FROM review WHERE id_akun = '$userId'";
            $count_result = $conn->query($count_sql);
            $total_reviews = $count_result->fetch_assoc()['total_reviews'];
            
            // NOTE: The status is mocked here but the new feature is 'Delete Account' only.
            $status = ($row['role'] === 'suspended') ? 'Suspended' : 'Active';

            $users[] = [
                'id' => $row['id'],
                'name' => $row['fullname'],
                'username' => $row['username'],
                'totalReviews' => (int)$total_reviews,
                'status' => $status
            ];
        }
    }
    echo json_encode(["success" => true, "users" => $users]);
}

// --- ACTION: 10. GET A SPECIFIC USER'S REVIEWS (for Admin detail panel) ---
else if ($action == 'get_user_reviews_admin') {
    $userId = isset($_GET['user_id']) ? $conn->real_escape_string($_GET['user_id']) : null;
    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID required."]);
        return;
    }
    
    // Pass true to fetchUserReviews to get the Admin dashboard structure (book/snippet/fullReview)
    $reviews = fetchUserReviews($conn, $userId, true); 
    echo json_encode(["success" => true, "reviews" => $reviews]);
}

// --- ACTION: 11. ADMIN DELETE ANY REVIEW (NEW) ---
else if ($action == 'admin_delete_review' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $reviewId = $conn->real_escape_string($data['reviewId'] ?? '');

    if (empty($reviewId)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Review ID required for deletion."]);
        return;
    }

    // Admin can delete any review
    $sql = "DELETE FROM review WHERE id = '$reviewId'";

    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Review deleted successfully by Admin."]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Review ID not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    }
}

// --- ACTION: 12. ADMIN DELETE USER (REPLACED TOGGLE STATUS) ---
else if ($action == 'admin_delete_user' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $conn->real_escape_string($data['userId'] ?? '');

    if (empty($userId)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID required for deletion."]);
        return;
    }
    
    // Deleting the user from the 'akun' table. 
    // The ON DELETE CASCADE constraint on the 'review' table handles deletion of reviews.
    $sql = "DELETE FROM akun WHERE id = '$userId'";
    
    if ($conn->query($sql) === TRUE) {
        if ($conn->affected_rows > 0) {
             echo json_encode(["success" => true, "message" => "User account and all associated reviews deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User ID not found."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    }
}

// --- ACTION: DEFAULT / INVALID ---
else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing action parameter."]);
}

$conn->close();
?>