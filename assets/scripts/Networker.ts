
export class Networker {
	static apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api";

	static async postApi(url: string, data: Record<string, string> = {}): Promise<[boolean, any]> {
		if (!url.startsWith("http")) {
			if (!url.startsWith("/")) url = "/" + url;
			url = this.apiUrlPrefix + url;
		}

		let response: Response = await fetch(url, {
			method: "POST",
			body: new URLSearchParams(data),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
		let parsed = await response.json();
		return [ parsed.meta.success, parsed.response ];
	}
}
