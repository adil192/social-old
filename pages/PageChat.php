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
					<img class="pageChat-option-pfp" src="/assets/images/unknown.webp" alt="Profile picture">
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
