<?php
/**
 * Dummy login script
 */

$user = 'demo';
$pass = 'demo';

header('Content-Type: application/json');

$response = new stdClass();

if($_POST['username'] == $user && $_POST['password'] == $pass) {
	$response->status = 'ok';
	$response->username = $_POST['username'];
	$response->token = uniqid(); //Don't use tokens like this in real apps!
	if(isset($_POST['persistent'])) {
		$response->persistent = true;
	}
	else {
		$response->persistent = false;
	}
}
else {
	$response->status = 'error';
}

echo json_encode($response);