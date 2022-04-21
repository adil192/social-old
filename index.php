<?php
include_once "global_tools.php";
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
		false,
		"viewport-fit=cover"
	); ?>

    <link href="/assets/ext/bootstrap.5.1.3.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

    <link rel="manifest" href="manifest.webmanifest">
    <link rel="apple-touch-icon" href="/maskable_icon_x192.png">
    <link rel="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body>

<?php
include_once "pages/PageChat.php";
include_once "pages/PageCamera.php";
include_once "pages/PageFeed.php";

include_once "pages/PageMessages.php";

include_once "pages/PageSearch.php";
include_once "pages/PageProfile.php";
include_once "pages/PageProfileEdit.php";

include_once "pages/PageAttributions.php";
?>


<script>
    // stay on swiping pages, otherwise go to camera page
    let previousHash = location.hash.substring(1);
    if (previousHash === "Chat" || previousHash === "Feed") {
        // we need to have pageCamera in the history so we can go back to it later
        location.replace("#"); // replace first history item with pageCamera
        location.hash = previousHash; // now re-add previousHash as the second history item
        document.getElementById("page" + previousHash).scrollIntoView();
    } else {
        if (previousHash.length && previousHash !== "Camera") {
            location.replace("#");
        }
        document.getElementById("pageCamera").scrollIntoView();
    }
</script>
<script src="/assets/ext/bootstrap.bundle.5.1.3.min.js"></script>
<script src="assets/scripts/main.js" type="module"></script>

</body>
</html>
