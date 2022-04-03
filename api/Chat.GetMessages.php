<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId)) respond("No chat selected", false);
$chatUsername = "PlaceholderUsername$chatId";

respond([
	[10, "So would you be interested in hanging out again?", $_SESSION["Username"]],
	[12, "Yeah sure :)", $chatUsername],
	[23, "What are you up to Wednesday after work?", $_SESSION["Username"]],
	[25, "I don't think I'll be able to do anything this week", $chatUsername],
	[26, "just too busy with work", $chatUsername],
	[27, "Maybe next week?", $chatUsername],
	[31, "Too bad, I'm going to be out of town Thursday to Friday", $_SESSION["Username"]],
	[32, "Was hoping to see how the stache was looking", $_SESSION["Username"]],
], true);
