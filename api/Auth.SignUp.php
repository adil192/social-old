<?php
require_once "api.globals.php";

$email = $_POST["email"];
$password = $_POST["password"];
$password2 = $_POST["password2"];

if (empty($email) || empty($password))
	respond("Email or password missing", false);
if (strlen($email) > 50)
	respond("Email too long", false);
if (strlen($password) < 8)
	respond("Password too short", false);
if (!empty($password2) && $password != $password2)
	respond("Passwords do not match", false);

$conn = getConn();

// insert User
$stmt = $conn->prepare('INSERT into User (Email, PasswordHash) VALUES (?,?)');
try {
	$stmt->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);
} catch (PDOException $e) {
	respond("An account already exists with that email", false);
}

// now get UserId and Email of the account we just made
$stmt = $conn->prepare('SELECT UserId, Username FROM User WHERE Email=? LIMIT 1');
$stmt->execute([$email]);
$row = $stmt->fetchObject();

// collect information
$UserId = $row->UserId;
$Username = $row->Username;
$loginToken = uuid();
$_COOKIE[loginTokenName] = $loginToken;

// save login session uuid
$stmt = $conn->prepare('INSERT into UserSession (LoginToken, UserId) VALUES (?,?)');
$stmt->execute([$loginToken, $UserId]);

respond(array(
	"UserId" => $UserId,
	"Username" => $Username,
	"loginToken" => $loginToken,
), true);
