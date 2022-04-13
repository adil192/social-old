<?php
require_once "api.globals.php";

$acceptedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "wbmp", "tga", "xbm", "xpm"];
function imageCreateFromFile(string $filename, string $extension) {
	if ($extension == "jpg" || $extension == "jpeg") {
		return imagecreatefromjpeg($filename);
	} else if ($extension == "png") {
		return imagecreatefrompng($filename);
	} else if ($extension == "gif") {
		return imagecreatefromgif($filename);
	} else if ($extension == "webp") {
		return imagecreatefromwebp($filename);
	} else if ($extension == "bmp") {
		return imagecreatefrombmp($filename);
	} else if ($extension == "wbmp") {
		return imagecreatefromwbmp($filename);
	} else if ($extension == "tga") {
		return imagecreatefromtga($filename);
	} else if ($extension == "xbm") {
		return imagecreatefromxbm($filename);
	} else if ($extension == "xpm") {
		return imagecreatefromxpm($filename);
	}
	return false;
}

function resizeImage(string $tempnam, string $extension, int $maxSize = 1000): array {
	$original = imageCreateFromFile("$tempnam.$extension", $extension);
	if ($original === false) respond("Failed to parse image", false);

	$originalWidth = imagesx($original);
	$originalHeight = imagesy($original);
	$width = $originalWidth;
	$height = $originalHeight;

	if ($width > $maxSize) {
		$height *= $maxSize/$width;
		$width = $maxSize;
	}
	if ($height > $maxSize) {
		$width *= $maxSize/$height;
		$height = $maxSize;
	}

	// overwrite image with resized if size changed
	if ($width != $originalWidth || $height != $originalHeight) {
		$resized = imagecreatetruecolor($width, $height);

		imagealphablending($resized, false);
		imagesavealpha($resized, true);
		imagefilledrectangle($resized, 0, 0, $width, $height,
			imagecolorallocatealpha($resized, 0, 0, 0, 127));

		imagecopyresized($resized, $original, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);


		imagewebp($resized, "$tempnam.webp");
	} else {
		imagewebp($original, "$tempnam.webp");
	}

	return [$width, $height];
}

$conn = getConn();
if (!isLoggedIn($conn)) {
	respond(ErrorMessages::$NotLoggedIn, false);
}

$chatId = $_POST["chatId"];
if (empty($chatId)) respond("No chat specified", false);

$extension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
if (!in_array($extension, $acceptedExtensions))
	respond("Invalid file format: " . $extension, false);

$tempnam = tempnam("/home/guidedre/adil.hanney.org/SocialMediaDemo/assets/images/user-media", "");
move_uploaded_file($_FILES['file']['tmp_name'], "$tempnam.$extension");

[$width, $height] = resizeImage($tempnam, $extension);

$public_url = "https://adil.hanney.org/SocialMediaDemo/assets/images/user-media/" . pathinfo($tempnam, PATHINFO_BASENAME) . ".webp";

$stmt = $conn->prepare("INSERT INTO ChatMessage (ChatId, UserId, MessageText, MessageUrl, Type, Width, Height) 
VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$chatId, $_SESSION["userId"], "Image", $public_url, "Image", $width, $height]);

respond(array(
	"id" => (int)$conn->lastInsertId("MessageId"),
	"url" => $public_url,
	"width" => $width,
	"height" => $height
), true);
