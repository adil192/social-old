import {Page} from "./Page";
import {Networker} from "./Networker";
import {Session} from "./Session";

export class PageMessages extends Page {

	chatDisplayName: HTMLSpanElement;
	messagesElem: HTMLUListElement;
	messageTemplate: HTMLTemplateElement;
	input: HTMLTextAreaElement;

	constructor() {
		super("pageMessages", "pageOverlayMessages");
		this.chatDisplayName = this.pageElem.querySelector(".pageMessages-chatDisplayName");
		this.messagesElem = this.pageElem.querySelector("#pageMessages-messages");
		this.messageTemplate = this.pageElem.querySelector("#pageMessages-message-template");
		this.input = this.pageElem.querySelector("#pageMessagesInput");

		// resize input based on content
		this.input.addEventListener("keydown", () => {
			setTimeout(() => {
				this.input.style.height = 'auto';
				this.input.style.height = this.input.scrollHeight + 'px';
			}, 0);
		});

		// if near the bottom, keep scroll position at the bottom
		window.addEventListener("resize", () => {
			let maxOffset = Math.max(this.messagesElem.offsetHeight * 0.3, 350);
			if (this.messagesElem.scrollHeight - this.messagesElem.scrollTop > maxOffset) {
				this.scrollToBottom();
			}
		});
	}

	OnOpen() {
		super.OnOpen();
		this.chatDisplayName.innerText = window.currentChatUsername;
		this.clearMessages();
		this.loadMessages().then(() => {
			this.scrollToBottom();
		});
	}

	clearMessages() {
		this.messagesElem.querySelectorAll('.pageMessages-message').forEach(e => e.remove());
	}

	async loadMessages() {
		let [ success, messages ] = await Networker.postApi("Chat.GetMessages", {
			chatId: window.currentChatUsername
		});
		if (!success) return;
		for (let i = 0; i < messages.length; ++i) {
			let [ messageId, messageText, messageUsername, messageTime ]: [number, string, string, string] = messages[i];
			this.createMessageElem(messageId, messageText, messageUsername, messageTime, false);
		}
	}

	private createMessageElem(messageId: number, messageText: string, messageUsername: string, messageTime: string, isGroupChat: boolean) {
		let messageElemFragment: DocumentFragment = this.messageTemplate.content.cloneNode(true) as DocumentFragment;
		let messageElem: HTMLLIElement = messageElemFragment.querySelector("li");

		messageElem.setAttribute("data-messageId", messageId + "");
		messageElem.querySelector(".pageMessages-message-text").textContent = messageText;
		messageElem.querySelector(".pageMessages-message-time").textContent = messageTime;

		if (!messageUsername || messageUsername == Session.user.name) {
			messageElem.classList.add("pageMessages-message-own");
		} else {
			if (isGroupChat) {
				messageElem.querySelector(".pageMessages-message-sender").textContent = messageUsername;
			}
		}

		this.messagesElem.append(messageElemFragment);
	}

	private scrollToBottom() {
		this.messagesElem.scrollTo(0, this.messagesElem.scrollHeight);
	}
}
