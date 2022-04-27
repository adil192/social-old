import {Page, PageState} from "./Page";
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

	backdrop: HTMLDivElement;
	chatDisplayName: HTMLAnchorElement;
	messagesElem: HTMLUListElement;
	lastReadText: HTMLLIElement;
	messageTemplate: HTMLTemplateElement;
	imageTemplate: HTMLTemplateElement;
	daySeparatorTemplate: HTMLTemplateElement;
	scrollToBottomIndicator: HTMLDivElement;

	inputForm: HTMLFormElement;
	input: HTMLTextAreaElement;
	mediaInput: HTMLInputElement;

	expandedImage: HTMLImageElement;
	expandedImageTransform: string;
	expandImageTimeout: number;
	unfreezeImageTimeout: number;
	frozenImage: HTMLImageElement;

	isLastMessageMine: boolean = false;
	lastMessageId: number = 0;
	lastMessageDay: string = "";
	lastMessageTimestamp: number = 0;

	excludedMessageIds: number[] = [];
	loadMessagesIntervalId: number = null;
	loadMessagesFrame: number = null;
	readonly loadMessagesIntervalMs: number = 1000;

	constructor() {
		super("Messages", true);
		this.backdrop = this.pageElem.querySelector(".page-backdrop");
		this.chatDisplayName = this.pageElem.querySelector(".pageMessages-chatDisplayName");
		this.messagesElem = this.pageElem.querySelector("#pageMessages-messages");
		this.lastReadText = this.pageElem.querySelector(".lastRead-text");
		this.messageTemplate = this.pageElem.querySelector("#pageMessages-message-template");
		this.imageTemplate = this.pageElem.querySelector("#pageMessages-image-template");
		this.daySeparatorTemplate = this.pageElem.querySelector("#pageMessages-daySeparator-template");
		this.scrollToBottomIndicator = this.pageElem.querySelector(".scrollToBottomIndicator");

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

		window.addEventListener("resize", () => {
			// if near the bottom, keep scroll position at the bottom
			if (this.isNearBottom()) this.scrollToBottom();
		});
		this.messagesElem.addEventListener("scroll", () => {
			this.updateScrollToBottomIndicator();
		});
		this.scrollToBottomIndicator.addEventListener("click", () => {
			this.scrollToBottom();
		});

		window.pageMessages = {
			expandImage: (image: HTMLImageElement) => this.expandImage(image)
		}
	}

	autoSizeInput() {
		// resize input based on content
		this.input.style.height = 'auto';
		this.input.style.height = this.input.scrollHeight + 'px';
	}
	expandImage(image: HTMLImageElement) {
		clearTimeout(this.expandImageTimeout);
		if (image.classList.contains("expand")) {
			this.expandedImage = null;

			image.style.transitionDuration = "0s";
			image.style.transform = this.expandedImageTransform;
			image.classList.remove("post-expand");
			setTimeout(() => {
				image.style.transitionDuration = null;
				image.classList.remove("pre-expand", "expand");
				image.style.transform = null;
			});
			this.backdrop.classList.remove("page-backdrop-show");

			if (this.frozenImage != null) {
				clearTimeout(this.unfreezeImageTimeout);
				this.frozenImage.parentElement.style.width = null;
				this.frozenImage.parentElement.style.height = null;
			}
			this.frozenImage = image;
			this.unfreezeImageTimeout = setTimeout(() => {
				image.parentElement.style.width = null;
				image.parentElement.style.height = null;
				this.frozenImage = null;
			}, 300);
		} else {
			if (!!this.expandedImage) {
				this.expandedImage.classList.remove("pre-expand", "expand", "post-expand");
				this.expandedImage.style.transform = null;
			}
			this.expandedImage = image;

			// freeze parent's size so the page doesn't reposition
			image.parentElement.style.width = image.parentElement.offsetWidth + "px";
			image.parentElement.style.height = image.parentElement.offsetHeight + "px";

			image.classList.add("pre-expand");
			image.style.transitionDuration = "0s";

			this.expandedImageTransform = this._getExpandTransform(image);
			image.style.transform = this.expandedImageTransform;

			image.classList.remove("pre-expand");
			image.style.transitionDuration = null;
			image.classList.add("expand");
			this.backdrop.classList.add("page-backdrop-show");

			this.expandImageTimeout = setTimeout(() => {
				image.style.transitionDuration = "0s";
				image.style.transform = null;
				image.classList.add("post-expand");
			}, 300);
		}
	}
	private _getExpandTransform(image: HTMLImageElement): string {
		let imageRect: DOMRect = image.getBoundingClientRect();
		let messagesRect: DOMRect = this.messagesElem.getBoundingClientRect();
		let bodyRect: DOMRect = document.body.getBoundingClientRect();

		let dx = (messagesRect.left + messagesRect.width / 2) - (imageRect.left + imageRect.width / 2);
		let dy = (messagesRect.top + messagesRect.height / 2) - (imageRect.top + imageRect.height / 2);

		let scale = Math.min(
			messagesRect.width / imageRect.width,
			messagesRect.height / imageRect.height
		);

		return `translate(${dx}px, ${dy}px) scale(${scale})`;
	}

	async OnOpening() {
		await super.OnOpening();

		// fill header info
		this.chatDisplayName.innerText = window.currentChat.name;
		if (!window.currentChat.isGroupChat) {
			this.chatDisplayName.onclick = function () {
				window.currentProfileId = window.currentChat.userId;
			}
		}

		// load messages
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
		this.backdrop.classList.remove("page-backdrop-show");
	}

	clearMessages() {
		this.messagesElem.querySelectorAll('li.pageMessages-clearable').forEach(e => e.remove());
	}

	async loadMessages() {
		let [ meta, messages ]: [Meta, BaseMessage[]] = await Networker.postApi("Chat.GetMessages", {
			chatId: window.currentChat.id + "",
			lastMessageId: this.lastMessageId + ""
		});
		if (!meta.success) return;

		let isNearBottom = this.isNearBottom(0.1);
		for (let i = 0; i < messages.length; ++i) {
			let message = messages[i];
			if (message.id > this.lastMessageId) this.lastMessageId = message.id;
			if (this.excludedMessageIds.indexOf(message.id) !== -1) continue;
			this.createMessageElem(message);
		}
		if (messages.length && isNearBottom) {
			setTimeout(() => this.scrollToBottom(), 1)
		}

		if (meta.LastRead.LastMessageId >= this.lastMessageId && this.isLastMessageMine) {
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

		this.isLastMessageMine = !message.username || message.username == Session.user.name;
		this.messagesElem.classList.remove("lastRead-enabled");

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

	private updateScrollToBottomIndicator() {
		if (this.needsScrollToBottomIndicator()) {
			this.scrollToBottomIndicator.classList.add("show");
		} else {
			this.scrollToBottomIndicator.classList.remove("show");
		}
	}

	private static formatUsername(username: string): string {
		if (username.length > 15) return username.substring(0, 13) + "...";
		return username;
	}

	private scrollToBottom() {
		this.messagesElem.scrollTo(0, this.messagesElem.scrollHeight);
	}
	private scrollHeightUnderViewport() {
		return this.messagesElem.scrollHeight - this.messagesElem.scrollTop - this.messagesElem.offsetHeight;
	}
	private isNearBottom(ratio: number = 0.3) {
		const maxOffset = Math.max(this.messagesElem.offsetHeight * ratio, 350);
		return this.scrollHeightUnderViewport() < maxOffset;
	}
	private needsScrollToBottomIndicator() {
		const minOffset = Math.max(this.messagesElem.offsetHeight, 350);
		return this.scrollHeightUnderViewport() > minOffset && this.pageState == PageState.Opened;
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
