import {Page} from "./Page";
import {Session} from "./Session";
import {Networker} from "./Networker";
import {PageProfileEdit} from "./PageProfileEdit";

export class PageProfile extends Page {
	headerElem: HTMLHeadingElement;
	nameElem: HTMLSpanElement;
	pronounsElem: HTMLSpanElement;
	bioElem: HTMLParagraphElement;
	logoutBtn: HTMLButtonElement;

	previousProfileId: number = null;

	constructor() {
		super("Profile", true);

		this.headerElem = document.querySelector(".pageProfile-header");
		this.nameElem = document.querySelector(".pageProfile-name");
		this.pronounsElem = document.querySelector(".pageProfile-pronouns");
		this.bioElem = document.querySelector(".pageProfile-bio");
		this.logoutBtn = document.querySelector(".pageProfile-logoutBtn");

		this.nameElem.innerText = "";
		this.pronounsElem.innerText = "";
		this.bioElem.innerText = "";

		this.logoutBtn.addEventListener("click", async () => {
			await this.Logout();
		});
	}

	async OnOpening() {
		await super.OnOpening();

		// default to logged-in user (i.e. when opened from the camera page)
		if (window.currentProfileId == null || window.currentProfileId == Session.user.id) {
			window.currentProfileId = Session.user.id;
			this.nameElem.innerText = Session.user.name;
			
			this.pageElem.classList.add("pageProfile-own");
			this.headerElem.innerText = "My profile";
		} else {
			this.pageElem.classList.remove("pageProfile-own");
			this.headerElem.innerText = "";
		}

		// if the user hasn't changed, we don't need to change anything
		if (window.currentProfileId == this.previousProfileId && !window.currentProfileChanged) return;
		window.currentProfileChanged = false;

		let [ meta, response ] = await Networker.postApi("Users.GetProfile", {
			UserId: window.currentProfileId + ""
		});
		if (!meta.success) return;
		this.previousProfileId = window.currentProfileId;
		this.headerElem.innerText = response.Username;
		this.nameElem.innerText = response.Username;
		this.pronounsElem.innerText = response.Pronouns;
		this.bioElem.innerText = response.Bio;

		// save to window so we can populate the edit page
		if (window.currentProfileId == Session.user.id) {
			PageProfileEdit.populateFields(response);
		}
	}

	async OnClose() {
		await super.OnClose();

		window.currentProfileId = null;
	}

	async Logout() {
		let [ meta, response ] = await Networker.postApi("Auth.Logout", {
			UserId: Session.user.id + ""
		});
		if (!meta.success) return;

		Session.user.id = null;
		Session.user.name = null;
		Session.user.loginToken = null;
		Session.isLoggedIn = false;
		Session.saveNowIfNeeded();

		location.href = "login.php";
	}
}
