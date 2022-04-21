/// <reference path="./Extensions.ts"/>
import {Page} from "./Page";
import {Networker} from "./Networker";

export class PageChat extends Page {
	pageChatRefreshBtn: HTMLButtonElement;
	pageChatSearch: HTMLInputElement;
	pageChatOptions: HTMLDivElement;
	pageChatOptionTemplate: HTMLTemplateElement;

	shouldUpdateChatList: boolean = true;

	constructor() {
		super("Chat", false);

		this.pageChatRefreshBtn = this.pageElem.querySelector(".pageChat-refreshBtn");
		this.pageChatSearch = this.pageElem.querySelector("#pageChatSearch");
		this.pageChatOptions = this.pageElem.querySelector("#pageChatOptions");
		this.pageChatOptionTemplate = this.pageElem.querySelector("#pageChatOptionTemplate");

		this.updateChatList().then();

		this.pageChatRefreshBtn.addEventListener("click", async () => {
			this.shouldUpdateChatList = true;
			await this.updateChatList();
		})
		this.pageChatSearch.addEventListener("click", function() {
			window.openPage("Search");
		})
	}

	async OnOpening() {
		await super.OnOpening();

		await this.updateChatList();
	}

	async updateChatList() {
		if (!this.shouldUpdateChatList) return;
		this.shouldUpdateChatList = false;
		setTimeout(() => {
			this.shouldUpdateChatList = true;
		}, 1000);

		let [ meta, chats ] = await Networker.postApi("Chat.List");
		if (!meta.success) return;

		this.pageChatOptions.querySelectorAll('li').forEach(e => e.remove());

		for (let i in chats) {
			let chat = chats[i];
			this.createChatOption(chat[0], chat[1], chat[2], chat[3], chat[4], chat[5]);
		}
	}

	createChatOption(chatId: number, userId: number, name: string, lastMsg: string, timestamp: number, unread: boolean, pfp: string = "assets/images/unknown.webp") {
		let optionElemFragment: DocumentFragment = this.pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
		let optionElem: HTMLLIElement = optionElemFragment.querySelector("li");

		if (unread) optionElem.classList.add("pageChat-option-unread");
		(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
		optionElem.querySelector(".pageChat-option-name").textContent = name;
		optionElem.querySelector(".pageChat-option-lastMsg").textContent = lastMsg.trim();
		optionElem.querySelector(".pageChat-option-date").textContent = PageChat.parseTimestamp(timestamp);
		// todo: set alt text and aria-labels

		optionElem.addEventListener("click", function () {
			window.currentChat = {
				id: chatId,
				name: name,
				isGroupChat: false,
				userId: userId
			};
			window.openPage("Messages")
		});

		this.pageChatOptions.append(optionElemFragment);
	}

	static parseTimestamp(timestamp: number): string {
		let date = new Date(timestamp * 1000);
		let now = new Date();

		let mins = (+now - +date) / 1000 / 60,
			hours = mins / 60;

		if (mins < 1) return "Now";
		if (hours < 1) return Math.round(mins) + " m";
		if (hours < 24) return Math.round(hours) + " h";

		let days = Math.round((now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / 1000 / 60 / 60 / 24);

		if (days < 7) return days + " d";
		return Math.floor(days/7) + " w";
	}

}
