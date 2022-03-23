<?php
/** @noinspection PhpMultipleClassDeclarationsInspection */
/** @noinspection PhpIllegalPsrClassPathInspection */

@session_start();
require_once "api.secrets.php";

const URL_PREFIX = "https://adil.hanney.org/SocialMediaDemo/api";

function getConn() {
	global $secrets__password;
	$host = "localhost";
	$dbName = "guidedre_adilhann_socialmediademo";
	$username = "guidedre_adilhann_socialmediademo";

	try {
		$conn = new PDO("mysql:host=$host;dbname=$dbName", $username, $secrets__password);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  // set the PDO error mode to exception

		return $conn;
	} catch(PDOException $e) {
		echo "Connection failed: " . $e->getMessage();
		die;
	}
}

function respond($response, $success) {
	header('Content-Type: application/json');
	echo json_encode([
		"meta" => array(
			"success" => $success,
		),
		"response" => $response
	]);
	die;
}

class ErrorMessages {
	static string $NotLoggedIn = "Not logged in.";
}

