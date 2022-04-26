<div class="page page-overlay" id="pageMessages">
	<div class="page-header">
		<button class="icon-btn icon-btn-left page-header-backBtn" aria-label="Back">&larr;</button>
        <img class="pageMessages-pfp" src="/assets/images/unknown.webp" alt="Profile picture">
		<h1><a href="#Profile" class="pageMessages-chatDisplayName">Chat</a></h1>
	</div>
	<div class="page-backdrop"></div>
	<div class="portraitArea">
        <div class="pageMessages-messages-parent">
            <ul id="pageMessages-messages">
                <template id="pageMessages-message-template">
                    <li class="pageMessages-clearable pageMessages-message">
                        <span class="pageMessages-message-text"></span>
                        <div class="pageMessages-message-footer">
                            <span class="pageMessages-message-sender"></span>
                            <span class="pageMessages-message-time"></span>
                        </div>
                    </li>
                </template>
                <template id="pageMessages-image-template">
                    <li class="pageMessages-clearable pageMessages-message pageMessages-image">
                        <img width="1000" height="1000" loading="lazy" onclick="window.pageMessages.expandImage(this);">
                        <div class="pageMessages-message-footer">
                            <span class="pageMessages-message-sender"></span>
                            <span class="pageMessages-message-time"></span>
                        </div>
                    </li>
                </template>
                <template id="pageMessages-daySeparator-template">
                    <li class="pageMessages-clearable pageMessages-daySeparator"></li>
                </template>

                <li class="lastRead-text">Read</li>
            </ul>
            <button class="icon-btn icon-btn-down scrollToBottomIndicator">&nbsp;</button>
        </div>
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
