<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$searchTerm = $_POST["searchTerm"];
if (empty($searchTerm)) respond("No search term provided", false);

$stmt = $conn->prepare("SELECT UserId, Username FROM User
WHERE Username LIKE CONCAT('%', ?, '%') AND UserId<>? LIMIT 10");
$stmt->execute([$searchTerm, $_SESSION["userId"]]);

$results = [];

while ($row = $stmt->fetchObject()) {
	$results[] = array(
		"UserId" => $row->UserId,
		"Username" => $row->Username
	);
}
respond($results, true);
