<?php
header('Content-Type: application/json');

$response = new stdClass();
$response->status = 'ok';
$response->username = 'demo';
$response->lifetime = 123;

echo json_encode($response);