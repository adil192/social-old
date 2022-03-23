<?php
require_once "api.globals.php";

$email = $_POST["email"];
$password = $_POST["password"];
$password2 = $_POST["password2"];

if (empty($email) || empty($password))
	respond("Email or password missing", false);
if (!empty($password2) && $password != $password2)
	respond("Passwords do not match", false);

//$conn = getConn();
respond("Success (not implemented)", true);
