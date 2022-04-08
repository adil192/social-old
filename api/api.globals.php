<?php
/** @noinspection PhpMultipleClassDeclarationsInspection */
/** @noinspection PhpIllegalPsrClassPathInspection */

@session_start();
require_once "api.secrets.php";

const loginTokenName = "loginToken";
const loginTokenNameExpiry = "loginTokenExpiry";

// increment this to reconfigure session variables if needed by a change in the api
const API_VERSION = 1;
if ($_SESSION["API_VERSION"] != API_VERSION) {
	session_unset();
	$_SESSION["API_VERSION"] = API_VERSION;
}

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

function isLoggedIn($conn = null): bool {
	$loginToken = $_COOKIE[loginTokenName] ?? $_POST[loginTokenName];
	if (empty($loginToken)) return false;

	// if we've already verified this login token is correct
	if ($_SESSION[loginTokenName] == $loginToken) {
		// timeout session token so user can revoke logins
		if (time() > $_SESSION[loginTokenNameExpiry]) {
			unset($_SESSION[loginTokenName]);
			// then re-verify...
		} else {
			return true;
		}
	}

	// now we'll check if the loginToken is valid in the database
	if ($conn == null) $conn = getConn();
	$stmt = $conn->prepare('SELECT User.UserId, User.Username FROM User, UserSession
WHERE LoginToken=? AND User.UserId=UserSession.UserId LIMIT 1');
	$stmt->execute([$loginToken]);
	$row = $stmt->fetchObject();
	if (empty($row)) return false;

	// save verified token to $_SESSION so we don't need to check the database every time
	$_SESSION[loginTokenName] = $loginToken;
	$_SESSION[loginTokenNameExpiry] = time() + 30 * 60; // re-verify login token after 30 minutes
	// save other session variables
	$_SESSION["isLoggedIn"] = true;
	$_SESSION["userId"] = $row->UserId;
	$_SESSION["userName"] = $row->Username;

	return true;
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

