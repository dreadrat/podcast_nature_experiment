<?php
// Include the load_env.php file
require 'load_env.php';
// Database connection
$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];
$port = $_ENV['DB_PORT']; // Change to the correct port for MariaDB if necessary

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch table names
$tables = [];
$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
}

// Fetch table data
$data = [];
foreach ($tables as $table) {
    $sql = "SELECT * FROM $table";
    $result = $conn->query($sql);
    $rows = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    $data[$table] = $rows;
}

echo json_encode($data);

$conn->close();
?>
