<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId) || !is_numeric($chatId)) respond("No chat selected", false);

$lastMessageId = (int)$_POST["lastMessageId"] ?? 0;

// update last read in db
if ($lastMessageId > $_SESSION["lastMessageId"] ?? 0) {
	$_SESSION["lastMessageId"] = $lastMessageId;
	$stmt = $conn->prepare("UPDATE ChatUser SET LastMessageId=? WHERE ChatId=? AND UserId=?");
	$stmt->execute([$lastMessageId, $chatId, $_SESSION["userId"]]);
}

$stmt = $conn->prepare("SELECT ChatMessage.MessageId, ChatMessage.MessageText, ChatMessage.Date, User.Username
FROM ChatMessage, User
WHERE ChatMessage.ChatId=? AND ChatMessage.MessageId>? AND ChatMessage.UserId = User.UserId
ORDER BY MessageId DESC LIMIT 50");
$stmt->execute([$chatId, $lastMessageId]);

if ($stmt->rowCount() == 0) respond([], true);

$results = [];
while ($row = $stmt->fetchObject()) {
	$results[] = [
		(int)$row->MessageId,
		$row->MessageText,
		($row->Username == $_SESSION["userName"]) ? "" : $row->Username,
		strtotime($row->Date)
	];
}
respond(array_reverse($results), true);
