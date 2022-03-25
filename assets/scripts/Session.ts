
class SessionStruct {
	private static readonly cookieName: string = "session=";
	private saveToCookieTimeout: number = null;

	private _isLoggedIn: boolean = false;

	public get isLoggedIn(): boolean { return this._isLoggedIn; }
	public set isLoggedIn(isLoggedIn: boolean) { this._isLoggedIn = isLoggedIn; this.onchange(); }

	public user = {
		get id(): number { return this._id; },
		set id(id: number) { this._id = id; Session.onchange(); },

		get name(): string { return this._name; },
		set name(name: string) { this._name = name; Session.onchange(); },

		get loginToken(): string { return this._loginToken; },
		set loginToken(loginToken: string) { this._loginToken = loginToken; Session.onchange(); },
	}

	private onchange() {
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = setTimeout(() => this.saveToCookie(), 200);
	}

	public restoreFromCookie() {
		let json = null;
		(function() {
			let cookies = decodeURIComponent(document.cookie).split('; ');
			cookies.forEach(val => {
				if (val.indexOf(SessionStruct.cookieName) === 0)
					json = JSON.parse(val.substring(SessionStruct.cookieName.length));
			});
		})();
		if (json == null) return this.saveToCookie();

		this.isLoggedIn = json.isLoggedIn;
		this.user.id = json.userId;
		this.user.name = json.userName;
		this.user.loginToken = json.loginToken;
		
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = null;
	}
	private saveToCookie() {
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = null;

		let json = JSON.stringify({
			isLoggedIn: this.isLoggedIn,
			userId: this.user.id,
			userName: this.user.name,
			loginToken: this.user.loginToken
		});
		document.cookie = SessionStruct.cookieName + json + "; SameSite=Strict; Secure; max-age=31536000";
		if (!!this.user.loginToken)
			document.cookie = "loginToken=" + this.user.loginToken + "; SameSite=Strict; Secure; max-age=31536000";
	}

	public saveNowIfNeeded() {
		if (this.saveToCookieTimeout == null) return;
		this.saveToCookie();
	}

}
export let Session = new SessionStruct();
Session.restoreFromCookie();
