<?php
/**
 * Dummy login script
 */

$user = 'demo';
$pass = 'demo';

$request = json_decode(file_get_contents('php://input'));

header('Content-Type: application/json');

$response = new stdClass();



if($request->username == $user && $request->password == $pass) {
	$response->status = 'ok';
	$response->username = $request->username;
	$response->token = uniqid(); //Don't use tokens like this in real apps!
	if(isset($request->persistent)) {
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