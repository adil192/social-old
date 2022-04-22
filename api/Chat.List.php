<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

// get user's chats' ids
$stmt = $conn->prepare("SELECT DISTINCT ChatId, LastMessageId
FROM ChatUser
WHERE UserId=?
LIMIT 50");
$stmt->execute([$_SESSION["userId"]]);
if ($stmt->rowCount() == 0) respond([], true); // no chats found

$chatIds = [];
$lastReadIds = array();
while ($row = $stmt->fetchObject()) {
	$chatIds[] = "ChatUser.ChatId=" . (int)$row->ChatId;
	$lastReadIds[(int)$row->ChatId] = (int)$row->LastMessageId;
}
$whereChatIds = implode(" OR ", $chatIds);

// get chats' latest message
$stmt = $conn->prepare("SELECT ChatId, UserId, Username, Pfp, MessageId, MessageText, Date
FROM (
    SELECT ChatUser.ChatId, User.UserId, User.Username, User.Pfp,
           ChatMessage.MessageId, ChatMessage.MessageText, ChatMessage.Date,
           DENSE_RANK() OVER (PARTITION BY ChatMessage.ChatId ORDER BY ChatMessage.MessageId DESC) AS n
	FROM ChatUser, User, ChatMessage
	WHERE ChatUser.UserId <> ? AND ($whereChatIds)
	  AND ChatUser.UserId = User.UserId
	  AND ChatMessage.ChatId = ChatUser.ChatId
) AS x
WHERE n <= 1
ORDER BY Date DESC
LIMIT 50");
$stmt->execute([$_SESSION["userId"]]);

$results = [];

while ($row = $stmt->fetchObject()) {
	$results[] = array(
		"ChatId" => (int)$row->ChatId,
		"UserId" => (int)$row->UserId,
		"Username" => $row->Username,
		"Pfp" => $row->Pfp ?? "",
		"MessageText" => $row->MessageText,
		"Timestamp" => strtotime($row->Date),
		"Unread" => (int)$row->MessageId > $lastReadIds[(int)$row->ChatId]
	);
}
respond($results, true);
