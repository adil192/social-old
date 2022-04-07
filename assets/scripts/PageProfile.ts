import {Page} from "./Page";
import {Session} from "./Session";
import {Networker} from "./Networker";

export class PageProfile extends Page {
	nameElem: HTMLSpanElement;
	pronounsElem: HTMLSpanElement;
	bioElem: HTMLParagraphElement;

	previousProfileId: number = null;

	constructor() {
		super("pageProfile", "pageOverlayProfile");

		this.nameElem = document.querySelector(".pageProfile-name");
		this.pronounsElem = document.querySelector(".pageProfile-pronouns");
		this.bioElem = document.querySelector(".pageProfile-bio");

		this.nameElem.innerText = "";
		this.pronounsElem.innerText = "";
		this.bioElem.innerText = "";
	}

	async OnOpening() {
		await super.OnOpening();

		// default to logged-in user (i.e. when opened from the camera page)
		if (window.currentProfileId == null || window.currentProfileId == Session.user.id) {
			window.currentProfileId = Session.user.id;
			this.nameElem.innerText = Session.user.name;
			this.pageElem.classList.add("pageProfile-own");
		} else {
			this.pageElem.classList.remove("pageProfile-own");
		}

		// if the user hasn't changed, we don't need to change anything
		if (window.currentProfileId == this.previousProfileId) return;

		let [ meta, response ] = await Networker.postApi("Users.GetProfile", {
			UserId: window.currentProfileId
		});
		if (!meta.success) return;
		this.previousProfileId = window.currentProfileId;
		this.nameElem.innerText = response.Username;
		this.pronounsElem.innerText = response.Pronouns;
		this.bioElem.innerText = response.Bio;
	}

	async OnClose() {
		await super.OnClose();

		window.currentProfileId = null;
	}
}
