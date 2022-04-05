import {Page} from "./Page";
import {Meta, Networker} from "./Networker";
import {Session} from "./Session";

export class PageMessages extends Page {

	chatDisplayName: HTMLSpanElement;
	messagesElem: HTMLUListElement;
	messageTemplate: HTMLTemplateElement;

	inputForm: HTMLFormElement;
	input: HTMLTextAreaElement;

	lastMessageId: number = 0;
	excludedMessageIds: number[] = [];
	loadMessagesIntervalId: number = null;
	loadMessagesIntervalMs: number = 1000;

	constructor() {
		super("pageMessages", "pageOverlayMessages");
		this.chatDisplayName = this.pageElem.querySelector(".pageMessages-chatDisplayName");
		this.messagesElem = this.pageElem.querySelector("#pageMessages-messages");
		this.messageTemplate = this.pageElem.querySelector("#pageMessages-message-template");

		this.inputForm = this.pageElem.querySelector("#pageMessagesInputForm");
		this.input = this.pageElem.querySelector("#pageMessagesInput");

		this.inputForm.addEventListener("submit", (e) => this.onInputFormSubmit(e));
		this.input.addEventListener("keydown", () => {
			setTimeout(() => {
				// resize input based on content
				this.input.style.height = 'auto';
				this.input.style.height = this.input.scrollHeight + 'px';
			}, 0);
		});

		// if near the bottom, keep scroll position at the bottom
		window.addEventListener("resize", () => {
			this.remainAtBottomIfNecessary();
		});
	}

	OnOpen() {
		super.OnOpen();
		this.chatDisplayName.innerText = window.currentChat.name;
		this.clearMessages();
		this.loadMessages().then(() => {
			this.scrollToBottom();

			this.loadMessagesIntervalId = setInterval(async () => {
				await this.loadMessages();
				this.remainAtBottomIfNecessary(0.1);
			}, this.loadMessagesIntervalMs);
		});
	}
	OnClose() {
		super.OnClose();
		clearInterval(this.loadMessagesIntervalId);
	}

	clearMessages() {
		this.messagesElem.querySelectorAll('.pageMessages-message').forEach(e => e.remove());
	}

	async loadMessages() {
		let [ meta, messages ] = await Networker.postApi("Chat.GetMessages", {
			chatId: window.currentChat.id,
			lastMessageId: this.lastMessageId
		});
		if (!meta.success) return;
		for (let i = 0; i < messages.length; ++i) {
			let [ messageId, messageText, messageUsername, messageTime ]: [number, string, string, string] = messages[i];
			this.createMessageElem(messageId, messageText, messageUsername, messageTime, false);
		}
	}

	private createMessageElem(messageId: number, messageText: string, messageUsername: string, messageTime: string, isGroupChat: boolean) {
		if (this.excludedMessageIds.indexOf(messageId) !== -1) return;

		let messageElemFragment: DocumentFragment = this.messageTemplate.content.cloneNode(true) as DocumentFragment;
		let messageElem: HTMLLIElement = messageElemFragment.querySelector("li");

		messageElem.setAttribute("data-messageId", messageId + "");
		messageElem.querySelector(".pageMessages-message-text").innerText = messageText;
		messageElem.querySelector(".pageMessages-message-time").textContent = PageMessages.timestampToTime(parseInt(messageTime));

		if (!messageUsername || messageUsername == Session.user.name) {
			messageElem.classList.add("pageMessages-message-own");
		} else {
			if (isGroupChat) {
				messageElem.querySelector(".pageMessages-message-sender").textContent = PageMessages.formatUsername(messageUsername);
			}
		}

		this.messagesElem.append(messageElemFragment);
	}

	private async onInputFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!this.input.value) return;

		let time = new Date().toLocaleTimeString("en-GB", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});
		let messageText = this.input.value;

		// clear input and return focus
		this.input.value = "";
		this.input.focus({
			preventScroll: true
		});

		let [ meta, newId ]: [ Meta, number ] = await Networker.postApi("Chat.Send", {
			chatId: window.currentChat.id,
			messageText: messageText
		});
		if (meta.success) {
			this.createMessageElem(newId, messageText, Session.user.name, time, false);
			this.excludedMessageIds.push(newId);
			this.scrollToBottom();
		}
	}

	private static formatUsername(username: string): string {
		if (username.length > 15) return username.substring(0, 13) + "...";
		return username;
	}

	private scrollToBottom() {
		this.messagesElem.scrollTo(0, this.messagesElem.scrollHeight);
	}
	private remainAtBottomIfNecessary(ratio: number = 0.3) {
		let maxOffset = Math.max(this.messagesElem.offsetHeight * ratio, 350);
		if (this.messagesElem.scrollHeight - this.messagesElem.scrollTop > maxOffset) {
			this.scrollToBottom();
		}
	}

	private static timestampToTime(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleTimeString("en-GB", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});
	}
}
