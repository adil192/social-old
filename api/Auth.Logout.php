<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) respond(1, true); // success is true in this special case

// this is just to make sure we are using post variables, so we don't accidentally logout
$userId = $_POST["UserId"];
if (empty($userId) || $userId != $_SESSION["userId"]) respond("Invalid/no user specified", false);

$stmt = $conn->prepare("DELETE FROM UserSession WHERE LoginToken=?");
$stmt->execute([$_SESSION[loginTokenName]]);

$_SESSION["isLoggedIn"] = false;
$_SESSION[loginTokenName] = null;

respond(1, true);
