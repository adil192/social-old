/// <reference path="./Extensions.ts"/>
import {Page} from "./Page";
import {Networker} from "./Networker";

export class PageChat extends Page {
	pageChatSearch: HTMLInputElement;
	pageChatOptions: HTMLDivElement;
	pageChatOptionTemplate: HTMLTemplateElement;

	shouldUpdateChatList: boolean = true;

	constructor() {
		super("Chat", false);

		this.pageChatSearch = this.pageElem.querySelector("#pageChatSearch");
		this.pageChatOptions = this.pageElem.querySelector("#pageChatOptions");
		this.pageChatOptionTemplate = this.pageElem.querySelector("#pageChatOptionTemplate");

		this.updateChatList().then();

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
		}, 3000);

		let [ meta, chats ] = await Networker.postApi("Chat.List");
		if (!meta.success) return;

		this.pageChatOptions.querySelectorAll('li').forEach(e => e.remove());

		for (let i in chats) {
			let chat = chats[i];
			this.createChatOption(chat[0], chat[1], chat[2], chat[3]);
		}
	}

	createChatOption(chatId: number, name: string, lastMsg: string, timestamp: number, pfp: string = "assets/images/unknown.webp") {
		let optionElemFragment: DocumentFragment = this.pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
		let optionElem: HTMLLIElement = optionElemFragment.querySelector("li");

		(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
		optionElem.querySelector(".pageChat-option-name").textContent = name;
		optionElem.querySelector(".pageChat-option-lastMsg").textContent = lastMsg.trim();
		optionElem.querySelector(".pageChat-option-date").textContent = new Date(timestamp * 1000).toLocaleDateString();
		// todo: set alt text and aria-labels

		optionElem.addEventListener("click", function () {
			window.currentChat = {
				id: chatId,
				name: name
			};
			window.openPage("Messages")
		});

		this.pageChatOptions.append(optionElemFragment);
	}

}
