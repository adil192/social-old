<?php
require_once "api.globals.php";

$email = $_POST["email"];
$password = $_POST["password"];

if (empty($email) || empty($password))
	respond("Email or password missing", false);

//$conn = getConn();
respond("Success (not implemented)", true);
