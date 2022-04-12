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
		false,
		"viewport-fit=cover"
	); ?>

    <link href="../assets/ext/bootstrap.5.1.3.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

    <link rel="manifest" href="manifest.webmanifest">
    <link rel="apple-touch-icon" href="/maskable_icon_x192.png">
    <link rel="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body>

<div class="page" id="pageChat">
    <div class="page-header">
        <a href="#Camera" class="icon-btn icon-btn-left" aria-label="Back to camera">&larr;</a>
        <h1>Chat</h1>
        <button class="icon-btn icon-btn-refresh pageChat-refreshBtn" aria-label="Refresh"></button>
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
                        <h2 class="pageChat-option-name"></h2>
                        <p class="pageChat-option-lastMsg-container">
                            <span class="pageChat-option-lastMsg"></span>
                            <span class="pageChat-option-date"></span>
                        </p>
                    </div>
                    <button class="icon-btn icon-btn-right pageChat-option-quickAction" aria-label="Send a picture to Name">&rarr;</button>
                </li>
            </template>
        </ul>
    </div>
</div>
<div class="page" id="pageCamera">
    <canvas id="cameraSensor"></canvas>
    <video id="cameraViewfinder" autoplay playsinline></video>
    <img src="assets/images/transparent.webp" alt="" id="cameraOutput">
    <div class="page-header">
        <h1></h1>
        <a href="#Profile" class="icon-btn icon-btn-pfp">
            <img src="assets/images/unknown.webp" alt="My profile">
        </a>
    </div>
    <button id="cameraTrigger" aria-label="Take a picture"></button>
</div>
<div class="page" id="pageFeed">
    <div class="page-header">
        <a href="#Camera" class="icon-btn icon-btn-left" aria-label="Back to camera">&larr;</a>
        <h1>Feed</h1>
    </div>
</div>

<div class="page page-overlay" id="pageMessages">
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
            <template id="pageMessages-image-template">
                <li class="pageMessages-message pageMessages-image">
                    <img loading="lazy">
                    <div class="pageMessages-message-footer">
                        <span class="pageMessages-message-sender"></span>
                        <span class="pageMessages-message-time"></span>
                    </div>
                </li>
            </template>
            <template id="pageMessages-daySeparator-template">
                <li class="pageMessages-daySeparator"></li>
            </template>
        </ul>
        <form method="post" id="pageMessagesInputForm">
            <div class="input-group">
                <textarea id="pageMessagesInput" aria-label="Send a message..." placeholder="Send a message..." rows="1" required minlength="1"></textarea>

                <label role="button" class="icon-btn icon-btn-upload pageMessagesInput--invalid" aria-label="Send a picture">
                    <input type="file" accept="image/*" name="file" id="pageMessagesFile" hidden="hidden">
                </label>
                <button type="submit" class="pageMessagesInput--valid" aria-label="Send message">Send</button>
            </div>
        </form>
    </div>
</div>

<div class="page page-overlay" id="pageSearch">
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
<div class="page page-overlay" id="pageProfile">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
        <h1>My profile</h1>
        <button class="icon-btn icon-btn-logout pageProfile-logoutBtn" aria-label="Logout">&larr;</button>
    </div>
    <div class="portraitArea">
        <div class="pageProfile-profile">
            <div class="pageProfile-pfp">
                <img class="pageProfile-pfp-img" src="assets/images/unknown.webp" alt="My profile picture">
            </div>
            <div class="pageProfile-summary">
                <b class="pageProfile-title">
                    <span class="pageProfile-name"></span>
                    <span class="pageProfile-pronouns"></span>
                </b>
                <p class="pageProfile-bio"></p>
            </div>
        </div>
        <div class="pageProfile-buttonRow">
            <a href="#ProfileEdit" id="pageProfileEditLink" class="btn btn-primary">Edit profile</a>
        </div>
    </div>
</div>
<div class="page page-overlay" id="pageProfileEdit">
    <div class="page-header">
        <button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
        <h1>Edit profile</h1>
    </div>
    <div class="portraitArea">
        <form id="pageProfileEdit-form">
            <div class="pageProfileEdit-name">
                <label for="pageProfileEdit-name-input" class="form-label">Name</label>
                <input type="text" class="form-control" name="name" id="pageProfileEdit-name-input" minlength="2" maxlength="30" pattern="[A-Za-z0-9.\-_]{2,30}">
            </div>
            <div class="pageProfileEdit-bio">
                <label for="pageProfileEdit-bio-input" class="form-label">Bio</label>
                <textarea class="form-control" name="bio" id="pageProfileEdit-bio-input"></textarea>
            </div>
            <div class="pageProfileEdit-pronouns">
                <label class="form-label">Pronouns</label><br>

                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-hehim" value="he/him">
                    <label class="form-check-label" for="pageProfileEdit-pronouns-hehim">he/him</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-sheher" value="she/her">
                    <label class="form-check-label" for="pageProfileEdit-pronouns-sheher">she/her</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-theythem" value="they/them">
                    <label class="form-check-label" for="pageProfileEdit-pronouns-theythem">they/them</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="pronouns" id="pageProfileEdit-pronouns-other" value="other">
                    <label class="form-check-label" for="pageProfileEdit-pronouns-other">
                        <input type="text" class="form-control" name="pronouns-other" id="pageProfileEdit-pronouns-other-input" placeholder="Other" maxlength="20">
                    </label>
                </div>
            </div>
            <div class="pageProfile-buttonRow">
                <button class="btn btn-primary" type="submit">Save</button>
            </div>
        </form>
    </div>
</div>


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
<script src="../assets/ext/bootstrap.bundle.5.1.3.min.js"></script>
<script src="assets/scripts/main.js" type="module"></script>

</body>
</html>
