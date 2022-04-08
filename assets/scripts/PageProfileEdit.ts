import {Page} from "./Page";
import {Networker} from "./Networker";
import {Session} from "./Session";

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

		this.form.onsubmit = async (e) => {
			e.preventDefault();
			await this.OnSubmit();
		};
	}

	private async OnSubmit() {
		let pronouns = this.formPronouns.value;
		if (pronouns == "other") pronouns = this.formPronounsOther.value;

		let [ meta, response ] = await Networker.postApi("Users.UpdateProfile", {
			UserId: Session.user.id,
			Username: this.formName.value,
			Bio: this.formBio.value,
			Pronouns: pronouns
		});
		if (meta.success) {
			Session.user.name = this.formName.value ?? Session.user.name;
			window.currentProfileChanged = true;
		}
		history.back();
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
