import {Page} from "./Page";
import {Networker} from "./Networker";
import {Session} from "./Session";

export class PageMessages extends Page {

	chatDisplayName: HTMLSpanElement;
	messagesElem: HTMLUListElement;
	messageTemplate: HTMLTemplateElement;

	constructor() {
		super("pageMessages", "pageOverlayMessages");
		this.chatDisplayName = this.pageElem.querySelector(".pageMessages-chatDisplayName");
		this.messagesElem = this.pageElem.querySelector("#pageMessages-messages");
		this.messageTemplate = this.pageElem.querySelector("#pageMessages-message-template");
	}

	OnOpen() {
		super.OnOpen();
		this.chatDisplayName.innerText = window.currentChatUsername;
		this.clearMessages();
		this.loadMessages().then();
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
}
