///<reference path="../../node_modules/jose/dist/types/index.d.ts" />
import * as jose from '../../node_modules/jose/dist/browser/index.js';

export class Session {
	public static isReady: boolean = false;
	public static isLoggedIn: boolean = false;
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

		let publicKey: jose.KeyLike = null;
		const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey);

		for (let i in payload) {
			Session[i] = payload[i];
		}
	} finally {
		Session.isReady = true;
	}
}
getSessionCookie();
