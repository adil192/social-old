<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId)) respond("No chat specified", false);

$messageText = $_POST["messageText"];
if (empty($messageText)) respond("Empty message", false);

$stmt = $conn->prepare("INSERT INTO ChatMessage (ChatId, UserId, MessageText) 
VALUES (?, ?, ?)");
$stmt->execute([$chatId, $_SESSION["userId"], $messageText]);

respond($conn->lastInsertId("MessageId"), true);
