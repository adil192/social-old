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
        <a href="#pageProfile" class="icon-btn icon-btn-pfp">
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
        <h1>My profile</h1>
    </div>
    <div class="portraitArea">
        <div class="pageProfile-profile">
            <div class="pageProfile-pfp">
                <img class="pageProfile-pfp-img" src="assets/images/unknown.webp" alt="My profile picture">
            </div>
            <div class="pageProfile-summary">
                <h3 class="pageProfile-title">
                    <span class="pageProfile-name"></span>
                    <span class="pageProfile-pronouns"></span>
                </h3>
                <p class="pageProfile-bio"></p>
            </div>
        </div>
        <div class="pageProfile-buttonRow">
            <a href="#pageProfileEdit" id="pageProfileEditLink" class="btn btn-primary">Edit profile</a>
        </div>
    </div>
</div>
<div class="page page-overlay" id="pageOverlayProfileEdit">
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
