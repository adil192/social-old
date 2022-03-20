import {Page} from "./Page.js";

export class PageChat extends Page {
	pageChatOptions: HTMLDivElement;
	pageChatOptionTemplate: HTMLTemplateElement;

	constructor() {
		super("pageChat");
		this.pageChatOptions = this.pageElem.querySelector("#pageChatOptions");
		this.pageChatOptionTemplate = this.pageElem.querySelector("#pageChatOptionTemplate");

		this.createChatOption("John Doe", "What are you up to tomorrow after uni?");
		this.createChatOption("John Doe");
		this.createChatOption("John Doe", "Sorted :)");
		this.createChatOption("John Doe", "Hey!");
		this.createChatOption("John Doe", "What are you up to tomorrow after uni?");
		this.createChatOption("John Doe");
		this.createChatOption("John Doe", "Sorted :)");
		this.createChatOption("John Doe", "Hey!");
		this.createChatOption("John Doe", "What are you up to tomorrow after uni?");
		this.createChatOption("John Doe");
		this.createChatOption("John Doe", "Sorted :)");
		this.createChatOption("John Doe", "Hey!");
	}

	createChatOption(name: string, lastMsg: string = "Say hi!", pfp: string = "assets/images/unknown.webp") {
		let optionElem: DocumentFragment = this.pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
		(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
		optionElem.querySelector(".pageChat-option-name").textContent = name;
		optionElem.querySelector(".pageChat-option-lastMsg").textContent = lastMsg;
		// todo: set alt text and aria-labels
		this.pageChatOptions.append(optionElem);
	}

}
