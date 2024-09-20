<?php


// Enable error logging to a file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt');
error_reporting(E_ALL);

// Set content type to JSON
header('Content-Type: application/json');

// Database connection
$servername = $_ENV['DB_HOST'];
$username = $_ENV['DB_USER'];
$password = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];
$port = $_ENV['DB_PORT'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}


// Fetch the general results from the database
$sql = "
    SELECT
        AVG(pre_tense) as avg_pre_tense,
        AVG(post_tense) as avg_post_tense,
        AVG(pre_worried) as avg_pre_worried,
        AVG(post_worried) as avg_post_worried,
        AVG(pre_nervous) as avg_pre_nervous,
        AVG(post_nervous) as avg_post_nervous,
        AVG(pre_jittery) as avg_pre_jittery,
        AVG(post_jittery) as avg_post_jittery,
        AVG(pre_indecisive) as avg_pre_indecisive,
        AVG(post_indecisive) as avg_post_indecisive,
        AVG(pre_misfortune) as avg_pre_misfortune,
        AVG(post_misfortune) as avg_post_misfortune,
        AVG(pre_test_duration) as avg_pre_test_duration,
        AVG(post_test_duration) as avg_post_test_duration,
        AVG(pre_test_errors) as avg_pre_test_errors,
        AVG(post_test_errors) as avg_post_test_errors,
        AVG(prs1) as avg_prs1,
        AVG(prs2) as avg_prs2,
        AVG(prs3) as avg_prs3,
        AVG(prs4) as avg_prs4,
        AVG(prs5) as avg_prs5,
        AVG(prs6) as avg_prs6,
        AVG(prs7) as avg_prs7,
        AVG(prs8) as avg_prs8,
        AVG(prs9) as avg_prs9,
        AVG(prs10) as avg_prs10,
        AVG(prs11) as avg_prs11
    FROM users
";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "stress_stats" => [
            "avg_pre_tense" => $row['avg_pre_tense'],
            "avg_post_tense" => $row['avg_post_tense'],
            "avg_pre_worried" => $row['avg_pre_worried'],
            "avg_post_worried" => $row['avg_post_worried'],
            "avg_pre_nervous" => $row['avg_pre_nervous'],
            "avg_post_nervous" => $row['avg_post_nervous'],
            "avg_pre_jittery" => $row['avg_pre_jittery'],
            "avg_post_jittery" => $row['avg_post_jittery'],
            "avg_pre_indecisive" => $row['avg_pre_indecisive'],
            "avg_post_indecisive" => $row['avg_post_indecisive'],
            "avg_pre_misfortune" => $row['avg_pre_misfortune'],
            "avg_post_misfortune" => $row['avg_post_misfortune'],
        ],
        "trail_stats" => [
            "avg_pre_test_duration" => $row['avg_pre_test_duration'],
            "avg_post_test_duration" => $row['avg_post_test_duration'],
            "avg_pre_test_errors" => $row['avg_pre_test_errors'],
            "avg_post_test_errors" => $row['avg_post_test_errors'],
        ],
        "prs_stats" => [
            "avg_prs1" => $row['avg_prs1'],
            "avg_prs2" => $row['avg_prs2'],
            "avg_prs3" => $row['avg_prs3'],
            "avg_prs4" => $row['avg_prs4'],
            "avg_prs5" => $row['avg_prs5'],
            "avg_prs6" => $row['avg_prs6'],
            "avg_prs7" => $row['avg_prs7'],
            "avg_prs8" => $row['avg_prs8'],
            "avg_prs9" => $row['avg_prs9'],
            "avg_prs10" => $row['avg_prs10'],
            "avg_prs11" => $row['avg_prs11'],
        ],
    ]);
} else {
    error_log("Query failed: " . $conn->error);
    echo json_encode(["error" => "Query failed."]);
}

$conn->close();
?>
