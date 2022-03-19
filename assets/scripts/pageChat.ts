let pageChat: HTMLDivElement;
let pageChatOptions: HTMLDivElement;
let pageChatOptionTemplate: HTMLTemplateElement;


window.addEventListener("load", function() {
	pageChat = document.querySelector("#pageChat");
	pageChatOptions = pageChat.querySelector("#pageChatOptions");
	pageChatOptionTemplate = pageChatOptions.querySelector("#pageChatOptionTemplate");

	createChatOption("John Doe", "What are you up to tomorrow after uni?");
	createChatOption("John Doe");
	createChatOption("John Doe", "Sorted :)");
	createChatOption("John Doe", "Hey!");
	createChatOption("John Doe", "What are you up to tomorrow after uni?");
	createChatOption("John Doe");
	createChatOption("John Doe", "Sorted :)");
	createChatOption("John Doe", "Hey!");
	createChatOption("John Doe", "What are you up to tomorrow after uni?");
	createChatOption("John Doe");
	createChatOption("John Doe", "Sorted :)");
	createChatOption("John Doe", "Hey!");
});

function createChatOption(name: string, lastMsg: string = "Say hi!", pfp: string = "assets/images/unknown.webp") {
	let optionElem: DocumentFragment = pageChatOptionTemplate.content.cloneNode(true) as DocumentFragment;
	(<HTMLImageElement>optionElem.querySelector(".pageChat-option-pfp")).src = pfp;
	optionElem.querySelector(".pageChat-option-name").textContent = name;
	optionElem.querySelector(".pageChat-option-lastMsg").textContent = lastMsg;
	// todo: set alt text and aria-labels
	pageChatOptions.append(optionElem);
}
