<?php
require_once "api.globals.php";

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId)) respond("No chat specified", false);

$fileType = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
if($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg" && $fileType != "gif" && $fileType != "webp")
	respond("Invalid file format: " . $fileType, false);

$tempnam = tempnam("/home/guidedre/adil.hanney.org/SocialMediaDemo/assets/images/user-media", "");
$filename = "$tempnam.$fileType";
move_uploaded_file($_FILES['file']['tmp_name'], $filename);

$fileSize = getimagesize($filename);
if ($fileSize === false) respond("Failed to parse image", false);
$width = $fileSize[0];
$height = $fileSize[1];

$public_url = "https://adil.hanney.org/SocialMediaDemo/assets/images/user-media/" . pathinfo($filename, PATHINFO_BASENAME);

$stmt = $conn->prepare("INSERT INTO ChatMessage (ChatId, UserId, MessageText, MessageUrl, Type, Width, Height) 
VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$chatId, $_SESSION["userId"], "Image", $public_url, "Image", $width, $height]);

respond(array(
	"id" => (int)$conn->lastInsertId("MessageId"),
	"url" => $public_url,
	"width" => $width,
	"height" => $height
), true);
