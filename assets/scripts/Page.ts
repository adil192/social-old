/// <reference path="./Extensions.ts"/>

export abstract class Page {
	pageId: string;
	pageElem: HTMLDivElement;

	protected constructor(pageId: string) {
		this.pageId = pageId;
		this.pageElem = document.getElementById(this.pageId) as HTMLDivElement;
		this.pageElem.Page = this;
	}

	public OnOpen() {}
}
