
export class Session {
	private static _isReady: boolean = false;
	private static _isLoggedIn: boolean = false;

	public static get isReady(): boolean { return this._isReady; }
	public static set isReady(isReady: boolean) { this._isReady = isReady; this.onchange(); }

	public static get isLoggedIn(): boolean { return this._isLoggedIn; }
	public static set isLoggedIn(isLoggedIn: boolean) { this._isLoggedIn = isLoggedIn; }

	private static onchange() {
		// todo
	}

}

async function getSessionCookie() {
	try {
		let jwt: string = null;
		(function() {
			let name = "socialMediaDemoJwt=";
			let cookies = decodeURIComponent(document.cookie).split('; ');
			cookies.forEach(val => {
				if (val.indexOf(name) === 0) jwt = val.substring(name.length);
			});
		})();

		if (jwt == null) return;

		/*let publicKey: jose.KeyLike = null;
		const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey);

		for (let i in payload) {
			Session[i] = payload[i];
		}*/
	} finally {
		Session.isReady = true;
	}
}
getSessionCookie();
