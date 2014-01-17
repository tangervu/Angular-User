<?php
header('Content-Type: application/json');

$response = new stdClass();
$response->status = 'ok';

echo json_encode($response);