<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId)) respond("No chat selected", false);
$chatUsername = "$chatId";

respond([
	[10, "So would you be interested in hanging out again?", $_SESSION["Username"], "11:00"],
	[12, "Yeah sure :)", $chatUsername, "11:02"],
	[23, "What are you up to Wednesday after work?", $_SESSION["Username"], "11:02"],
	[25, "I don't think I'll be able to do anything this week", $chatUsername, "11:02"],
	[26, "just too busy with work", $chatUsername, "11:03"],
	[27, "Maybe next week?", $chatUsername, "11:03"],
	[31, "Too bad, I'm going to be out of town Thursday to Friday", $_SESSION["Username"], "11:04"],
	[32, "Was hoping to see how the stache was looking", $_SESSION["Username"], "11:04"],
], true);
