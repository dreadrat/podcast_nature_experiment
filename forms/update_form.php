<?php
// update_form.php

// REDCap API URL and token
define('REDCAP_API_URL', 'https://redcap.research.uts.edu.au/api/');
define('REDCAP_API_TOKEN', 'your token here');

// Get the user ID, field name, and field value from POST or GET
$user_id = $_POST['userID'] ?? $_GET['userID'] ?? null;
$field_name = $_POST['fieldName'] ?? $_GET['fieldName'] ?? null;
$field_value = $_POST['fieldValue'] ?? $_GET['fieldValue'] ?? null;

// Convert field value to zero if it is null or an empty string
if ($field_value === null || $field_value === '') {
    $field_value = 0;
}

// Validate required parameters
if (!$user_id || !$field_name || $field_value === null) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required parameters.']);
    exit;
}



// Prepare data to send to REDCap
$data = [
    'token' => REDCAP_API_TOKEN,
    'content' => 'record',
    'format' => 'json',
    'type' => 'flat',
    'data' => json_encode([
        [
            'record_id' => $user_id,
            $field_name => $field_value
        ]
    ])
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
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Record updated successfully', 'response' => $response_data]);
?>
