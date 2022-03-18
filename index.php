<?php
include_once "../global_tools.php";
$lastUpdate = "22-03-18-2149"; // when changing this, you should also update sw.js
?>
<!doctype html>
<html lang="en">
<head>
	<?php createHead(
		"Social Media Demo",
		"A demo layout for a hypothetical social media, made to try out recreating a native-like app on the web.",
		null,
		null,
		"2022-03-17",
		"InteractiveResource",
		false
	); ?>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link href="assets/style.css?lastUpdate=<?=$lastUpdate?>" rel="stylesheet">

    <link rel="manifest" href="manifest.webmanifest">
    <link rel="apple-touch-icon" href="/maskable_icon_x192.png">
    <meta name="apple-mobile-web-app-status-bar" content="#557788">
    <meta name="theme-color" content="#557788">
</head>
<body>

<div class="page" id="pageFeed" style="background: red;">
feed
</div>
<div class="page" id="pageCamera">
    <canvas id="cameraSensor"></canvas>
    <video id="cameraViewfinder" autoplay playsinline></video>
    <img src="assets/images/transparent.webp" alt="" id="cameraOutput">
    <button id="cameraTrigger" aria-label="Take a picture"></button>
</div>
<div class="page" id="pageMessages" style="background: red;">
messages
</div>


<script>
    // set default page
    if (location.hash.length > 1) {
        location.replace("#"); // we need to have pageCamera in the history so we can go back to it later, remove existing
    }
    document.getElementById("pageCamera").scrollIntoView();
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
<script src="assets/scripts/main.js?lastUpdate=<?=$lastUpdate?>" type="module"></script>

</body>
</html>
