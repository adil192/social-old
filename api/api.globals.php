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

function uuid(): string {
	// https://www.delftstack.com/howto/php/php-uuid/
	return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		// 32 bits for the time_low
		mt_rand(0, 0xffff), mt_rand(0, 0xffff),
		// 16 bits for the time_mid
		mt_rand(0, 0xffff),
		// 16 bits for the time_hi,
		mt_rand(0, 0x0fff) | 0x4000,

		// 8 bits and 16 bits for the clk_seq_hi_res,
		// 8 bits for the clk_seq_low,
		mt_rand(0, 0x3fff) | 0x8000,
		// 48 bits for the node
		mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
	);
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

