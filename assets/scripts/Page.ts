/// <reference path="./Extensions.ts"/>

export class Page {
	static Instance: Page;

	pageId: string;
	pageElem: HTMLDivElement;
	pageState: PageState;

	private hasBeenOpened: boolean = false;

	constructor(pageId: string, isOverlay: boolean) {
		this.pageId = pageId;
		this.pageElem = document.getElementById("page" + pageId) as HTMLDivElement;
		this.pageElem.Page = this;
		(<any>this.constructor).Instance = this;
	}

	public async OnOpening() {
		this.pageState = PageState.Opening;
		if (!this.hasBeenOpened) await this.OnFirstOpen();
	}
	protected async OnFirstOpen() {
		this.hasBeenOpened = true;
	}
	public async OnOpened() {
		this.pageState = PageState.Opened;
	}
	public async OnClose() {
		this.pageState = PageState.Closed;
	}
}

export enum PageState {
	Closed,
	Opening,
	Opened
}
