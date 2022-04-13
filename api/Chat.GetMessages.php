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
// get others' last read
$stmt = $conn->prepare("SELECT LastMessageId, GROUP_CONCAT(Username SEPARATOR ';') AS Usernames
FROM ChatUser, User
WHERE ChatId=? AND User.UserId<>? AND ChatUser.UserId=User.UserId
GROUP BY LastMessageId
ORDER BY LastMessageId DESC LIMIT 1");
$stmt->execute([$chatId, $_SESSION["userId"]]);
if ($row = $stmt->fetchObject()) {
	$lastRead = array(
		"LastMessageId" => $row->LastMessageId,
		"Usernames" => explode(';', $row->Usernames)
	);
} else {
	$lastRead = array(
		"LastMessageId" => 0,
		"Usernames" => []
	);
}

$stmt = $conn->prepare("SELECT MessageId, MessageText, MessageUrl, Type, Username, Date, Width, Height
FROM ChatMessage, User
WHERE ChatMessage.ChatId=? AND ChatMessage.MessageId>? AND ChatMessage.UserId = User.UserId
ORDER BY MessageId DESC LIMIT 50");
$stmt->execute([$chatId, $lastMessageId]);

if ($stmt->rowCount() == 0) respond([], true);

$results = [];
while ($row = $stmt->fetchObject()) {
	$results[] = array(
		"type" => $row->Type,
		"id" => (int)$row->MessageId,
		"username" => ($row->Username == $_SESSION["userName"]) ? "" : $row->Username,
		"timestamp" => strtotime($row->Date),
		"text" => $row->MessageText,
		"url" => $row->MessageUrl,
		"width" => (int)$row->Width,
		"height" => (int)$row->Height
	);
}
respond(array_reverse($results), true, array(
	"LastRead" => $lastRead
));
