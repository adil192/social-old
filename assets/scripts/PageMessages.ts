import {Page} from "./Page";
import {Meta, Networker} from "./Networker";
import {Session} from "./Session";


class BaseMessage {
	type: string;
	id: number;
	username?: string;
	timestamp: number;

	text?: string;
	url?: string;
	width?: number;
	height?: number;
}
class TextMessage extends BaseMessage {
	type: string = "Text";
	text: string;
}
class ImageMessage extends BaseMessage {
	type: string = "Image";
	url: string;
	width: number;
	height: number;
}


export class PageMessages extends Page {

	chatDisplayName: HTMLSpanElement;
	messagesElem: HTMLUListElement;
	lastReadText: HTMLLIElement;
	messageTemplate: HTMLTemplateElement;
	imageTemplate: HTMLTemplateElement;
	daySeparatorTemplate: HTMLTemplateElement;

	inputForm: HTMLFormElement;
	input: HTMLTextAreaElement;
	mediaInput: HTMLInputElement;

	lastMessageId: number = 0;
	lastMessageDay: string = "";
	lastMessageTimestamp: number = 0;

	excludedMessageIds: number[] = [];
	loadMessagesIntervalId: number = null;
	loadMessagesFrame: number = null;
	readonly loadMessagesIntervalMs: number = 1000;

	constructor() {
		super("Messages", true);
		this.chatDisplayName = this.pageElem.querySelector(".pageMessages-chatDisplayName");
		this.messagesElem = this.pageElem.querySelector("#pageMessages-messages");
		this.lastReadText = this.pageElem.querySelector(".lastRead-text");
		this.messageTemplate = this.pageElem.querySelector("#pageMessages-message-template");
		this.imageTemplate = this.pageElem.querySelector("#pageMessages-image-template");
		this.daySeparatorTemplate = this.pageElem.querySelector("#pageMessages-daySeparator-template");

		this.inputForm = this.pageElem.querySelector("#pageMessagesInputForm");
		this.input = this.pageElem.querySelector("#pageMessagesInput");
		this.mediaInput = this.pageElem.querySelector("#pageMessagesFile");

		this.inputForm.addEventListener("submit", (e) => this.onInputFormSubmit(e));
		this.input.addEventListener("keydown", () => {
			setTimeout(() => this.autoSizeInput(), 0);
		});
		this.mediaInput.addEventListener("change", async () => {
			await this.onMediaUpload();
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

	async OnOpening() {
		await super.OnOpening();
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
	async OnClose() {
		await super.OnClose();
		this.lastMessageId = 0;
		this.lastMessageDay = "";
		this.lastMessageTimestamp = 0;
		this.excludedMessageIds = [];
		clearInterval(this.loadMessagesIntervalId);
		cancelAnimationFrame(this.loadMessagesFrame);
	}

	clearMessages() {
		this.messagesElem.querySelectorAll('li:not(.lastRead-text)').forEach(e => e.remove());
	}

	async loadMessages() {
		let [ meta, messages ] = await Networker.postApi("Chat.GetMessages", {
			chatId: window.currentChat.id + "",
			lastMessageId: this.lastMessageId + ""
		});
		if (!meta.success) return;

		let isNearBottom = this.isNearBottom(0.1);
		for (let i = 0; i < messages.length; ++i) {
			let message: BaseMessage = messages[i];
			if (message.id > this.lastMessageId) this.lastMessageId = message.id;
			if (this.excludedMessageIds.indexOf(message.id) !== -1) continue;
			this.createMessageElem(message);
		}
		if (messages.length && isNearBottom) {
			setTimeout(() => this.scrollToBottom(), 1)
		}

		if (meta.LastRead.LastMessageId >= this.lastMessageId) {
			this.messagesElem.classList.add("lastRead-enabled");
		} else {
			this.messagesElem.classList.remove("lastRead-enabled");
		}
	}

	private createMessageElem(message: BaseMessage) {
		let [ time, day, full_date ] = PageMessages.parseTimestamp(message.timestamp);
		if (day != this.lastMessageDay && message.timestamp > this.lastMessageTimestamp) { // a new day
			this.lastMessageDay = day;
			this.createDaySeparatorElem(day, full_date);
		}
		this.lastMessageTimestamp = message.timestamp;

		switch (message.type) {
			case "Image":
				this._createMessageElem_Image(message as ImageMessage, time);
				break;
			default:
				this._createMessageElem_Text(message as TextMessage, time);
				break;
		}
	}
	private _createMessageElem_Text(message: TextMessage, messageTime: string) {
		let messageElemFragment: DocumentFragment = this.messageTemplate.content.cloneNode(true) as DocumentFragment;
		let messageElem: HTMLLIElement = messageElemFragment.querySelector("li");

		messageElem.setAttribute("data-messageId", message.id + "");
		messageElem.querySelector(".pageMessages-message-text").innerText = message.text;
		messageElem.querySelector(".pageMessages-message-time").textContent = messageTime;

		if (!message.username || message.username == Session.user.name) {
			messageElem.classList.add("pageMessages-message-own");
		} else {
			if (window.currentChat.isGroupChat) {
				messageElem.querySelector(".pageMessages-message-sender").textContent = PageMessages.formatUsername(message.username);
			}
		}

		this.messagesElem.insertBefore(messageElemFragment, this.lastReadText);
	}
	private _createMessageElem_Image(message: ImageMessage, messageTime: string) {
		let messageElemFragment: DocumentFragment = this.imageTemplate.content.cloneNode(true) as DocumentFragment;
		let messageElem: HTMLLIElement = messageElemFragment.querySelector("li");

		messageElem.setAttribute("data-messageId", message.id + "");
		messageElem.querySelector(".pageMessages-message-time").textContent = messageTime;

		let img: HTMLImageElement = messageElem.querySelector("img");
		img.width = message.width;
		img.height = message.height;
		img.style.width = message.width + "px";
		img.src = message.url;

		if (!message.username || message.username == Session.user.name) {
			messageElem.classList.add("pageMessages-message-own");
		} else {
			if (window.currentChat.isGroupChat) {
				messageElem.querySelector(".pageMessages-message-sender").textContent = PageMessages.formatUsername(message.username);
			}
		}

		this.messagesElem.insertBefore(messageElemFragment, this.lastReadText);
	}

	private createDaySeparatorElem(day: string, full_date: string) {
		let daySeparatorFragment: DocumentFragment = this.daySeparatorTemplate.content.cloneNode(true) as DocumentFragment;
		let daySeparator: HTMLLIElement = daySeparatorFragment.querySelector("li");

		daySeparator.innerText = day;
		daySeparator.title = full_date;

		this.messagesElem.insertBefore(daySeparatorFragment, this.lastReadText);
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
			chatId: window.currentChat.id + "",
			messageText: messageText
		});
		if (meta.success) {
			let message: TextMessage = {
				id: newId,
				type: "Text",
				text: messageText,
				username: Session.user.name,
				timestamp: timestamp
			};
			this.createMessageElem(message);
			this.excludedMessageIds.push(newId);
			this.scrollToBottom();
		}
	}

	private async onMediaUpload() {
		if (this.mediaInput.files.length == 0) return;

		let timestamp: number = +new Date() / 1000;

		let [ meta, response ] = await Networker.postApi("Chat.SendMedia", {
			chatId: window.currentChat.id + "",
			file: this.mediaInput.files[0]
		});
		if (meta.success) {
			let message: ImageMessage = {
				id: response.id,
				type: "Image",
				url: response.url,
				username: Session.user.name,
				timestamp: timestamp,
				width: response.width,
				height: response.height
			};
			this.createMessageElem(message);
			this.excludedMessageIds.push(response.id);
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

	private static parseTimestamp(timestamp: number): [string, string, string] {
		let date = new Date(timestamp * 1000);

		let time = date.toLocaleTimeString("en-GB", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});

		let day;
		let daysSinceDate: number =
			Math.round((new Date().setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 86400000);

		if (daysSinceDate == 0) {
			day = "Today";
		} else if (daysSinceDate == 1) {
			day = "Yesterday";
		} else if (daysSinceDate < 7) {
			// use the day of the week e.g. Friday
			day = date.toLocaleString(
				'default', {weekday: 'long'}
			);
		} else {
			day = date.toLocaleDateString("en-GB");
		}

		return [ time, day, date.toLocaleDateString("en-GB") ];
	}
}
