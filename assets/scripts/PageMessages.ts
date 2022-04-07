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
	loadMessagesFrame: number = null;
	readonly loadMessagesIntervalMs: number = 1000;

	constructor() {
		super("pageMessages", "pageOverlayMessages");
		this.chatDisplayName = this.pageElem.querySelector(".pageMessages-chatDisplayName");
		this.messagesElem = this.pageElem.querySelector("#pageMessages-messages");
		this.messageTemplate = this.pageElem.querySelector("#pageMessages-message-template");

		this.inputForm = this.pageElem.querySelector("#pageMessagesInputForm");
		this.input = this.pageElem.querySelector("#pageMessagesInput");

		this.inputForm.addEventListener("submit", (e) => this.onInputFormSubmit(e));
		this.input.addEventListener("keydown", () => {
			setTimeout(() => this.autoSizeInput(), 0);
		});

		// if near the bottom, keep scroll position at the bottom
		window.addEventListener("resize", () => {
			if (this.isNearBottom()) this.scrollToBottom();
		});
	}

	autoSizeInput() {
		// resize input based on content
		this.input.style.height = 'auto';
		this.input.style.height = this.input.scrollHeight + 'px';
	}

	OnOpening() {
		super.OnOpening();
		this.chatDisplayName.innerText = window.currentChat.name;
		this.clearMessages();
		this.loadMessages().then(() => {
			this.scrollToBottom();

			clearInterval(this.loadMessagesIntervalId);
			this.loadMessagesIntervalId = setInterval(() => {
				cancelAnimationFrame(this.loadMessagesFrame);
				this.loadMessagesFrame = requestAnimationFrame(() => this.loadMessages());
			}, this.loadMessagesIntervalMs);
		});
	}
	OnClose() {
		super.OnClose();
		this.lastMessageId = 0;
		this.excludedMessageIds = [];
		clearInterval(this.loadMessagesIntervalId);
		cancelAnimationFrame(this.loadMessagesFrame);
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

		let isNearBottom = this.isNearBottom(0.1);
		for (let i = 0; i < messages.length; ++i) {
			let [ messageId, messageText, messageUsername, messageTime ]: [number, string, string, number ] = messages[i];
			if (messageId > this.lastMessageId) this.lastMessageId = messageId;
			if (this.excludedMessageIds.indexOf(messageId) !== -1) continue;
			this.createMessageElem(messageId, messageText, messageUsername, messageTime, false);
		}
		if (messages.length && isNearBottom) this.scrollToBottom();
	}

	private createMessageElem(messageId: number, messageText: string, messageUsername: string, messageTime: number, isGroupChat: boolean) {
		let messageElemFragment: DocumentFragment = this.messageTemplate.content.cloneNode(true) as DocumentFragment;
		let messageElem: HTMLLIElement = messageElemFragment.querySelector("li");

		messageElem.setAttribute("data-messageId", messageId + "");
		messageElem.querySelector(".pageMessages-message-text").innerText = messageText;
		messageElem.querySelector(".pageMessages-message-time").textContent = PageMessages.timestampToTime(messageTime);

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

		let timestamp: number = +new Date() / 1000;
		let messageText = this.input.value.trim();

		// clear input and return focus
		this.input.value = "";
		this.autoSizeInput();
		this.input.focus({
			preventScroll: true
		});

		let [ meta, newId ]: [ Meta, number ] = await Networker.postApi("Chat.Send", {
			chatId: window.currentChat.id,
			messageText: messageText
		});
		if (meta.success) {
			this.createMessageElem(newId, messageText, Session.user.name, timestamp, false);
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
	private isNearBottom(ratio: number = 0.3) {
		let maxOffset = Math.max(this.messagesElem.offsetHeight * ratio, 350);
		return this.messagesElem.scrollHeight - this.messagesElem.scrollTop > maxOffset;
	}

	private static timestampToTime(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleTimeString("en-GB", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});
	}
}
