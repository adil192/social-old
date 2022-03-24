import {Page} from "./Page";
import {Networker} from "./Networker";

export class PageChat extends Page {
	pageChatOptions: HTMLDivElement;
	pageChatOptionTemplate: HTMLTemplateElement;

	constructor() {
		super("pageChat");
		this.pageChatOptions = this.pageElem.querySelector("#pageChatOptions");
		this.pageChatOptionTemplate = this.pageElem.querySelector("#pageChatOptionTemplate");

		this.updateChatList().then();
	}

	async updateChatList() {
		let [ success, chats ] = await Networker.postApi("Chat.List.php");
		if (success) for (let i in chats) {
			let chat = chats[i];
			this.createChatOption(chat[0], chat[1], chat[2]);
		}
	}

	createChatOption(id: number, name: string, lastMsg: string = null, pfp: string = "assets/images/unknown.webp") {
		let optionElem: DocumentFragment = this.pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
		(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
		optionElem.querySelector(".pageChat-option-name").textContent = name;
		optionElem.querySelector(".pageChat-option-lastMsg").textContent = lastMsg ?? "Say hi!";
		// todo: set alt text and aria-labels
		this.pageChatOptions.append(optionElem);
	}

}
