/// <reference path="./Extensions.ts"/>

export abstract class Page {
	pageId: string;
	pageElem: HTMLDivElement;
	pageState: PageState;

	protected constructor(pageId: string, elemId: string = null) {
		this.pageId = pageId;
		this.pageElem = document.getElementById(elemId ?? pageId) as HTMLDivElement;
		this.pageElem.Page = this;
	}

	public OnOpening() {
		this.pageState = PageState.Opening;
	}
	public OnOpened() {
		this.pageState = PageState.Opened;
		this.pageElem.scrollIntoView({
			behavior: "smooth"
		});
	}
	public OnClose() {
		this.pageState = PageState.Closed;
	}
}

export enum PageState {
	Closed,
	Opening,
	Opened
}
