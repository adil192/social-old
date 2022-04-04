import {Page} from "./Page";

export class PageSearch extends Page {
	pageSearchInput: HTMLInputElement;

	constructor() {
		super("pageSearch", "pageOverlaySearch");

		this.pageSearchInput = this.pageElem.querySelector("#pageSearchInput");
		this.pageSearchInput.onkeyup = () => this.onSearchTermChange();
	}

	OnOpen() {
		super.OnOpen();

		this.pageSearchInput.value = "";
		this.pageSearchInput.focus({
			preventScroll: true
		});
	}

	onSearchTermChange() {

	}
}
