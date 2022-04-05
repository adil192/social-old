/// <reference path="./Extensions.ts"/>
import {Page} from "./Page";
import {Networker} from "./Networker";

export class PageChat extends Page {
	pageChatSearch: HTMLInputElement;
	pageChatOptions: HTMLDivElement;
	pageChatOptionTemplate: HTMLTemplateElement;

	constructor() {
		super("pageChat");

		this.pageChatSearch = this.pageElem.querySelector("#pageChatSearch");
		this.pageChatOptions = this.pageElem.querySelector("#pageChatOptions");
		this.pageChatOptionTemplate = this.pageElem.querySelector("#pageChatOptionTemplate");

		this.updateChatList().then();

		this.pageChatSearch.addEventListener("click", function() {
			window.openPage("pageSearch");
		})
	}

	async updateChatList() {
		let [ meta, chats ] = await Networker.postApi("Chat.List");
		if (meta.success) for (let i in chats) {
			let chat = chats[i];
			this.createChatOption(chat[0], chat[1], chat[2]);
		}
	}

	createChatOption(chatId: number, name: string, lastMsg: string = null, pfp: string = "assets/images/unknown.webp") {
		let optionElemFragment: DocumentFragment = this.pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
		let optionElem: HTMLLIElement = optionElemFragment.querySelector("li");

		(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
		optionElem.querySelector(".pageChat-option-name").textContent = name;
		optionElem.querySelector(".pageChat-option-lastMsg").textContent = lastMsg ?? "Say hi!";
		// todo: set alt text and aria-labels

		optionElem.addEventListener("click", function () {
			window.currentChat = {
				id: chatId,
				name: name
			};
			window.openPage("pageMessages")
		});

		this.pageChatOptions.append(optionElemFragment);
	}

}
