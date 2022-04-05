<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId) || !is_numeric($chatId)) respond("No chat selected", false);

$lastMessageId = $_POST["lastMessageId"] ?? 0;

$stmt = $conn->prepare("SELECT ChatMessage.MessageId, ChatMessage.MessageText, ChatMessage.Date, User.Username
FROM ChatMessage, User
WHERE ChatMessage.ChatId=? AND ChatMessage.MessageId>? AND ChatMessage.UserId = User.UserId
ORDER BY MessageId DESC LIMIT 50");
$stmt->execute([$chatId, $lastMessageId]);

$results = [];

while ($row = $stmt->fetchObject()) {
	$results[] = [
		$row->MessageId,
		$row->MessageText,
		$row->Username,
		strtotime($row->Date)
	];
}
respond(array_reverse($results), true);
