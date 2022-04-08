<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

// this is just to make sure we are using post variables, so we don't accidentally empty the bio and pronouns in db
$userId = $_POST["UserId"];
if (empty($userId) || $userId != $_SESSION["userId"]) respond("Invalid/no user specified", false);

$username = $_POST["Username"] ?? $_SESSION["userName"];
$bio = $_POST["Bio"] ?? "";
$pronouns = $_POST["Pronouns"] ?? "";

$stmt = $conn->prepare("UPDATE User SET Username=?, Bio=?, Pronouns=? WHERE UserId=?");
$stmt->execute([$username, $bio, $pronouns, $_SESSION["userId"]]);

$_SESSION["userName"] = $username;

respond(1, true);
