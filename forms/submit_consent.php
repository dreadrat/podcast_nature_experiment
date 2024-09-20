<?php

header('Content-Type: application/json');
// submit_consent.php

// REDCap API URL and token
$api_url = 'https://redcap.research.uts.edu.au/api/';
$api_token = '92B1FDD74D69FBE8A1CCFB2D78B7C355';

// Collect data from the form
$screen_width = $_POST['screen_width'];
$screen_height = $_POST['screen_height'];
$window_width = $_POST['window_width'];
$window_height = $_POST['window_height'];
$device_type = $_POST['device_type'];
$consented_at = $_POST['consented_at'];
$recruitment_source = $_POST['recruitment_source'];
$clickworker_id = $_POST['clickworker_id'];
$sona_id = $_POST['sona_id'];



// Create a record array in REDCap format
$record = array(
    'record_id' => uniqid(), // Or use any unique ID generation logic
    'screen_width' => $screen_width,
    'screen_height' => $screen_height,
    'window_width' => $window_width,
    'window_height' => $window_height,
    'device_type' => $device_type,
    'consented_at' => $consented_at,
    'recruitment_source' => $recruitment_source,
    'clickworker_id' => $clickworker_id,
    'sona_id' => $sona_id

    
);

// Convert the record to JSON format
$data = json_encode(array($record));

// Set up cURL request to REDCap API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_POSTFIELDS, array(
    'token' => $api_token,
    'content' => 'record',
    'format' => 'json',
    'type' => 'flat',
    'data' => $data
));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Verbose debugging
curl_setopt($ch, CURLOPT_VERBOSE, true);
$verbose = fopen('php://temp', 'w+');
curl_setopt($ch, CURLOPT_STDERR, $verbose);

// Execute cURL request and capture the response
$response = curl_exec($ch);
$response_info = curl_getinfo($ch);
$curl_error = curl_error($ch);
curl_close($ch);

// Handle response (e.g., check for errors, redirect, etc.)
$response_data = json_decode($response, true);
if ($response === FALSE || isset($response_data['error'])) {
    rewind($verbose);
    $verbose_log = stream_get_contents($verbose);
    echo json_encode([
        'error' => 'Failed to create record in REDCap.',
        'curl_error' => $curl_error,
        'response_info' => $response_info,
        'verbose_log' => $verbose_log,
        'response' => $response
    ]);
} else {
    echo json_encode(['user_id' => $record['record_id']]);
}
?>