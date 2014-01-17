<?php
$response = new stdClass();
$response->status = 'ok';
$response->username = 'demo';

echo json_encode($response);