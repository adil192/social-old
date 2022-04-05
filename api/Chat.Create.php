<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

// get user ids for new chat's participants
if (empty($_POST["userIds"])) respond("No user ids specified", false);
$userIds = explode(",", $_POST["userIds"]); // parse comma delimited list of user ids
if (!in_array($_SESSION["userId"], $userIds)) $userIds[] = $_SESSION["userId"]; // add current user if omitted
$userIds = array_map((fn($userId) => (int)$userId), $userIds); // make sure each element is an int

// check if chat already exists
$stmt = $conn->prepare("SELECT ChatId
FROM ChatUser
GROUP BY ChatId
HAVING GROUP_CONCAT(UserId order by UserId) = ?");
$stmt->execute([implode(",", $userIds)]);
if ($stmt->rowCount() > 0) respond($stmt->fetchObject()->ChatId, true); // respond with chat id if already exists

// create a new chat and get id
$stmt = $conn->prepare("INSERT INTO Chat (ChatId) VALUES (NULL);");
$stmt->execute();
$chatId = (int)$conn->lastInsertId("ChatId");

// add each user to this new chat
$query = "INSERT INTO ChatUser (ChatId, UserId) VALUES ($chatId,"
	. implode("),($chatId,", $userIds)
	. ");";
$stmt = $conn->prepare($query);
$stmt->execute();

respond($chatId, true); // respond with new chat id
