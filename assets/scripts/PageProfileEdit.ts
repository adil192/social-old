import {Page} from "./Page";

export class PageProfileEdit extends Page {

	form: HTMLFormElement;

	formName: HTMLInputElement;
	formBio: HTMLTextAreaElement;
	formPronouns: RadioNodeList;
	formPronounsOther: HTMLInputElement;

	constructor() {
		super("pageProfileEdit", "pageOverlayProfileEdit");

		this.form = document.querySelector("#pageProfileEdit-form");
		this.formName = this.form.querySelector("#pageProfileEdit-name-input");
		this.formBio = this.form.querySelector("#pageProfileEdit-bio-input");
		this.formPronouns = this.form["pronouns"];
		this.formPronounsOther = this.form.querySelector("#pageProfileEdit-pronouns-other-input");

	}

	static populateFields(profile) {
		let page = <PageProfileEdit>PageProfileEdit.Instance;

		page.formName.value = profile.Username;
		page.formBio.value = profile.Bio;

		if (!!profile.Pronouns) {
			page.formPronouns.value = profile.Pronouns;
			if (page.formPronouns.value != profile.Pronouns) {
				page.formPronouns.value = "other";
				page.formPronounsOther.value = profile.Pronouns;
			}
		}
	}
}
