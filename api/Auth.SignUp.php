<?php
require_once "api.globals.php";

$email = $_POST["email"];
$password = $_POST["password"];
$password2 = $_POST["password2"];

if (empty($email) || empty($password))
	respond("Email or password missing", false);
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

// save to session
$_SESSION["UserId"] = $row->UserId;
$_SESSION["Username"] = $row->Username;
$_SESSION["LoginToken"] = uuid();

// save login session uuid
$stmt = $conn->prepare('INSERT into UserSession (LoginToken, UserId) VALUES (?,?)');
$stmt->execute([$_SESSION["LoginToken"], $_SESSION["UserId"]]);

respond(array(
	"UserId" => $_SESSION["UserId"],
	"Username" => $_SESSION["Username"],
	"LoginToken" => $_SESSION["LoginToken"],
), true);
