<?php
// update_formbatch.php

// REDCap API URL and token
define('REDCAP_API_URL', 'https://redcap.research.uts.edu.au/api/');
define('REDCAP_API_TOKEN', 'your_token_here');

// Get the user ID and fields data from POST or GET
$user_id = $_POST['userID'] ?? $_GET['userID'] ?? null;
$fields_data = $_POST['fieldsData'] ?? $_GET['fieldsData'] ?? null;

// Validate required parameters
if (!$user_id || !$fields_data) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required parameters.']);
    exit;
}

// Decode the fields data from JSON string to an associative array
$fields = json_decode($fields_data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'JSON decode error: ' . json_last_error_msg()]);
    exit;
}

// Step 2: Prepare data for updating the record
$data_array = array_merge(
    ['record_id' => $user_id], // Include record_id
    $fields // Merge all other fields at the same level
);

// Prepare data to send to REDCap
$data = [
    'token' => REDCAP_API_TOKEN,
    'content' => 'record',
    'format' => 'json',
    'type' => 'flat',
    'data' => json_encode([$data_array]), // The array itself is wrapped in another array
    'overwriteBehavior' => 'overwrite' // Ensure we update the record
];

// Use cURL to send data to REDCap
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, REDCAP_API_URL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Follow redirects

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['status' => 'error', 'message' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

$response_data = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'JSON decode error: ' . json_last_error_msg()]);
    curl_close($ch);
    exit;
}

curl_close($ch);

if (isset($response_data['error'])) {
    echo json_encode(['status' => 'error', 'message' => 'REDCap API error: ' . $response_data['error']]);
} else {
    echo json_encode(['status' => 'success', 'message' => 'Batch update successful.']);
}
?>