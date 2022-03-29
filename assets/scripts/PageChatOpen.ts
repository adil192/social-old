import {Page} from "./Page";

export class PageChatOpen extends Page {

	chatIdSpan: HTMLSpanElement;

	constructor() {
		super("pageChatOpen");
		this.chatIdSpan = this.pageElem.querySelector(".pageChatOpen-chatId");
	}

	OnOpen() {
		super.OnOpen();
		this.chatIdSpan.innerText = window.currentChat + "";
	}
}
