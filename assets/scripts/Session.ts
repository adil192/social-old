
class SessionStruct {
	private static readonly cookieName: string = "session=";
	private saveToCookieTimeout: number = null;

	private _isLoggedIn: boolean = false;

	public get isLoggedIn(): boolean { return this._isLoggedIn; }
	public set isLoggedIn(isLoggedIn: boolean) { this._isLoggedIn = isLoggedIn; this.onchange(); }

	public constructor() {
		this.restoreFromCookie();
	}

	private onchange() {
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = setTimeout(() => this.saveToCookie(), 200);
	}

	private restoreFromCookie() {
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
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = null;
	}
	private saveToCookie() {
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = null;

		let json = JSON.stringify({
			isLoggedIn: this.isLoggedIn
		});
		document.cookie = SessionStruct.cookieName + json + "; SameSite=Strict; Secure; max-age=31536000";
	}

	public saveNowIfNeeded() {
		if (this.saveToCookieTimeout == null) return;
		this.saveToCookie();
	}

}
export let Session = new SessionStruct();
