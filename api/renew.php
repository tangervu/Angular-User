<?php
header('Content-Type: application/json');

$response = new stdClass();
$response->status = 'ok';
$response->token = uniqid(); //Don't use tokens like this in real apps!
$response->lifetime = 123;

echo json_encode($response);