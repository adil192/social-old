/// <reference path="./Extensions.ts"/>

export abstract class Page {
	pageId: string;
	pageElem: HTMLDivElement;

	protected constructor(pageId: string, elemId: string = null) {
		this.pageId = pageId;
		this.pageElem = document.getElementById(elemId ?? pageId) as HTMLDivElement;
		this.pageElem.Page = this;
	}

	public OnOpen() {}
	public OnClose() {}
}
