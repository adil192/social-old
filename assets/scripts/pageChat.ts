let pageChat: HTMLDivElement;
let pageChatOptions: HTMLDivElement;
let pageChatOptionTemplate: HTMLTemplateElement;


window.addEventListener("load", function() {
	pageChat = document.querySelector("#pageChat");
	pageChatOptions = pageChat.querySelector("#pageChatOptions");
	pageChatOptionTemplate = pageChatOptions.querySelector("#pageChatOptionTemplate");

	createChatOption("John Doe", "Hey!");
	createChatOption("John Doe", "Hey!");
	createChatOption("John Doe", "Hey!");
	createChatOption("John Doe", "Hey!");
});

function createChatOption(name: string, lastMessage: string = null, pfp: string = "assets/images/unknown.webp") {
	let optionElem: DocumentFragment = pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
	(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
	optionElem.querySelector(".pageChat-option-main").textContent = name;
	// todo: set alt text and aria-labels
	pageChatOptions.append(optionElem);
}
