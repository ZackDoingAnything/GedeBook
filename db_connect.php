<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "sistem_review_buku_e_8";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
?>