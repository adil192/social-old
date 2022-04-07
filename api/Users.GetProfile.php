<?php
require_once "api.globals.php";

$userId = $_POST["UserId"];
if (empty($userId) || !is_numeric($userId)) respond("No user id provided", false);

$conn = getConn();
$stmt = $conn->prepare("SELECT Username, Pronouns, Bio FROM User WHERE UserId=?");
$stmt->execute([$userId]);

if ($stmt->rowCount() == 0) respond("No user exists with id $userId", false);

$row = $stmt->fetchObject();
respond(array(
	"Username" => $row->Username,
	"Pronouns" => $row->Pronouns,
	"Bio" => $row->Bio
), true);
