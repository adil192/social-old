<?php
require_once "api.globals.php";
require_once "api.images.php";

$conn = getConn();
if (!isLoggedIn($conn)) respond(ErrorMessages::$NotLoggedIn, false);

$chatId = $_POST["chatId"];
if (empty($chatId)) respond("No chat specified", false);

$extension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
if (!in_array($extension, $acceptedImageExtensions))
	respond("Invalid file format: " . $extension, false);

// save uploaded file to random filename
$tempnam = tempnam("/home/guidedre/adil.hanney.org/SocialMediaDemo/assets/images/user-media", "");
move_uploaded_file($_FILES['file']['tmp_name'], "$tempnam.$extension");

// resize image to max 1000px (and resave as webp)
[$width, $height] = resizeImage($tempnam, $extension, 1000);

$public_url = "https://adil.hanney.org/SocialMediaDemo/assets/images/user-media/" . pathinfo($tempnam, PATHINFO_BASENAME) . ".webp";

// insert image message into ChatMessage
$stmt = $conn->prepare("INSERT INTO ChatMessage (ChatId, UserId, MessageText, MessageUrl, Type, Width, Height) 
VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$chatId, $_SESSION["userId"], "Image", $public_url, "Image", $width, $height]);

respond(array(
	"id" => (int)$conn->lastInsertId("MessageId"),
	"url" => $public_url,
	"width" => $width,
	"height" => $height
), true);
