<?php
include 'db_connect.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Function to generate a simple, sequential ID for new accounts (since 'id' is VARCHAR)
function generateAccountId($conn) {
    $sql = "SELECT MAX(CAST(id AS UNSIGNED)) AS max_id FROM akun";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $nextId = (int)$row['max_id'] + 1;
    return (string)$nextId;
}


// --- ACTION: 1. GET ALL REVIEWS (for index.html feed) ---
if ($action == 'get_reviews') {
    $sql = "SELECT 
                r.id, 
                r.judul, 
                r.penulis, 
                r.penerbit,         
                r.tahun_terbit,     
                r.bintang, 
                r.komentar, 
                a.username 
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
    $password = $conn->real_escape_string($data['password']); // NOTE: Passwords are not hashed in your current SQL

    // Special check for hardcoded Admin account
    $ADMIN_EMAIL = 'admin@gede.book';
    $ADMIN_PASSWORD = 'gebukinadmin';
    
    if ($email === $ADMIN_EMAIL && $password === $ADMIN_PASSWORD) {
        // Return a mock Admin account. In a real app, this should be in the DB.
        echo json_encode(["success" => true, "user" => [
            "id" => "999", 
            "username" => "Admin", 
            "fullname" => "Administrator",
            "role" => "admin"
        ]]);
        return;
    }

    // Check database for regular user login
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
    
    // Sanitize and map to database columns
    $username = $conn->real_escape_string($data['username']);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $fullname = $conn->real_escape_string($data['fullname']); // Assume fullname is the same as username if not provided
    
    // Check if email or username already exists
    $check_sql = "SELECT id FROM akun WHERE username = '$username' OR email = '$email'";
    $check_result = $conn->query($check_sql);

    if ($check_result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["success" => false, "message" => "Username or Email already in use."]);
        return;
    }

    // Generate next ID
    $new_id = generateAccountId($conn); 
    
    // Insert new user (default role is 'anggota', default image is '-')
    $insert_sql = "INSERT INTO akun (id, username, password, fullname, email, role, gambar) VALUES ('$new_id', '$username', '$password', '$fullname', '$email', 'anggota', '-')";

    if ($conn->query($insert_sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Account created successfully. Please log in."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error creating account: " . $conn->error]);
    }
}

// --- ACTION: DEFAULT / INVALID ---
else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing action parameter."]);
}

$conn->close();
?>