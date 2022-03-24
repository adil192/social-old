
class SessionStruct {
	private static readonly cookieName: string = "session=";

	private _isReady: boolean = false;
	private _isLoggedIn: boolean = false;

	public get isReady(): boolean { return this._isReady; }
	public set isReady(isReady: boolean) { this._isReady = isReady; this.onchange(); }

	public get isLoggedIn(): boolean { return this._isLoggedIn; }
	public set isLoggedIn(isLoggedIn: boolean) { this._isLoggedIn = isLoggedIn; this.onchange(); }

	public constructor() {
		this.restoreFromCookie();
	}

	saveToCookieTimeout: number = null;
	private onchange() {
		clearTimeout(this.saveToCookieTimeout);
		this.saveToCookieTimeout = setTimeout(() => this.saveToCookie(), 200);
	}

	restoreFromCookie() {
		let json = null;
		(function() {
			let cookies = decodeURIComponent(document.cookie).split('; ');
			cookies.forEach(val => {
				if (val.indexOf(SessionStruct.cookieName) === 0) json = val.substring(SessionStruct.cookieName.length);
			});
		})();
		if (json == null) return;

		this.isReady = json.isReady;
		this.isLoggedIn = json.isLoggedIn;
		clearTimeout(this.saveToCookieTimeout);
	}
	saveToCookie() {
		let json = JSON.stringify({
			isReady: this.isReady,
			isLoggedIn: this.isLoggedIn
		});
		document.cookie = SessionStruct.cookieName + json + "; SameSite=Strict; Secure; max-age=31536000";
	}

}
export let Session = new SessionStruct();
