
export type Meta = {
	success: boolean;
}

export class Networker {
	static apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api";

	static async postApi(url: string, data: Record<string, string | Blob> = {}): Promise<[Meta, any]> {
		if (!url.startsWith("http")) {
			if (!url.startsWith("/")) url = "/" + url;
			url = this.apiUrlPrefix + url;
		}

		const formData = new FormData();
		for (let [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}

		let response: Response = await fetch(url, {
			method: "POST",
			body: formData
		});
		let parsed = await response.json();
		return [ parsed.meta, parsed.response ];
	}
}
