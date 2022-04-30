<?php
require_once "api.globals.php";
require_once "api.images.php";

$conn = getConn();
if (!isLoggedIn($conn)) respond(ErrorMessages::$NotLoggedIn, false);

// this is just to make sure we are using post variables, so we don't accidentally empty the bio and pronouns in db
$userId = $_POST["UserId"];
if (empty($userId) || $userId != $_SESSION["userId"]) respond("Invalid/no user specified", false);

$width = null;
$height = null;
$public_url = "";
if (!empty($_FILES)) {
	$extension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
	if (!in_array($extension, $acceptedImageExtensions))
		respond("Invalid file format: " . $extension, false);

	// save uploaded file to random filename
	$tempnam = tempnam("/home/guidedre/old.social.adil.hanney.org/assets/images/user-media", "");
	move_uploaded_file($_FILES['file']['tmp_name'], "$tempnam.$extension");

	// resize image to max 1000px (and resave as webp)
	[$width, $height] = resizeImage($tempnam, $extension, 1000);

	$public_url = "https://old.social.adil.hanney.org/assets/images/user-media/" . pathinfo($tempnam, PATHINFO_BASENAME) . ".webp";
}

// update pfp
$stmt = $conn->prepare("UPDATE User SET Pfp=?, PfpWidth=?, PfpHeight=? WHERE UserId=?");
$stmt->execute([$public_url, $width, $height, $userId]);

respond(array(
	"url" => $public_url,
	"width" => $width,
	"height" => $height
), true);
