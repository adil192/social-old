<?php
require_once "api.globals.php";

$email = $_POST["email"];  // email or username
$password = $_POST["password"];

if (empty($email) || empty($password))
	respond("Email or password missing", false);

$conn = getConn();
$stmt = $conn->prepare('SELECT UserId, Email, Username, PasswordHash FROM User WHERE Email=? OR Username=? LIMIT 1');
$stmt->execute([$email, $email]);

$row = $stmt->fetchObject();
if (empty($row)) respond("No user exists with that email.", false);

// check if password matches
if (!password_verify($password, $row->PasswordHash)) respond("Incorrect password for user `$row->Username`.", false);

// collect information
$UserId = $row->UserId;
$Username = $row->Username;
$LoginToken = uuid();

// save login session uuid
$stmt = $conn->prepare('INSERT into UserSession (LoginToken, UserId) VALUES (?,?)');
$stmt->execute([$LoginToken, $UserId]);

respond(array(
	"UserId" => $UserId,
	"Username" => $Username,
	"LoginToken" => $LoginToken,
), true);
