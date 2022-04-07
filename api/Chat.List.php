<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

// get user's chats' ids
$stmt = $conn->prepare("SELECT DISTINCT ChatId
FROM ChatUser
WHERE UserId=?
LIMIT 50");
$stmt->execute([$_SESSION["userId"]]);
$chatIds = array_map(function ($row) {
	return "ChatUser.ChatId=" . (int)$row["ChatId"];
}, $stmt->fetchAll());
$whereChatIds = implode(" OR ", $chatIds);

// get chats' latest message
$stmt = $conn->prepare("SELECT ChatId, Username, MessageText
FROM (
    SELECT ChatUser.ChatId, User.Username, ChatMessage.MessageText,
           DENSE_RANK() OVER (PARTITION BY ChatMessage.ChatId ORDER BY ChatMessage.MessageId DESC) AS n
	FROM ChatUser, User, ChatMessage
	WHERE ChatUser.UserId <> ? AND ($whereChatIds)
	  AND ChatUser.UserId = User.UserId
	  AND ChatMessage.ChatId = ChatUser.ChatId
	GROUP BY ChatMessage.ChatId
) AS x
WHERE n <= 1 LIMIT 50");
$stmt->execute([$_SESSION["userId"]]);

$results = [];

while ($row = $stmt->fetchObject()) {
	$results[] = [
		$row->ChatId,
		$row->Username,
		$row->MessageText
	];
}
respond($results, true);
