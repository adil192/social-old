<?php
include_once "../global_tools.php";
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

    <link href="../assets/ext/bootstrap.5.1.3.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

    <link rel="manifest" href="manifest.webmanifest">
    <link rel="apple-touch-icon" href="/maskable_icon_x192.png">
</head>
<body>

<div class="page" id="pageFeed">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back to camera">&larr;</button>
        <h1>Feed</h1>
    </div>
</div>
<div class="page" id="pageCamera">
    <canvas id="cameraSensor"></canvas>
    <video id="cameraViewfinder" autoplay playsinline></video>
    <img src="assets/images/transparent.webp" alt="" id="cameraOutput">
    <div class="page-header">
        <h1></h1>
        <a href="#pageOverlayProfile" class="icon-btn icon-btn-pfp">
            <img src="assets/images/unknown.webp" alt="My profile">
        </a>
    </div>
    <button id="cameraTrigger" aria-label="Take a picture"></button>
</div>
<div class="page" id="pageChat">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back to camera">&larr;</button>
        <h1>Chat</h1>
    </div>
    <div class="portraitArea">
        <div class="input-group">
            <input id="pageChatSearch" aria-label="Search chats" placeholder="Search">
        </div>
        <ul id="pageChatOptions">
            <template id="pageChatOptionTemplate">
                <li class="pageChat-option">
                    <img class="pageChat-option-pfp" src="assets/images/unknown.webp" alt="Name's profile picture">
                    <div class="pageChat-option-main">
                        <h2 class="pageChat-option-name">Name</h2>
                        <p class="pageChat-option-lastMsg">Say hi!</p>
                    </div>
                    <button class="icon-btn icon-btn-right pageChat-option-quickAction" aria-label="Send a picture to Name">&rarr;</button>
                </li>
            </template>
        </ul>
    </div>
</div>

<div class="page page-overlay" id="pageOverlayMessages">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
        <h1>Chat with <span class="pageMessages-chatDisplayName">PLACEHOLDER</span></h1>
    </div>
    <div class="portraitArea">
        <ul id="pageMessages-messages">
            <template id="pageMessages-message-template">
                <li class="pageMessages-message">
                    <span class="pageMessages-message-text"></span>
                    <div class="pageMessages-message-footer">
                        <span class="pageMessages-message-sender"></span>
                        <span class="pageMessages-message-time"></span>
                    </div>
                </li>
            </template>
        </ul>
        <form method="post" id="pageMessagesInputForm">
            <div class="input-group">
                <textarea id="pageMessagesInput" aria-label="Send a message..." placeholder="Send a message..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
        </form>
    </div>
</div>

<div class="page page-overlay" id="pageOverlaySearch">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
        <div class="input-group">
            <input id="pageSearchInput" aria-label="Search chats" placeholder="Search">
        </div>
    </div>
    <div class="portraitArea">
        <ul id="pageSearchResults">
        </ul>
    </div>
</div>
<div class="page page-overlay" id="pageOverlayProfile">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
        <h1>Profile</h1>
    </div>
    <div class="portraitArea">
        My profile
    </div>
</div>


<script>
    // set default page
    if (location.hash.length > 1) {
        // we need to have pageCamera in the history so we can go back to it later
        let previousHash = location.hash.substring(1);
        location.replace("#"); // replace first history item with pageCamera
        location.hash = previousHash; // now re-add previousHash as the second history item
    } else {
        document.getElementById("pageCamera").scrollIntoView();
    }
</script>
<script src="../assets/ext/bootstrap.bundle.5.1.3.min.js"></script>
<script src="assets/scripts/main.js" type="module"></script>

</body>
</html>
