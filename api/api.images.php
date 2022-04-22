<?php

$acceptedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "wbmp", "tga", "xbm", "xpm"];
function _imageCreateFromExtension(string $filename, string $extension) {
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

function imageCreateFromFile(string $filename, string $extension) {
	$image = _imageCreateFromExtension($filename, $extension);
	if ($image === false) return false;

	$exif = exif_read_data($filename, "EXIF");
	$orientation = $exif["Orientation"];

	if ($orientation == 8) $image = imagerotate($image, 90, 0);
	else if ($orientation == 3) $image = imagerotate($image, 180, 0);
	else if ($orientation == 6) $image = imagerotate($image, -90, 0);

	return $image;
}

function resizeImage(string $tempnam, string $extension, int $maxSize): array {
	$originalFilename = "$tempnam.$extension";
	$original = imageCreateFromFile($originalFilename, $extension);
	unlink($originalFilename); // delete the original file
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

		imagecopyresampled($resized, $original, 0, 0, 0, 0, $width, $height, $originalWidth, $originalHeight);

		imagewebp($resized, "$tempnam.webp");
	} else {
		imagewebp($original, "$tempnam.webp");
	}

	return [$width, $height];
}