<?php
// REDCap API URL and token
$apiUrl = 'https://redcap.research.uts.edu.au/api/';
$apiToken = '92B1FDD74D69FBE8A1CCFB2D78B7C355';

// Function to fetch data from REDCap
function fetchRedcapData($user_id) {
    global $apiUrl, $apiToken;

    $data = array(
        'token' => $apiToken,
        'content' => 'record',
        'format' => 'json',
        'type' => 'flat',
        'records' => [$user_id],
        'rawOrLabel' => 'raw',
        'rawOrLabelHeaders' => 'raw',
        'exportCheckboxLabel' => 'false',
        'exportSurveyFields' => 'false',
        'exportDataAccessGroups' => 'false',
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
    $output = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Log the request and response for debugging
    file_put_contents('redcap_request.log', print_r($data, true));
    file_put_contents('redcap_response.log', "HTTP Code: $httpcode\n" . $output);

    return json_decode($output, true);
}

$user_id = $_GET['user_id'];
$results = fetchRedcapData($user_id);

// Log the results for debugging
file_put_contents('redcap_results.log', print_r($results, true));

echo json_encode($results);
?>
