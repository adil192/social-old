import {Page} from "./Page";
import {Meta, Networker} from "./Networker";

export class PageSearch extends Page {
	pageSearchResults: HTMLUListElement;
	pageChatOptionTemplate: HTMLTemplateElement;

	input: HTMLInputElement;
	_pageChatInput: HTMLInputElement;
	searchTimeoutMs: number = 300;
	searchTimeoutId: number = null;

	constructor() {
		super("Search", true);

		this.pageSearchResults = this.pageElem.querySelector("#pageSearchResults");
		this.pageChatOptionTemplate = document.querySelector("#pageChatOptionTemplate");

		this.input = this.pageElem.querySelector("#pageSearchInput");
		this._pageChatInput = document.querySelector("#pageChatSearch");
		this._pageChatInput.addEventListener("keyup", () => {
			this.input.value = this._pageChatInput.value;
		})
		this.input.onkeyup = () => {
			clearTimeout(this.searchTimeoutId);
			this.searchTimeoutId = setTimeout(() => this.onSearchTermChange(), this.searchTimeoutMs);
		};
	}

	async OnOpening() {
		await super.OnOpening();
		this.input.value = "";
		this._pageChatInput.value = "";
	}
	async OnOpened() {
		await super.OnOpened();
		this.input.focus({
			preventScroll: true
		});
	}
	async OnClose() {
		await super.OnClose();
		this.input.value = "";
		this._pageChatInput.value = "";
	}

	async onSearchTermChange() {
		let searchTerm = this.input.value;
		if (!searchTerm) return;

		let [ meta, response ]: [Meta, Record<string, any>[]] = await Networker.postApi("Users.Search", {
			"searchTerm": searchTerm
		});
		if (!meta.success) return console.log(response);

		this.clearChatOptions();
		for (let i in response) {
			let result = response[i];
			this.createChatOption(result.UserId, result.Username, result.Username);
		}
	}

	clearChatOptions() {
		this.pageSearchResults.querySelectorAll('li').forEach(e => e.remove());
	}

	createChatOption(userId: number, username: string, name: string, lastMsg: string = null, pfp: string = "assets/images/unknown.webp") {
		let optionElemFragment: DocumentFragment = this.pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
		let optionElem: HTMLLIElement = optionElemFragment.querySelector("li");

		(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
		optionElem.querySelector(".pageChat-option-name").textContent = name;

		optionElem.addEventListener("click", async () => {
			this.clearChatOptions();
			await this.createChat(userId, username);
		});

		this.pageSearchResults.append(optionElemFragment);
	}


	private async createChat(userId: number, username: string) {
		let [ meta, response ]: [Meta, number] = await Networker.postApi("Chat.Create", {
			"userIds": [userId].join(",")
		});
		if (!meta.success) history.back();

		window.currentChat = {
			id: response,
			name: username,
			isGroupChat: false
		};
		window.openPage("Messages");
	}
}
