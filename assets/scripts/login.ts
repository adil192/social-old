import { Page } from "./Page";
import { Session } from "./Session";
import { Networker } from "./Networker";

class PageLogin extends Page {

	loginForm: HTMLFormElement;
	loginEmailInput: HTMLInputElement;
	loginPasswordInput: HTMLInputElement;

	signupForm: HTMLFormElement;
	signupEmailInput: HTMLInputElement;
	signupPasswordInput: HTMLInputElement;
	signupPasswordInput2: HTMLInputElement;

	constructor() {
		super("pageLogin");

		if (Session.isLoggedIn) {
			PageLogin.goToIndex();
			return;
		}

		this.loginForm = document.querySelector("#loginForm");
		this.loginEmailInput = document.querySelector("#loginEmailInput");
		this.loginPasswordInput = document.querySelector("#loginPasswordInput");

		this.signupForm = document.querySelector("#signupForm");
		this.signupEmailInput = document.querySelector("#signupEmailInput");
		this.signupPasswordInput = document.querySelector("#signupPasswordInput");
		this.signupPasswordInput2 = document.querySelector("#signupPasswordInput2");

		this.signupPasswordInput.onchange = () => this.doSignupPasswordsMatch();
		this.signupPasswordInput2.onchange = () => this.doSignupPasswordsMatch();
		this.signupPasswordInput2.onkeyup = () => this.doSignupPasswordsMatch();

		this.loginForm.onsubmit = (e) => {
			e.preventDefault();
			this.submitForm(this.loginForm);
		}
		this.signupForm.onsubmit = (e) => {
			e.preventDefault();
			this.submitForm(this.signupForm);
		}
	}

	doSignupPasswordsMatch() {
		if (this.signupPasswordInput.value == this.signupPasswordInput2.value)
			this.signupPasswordInput2.setCustomValidity('');
		else
			this.signupPasswordInput2.setCustomValidity('Passwords do not match.');

		this.signupPasswordInput2.reportValidity();
	}

	async submitForm(form: HTMLFormElement) {
		let errorElem: HTMLParagraphElement = form.querySelector(".form-error");
		errorElem.innerText = "";

		let apiUrl = form == this.loginForm ? "Auth.Login" : "Auth.SignUp";
		let [ success, response ] = await Networker.postApi(apiUrl, this.getFormData(form));

		if (success) {
			Session.isLoggedIn = true;
			Session.user.id = response.UserId;
			Session.user.name = response.Username;
			Session.user.loginToken = response.LoginToken;
			PageLogin.goToIndex();
		} else {
			errorElem.innerText = response;
		}
	}
	getFormData(form: HTMLFormElement): Record<string, string> {
		if (form == this.loginForm) return {
			email: this.loginEmailInput.value,
			password: this.loginPasswordInput.value,
		};
		else return {
			email: this.signupEmailInput.value,
			password: this.signupPasswordInput.value,
			password2: this.signupPasswordInput2.value,
		}
	}

	private static goToIndex() {
		Session.saveNowIfNeeded();
		location.href = "./";
	}
}

let pageLogin: PageLogin;
window.addEventListener("load", function() {
	// set up PWA service worker
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register("sw.js")
			.then(reg => console.log('service worker registered:', reg))
			.catch(err => console.log('service worker not registered', err));
	}

	pageLogin = new PageLogin();
});
