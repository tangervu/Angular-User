<?php
$response = new stdClass();
$response->status = 'ok';
$response->token = uniqid(); //Don't use tokens like this in real apps!

echo json_encode($response);