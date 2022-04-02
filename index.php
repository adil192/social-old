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
    <button id="cameraTrigger" aria-label="Take a picture"></button>
</div>
<div class="page" id="pageChat">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back to camera">&larr;</button>
        <h1>Chat</h1>
    </div>
    <div class="portraitArea">
        <div class="pageChat-search-parent">
            <input class="pageChatSearch" aria-label="Search chats" placeholder="Search">
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

<div class="page page-overlay" id="pageOverlayChatOpen">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back to camera">&larr;</button>
        <h1>Chat with <span class="pageChatOpen-chatDisplayName">PLACEHOLDER</span></h1>
    </div>
    <div class="portraitArea">
        <ul id="pageChatOpen-messages">
            <li class="pageChatOpen-message">
                <span class="pageChatOpen-message-text">This is a message</span>
                <div class="pageChatOpen-message-footer">
                    <span class="pageChatOpen-message-sender">Asta</span>
                    <span class="pageChatOpen-message-time">11:38</span>
                </div>
            </li>
            <li class="pageChatOpen-message pageChatOpen-message-own">
                <span class="pageChatOpen-message-text">This is an example longer message to showcase how the css handles overflow</span>
                <div class="pageChatOpen-message-footer">
                    <span class="pageChatOpen-message-sender">Asta</span>
                    <span class="pageChatOpen-message-time">11:38</span>
                </div>
            </li>
            <li class="pageChatOpen-message">
                <span class="pageChatOpen-message-text">This is an example longer message to showcase how the css handles overflow</span>
                <div class="pageChatOpen-message-footer">
                    <span class="pageChatOpen-message-sender">Asta</span>
                    <span class="pageChatOpen-message-time">11:38</span>
                </div>
            </li>
            <li class="pageChatOpen-message">
                <span class="pageChatOpen-message-text">This is an example longer message to showcase how the css handles overflow</span>
                <div class="pageChatOpen-message-footer">
                    <span class="pageChatOpen-message-sender">Asta</span>
                    <span class="pageChatOpen-message-time">11:38</span>
                </div>
            </li>
        </ul>
    </div>
</div>

<div class="page page-overlay" id="pageOverlaySearch">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back to camera">&larr;</button>
        <div class="pageChat-search-parent">
            <input id="pageSearchInput" class="pageChatSearch" aria-label="Search chats" placeholder="Search">
        </div>
    </div>
    <div class="portraitArea">
        pageSearch
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
