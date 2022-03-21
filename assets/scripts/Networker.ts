
export class Networker {
	static apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api";

	static async postApi(url: string): Promise<any> {
		if (!url.startsWith("http")) {
			if (!url.startsWith("/")) url = "/" + url;
			url = this.apiUrlPrefix + url;
		}

		return (await fetch(url)).json();
	}
}
