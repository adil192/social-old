import {Page} from "./Page";

export class PageChatOpen extends Page {

	chatDisplayName: HTMLSpanElement;

	constructor() {
		super("pageChatOpen", "pageOverlayChatOpen");
		this.chatDisplayName = this.pageElem.querySelector(".pageChatOpen-chatDisplayName");
	}

	OnOpen() {
		super.OnOpen();
		this.chatDisplayName.innerText = window.currentChatUsername;
	}
}
