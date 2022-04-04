<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$messageText = $_POST["messageText"];
if (empty($messageText)) respond("Empty message", false);

respond(9999, true);
