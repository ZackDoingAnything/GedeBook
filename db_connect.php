<?php
// Configuration for XAMPP Default MySQL
$servername = "localhost";
$username = "root";     // Default XAMPP username
$password = "";         // Default XAMPP password (often empty)
$dbname = "sistem_review_buku_e_8"; // **YOUR DATABASE NAME**

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Return a JSON error message if connection fails
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Set headers for AJAX communication
header("Access-Control-Allow-Origin: *"); // Allows requests from your local HTML files
header("Content-Type: application/json; charset=UTF-8");
?>