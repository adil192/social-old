
export type Meta = {
	success: boolean;
}

export class Networker {
	static apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api";

	static async postApi(url: string, data: string[][] | Record<string, string|number|boolean> = {}): Promise<[Meta, any]> {
		if (!url.startsWith("http")) {
			if (!url.startsWith("/")) url = "/" + url;
			url = this.apiUrlPrefix + url;
		}

		// convert data values to strings for URLSearchParams
		data = Object.entries(data).map(([key, value]) => [key, value.toString()]);

		let response: Response = await fetch(url, {
			method: "POST",
			body: new URLSearchParams(data),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
		let parsed = await response.json();
		return [ parsed.meta, parsed.response ];
	}
}
