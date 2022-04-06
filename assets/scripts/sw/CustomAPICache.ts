/*
 * Used by the service worker to cache API calls in a different way to just saving a response for each request.
 * E.g. for a search function, the api cache would quickly become way too large, so instead of saving each response,
 * we save the users of each response, and
 */

import {Dexie} from "../../ext/dexie/src/public";

interface CustomAPICacheHandler {
	Save(apiCache: Dexie.Table, request: Request, request_hash: string, response: Response): Promise<void>;
	Load(apiCache: Dexie.Table, request: Request, request_hash: string): Promise<any>;
}

type SerializedResponse = {
	headers: Record<string, string>,
	status: number,
	statusText: string,
	body: string
};

let CustomAPICache: CustomAPICacheHandler = (function () {
	// https://a.kabachnik.info/offline-post-requests-via-service-worker-and-indexeddb.html
	async function serializeResponse(response: Response) {
		let serialized: SerializedResponse = {
			headers: {},
			status: response.status,
			statusText: response.statusText,
			body: undefined
		};
		response.headers.forEach(function (value: string, key: string) {
			serialized.headers[key] = value;
		});
		serialized.body = await response.clone().text();
		return serialized;
	}
	// https://a.kabachnik.info/offline-post-requests-via-service-worker-and-indexeddb.html
	function deserializeResponse(data: SerializedResponse) {
		return new Response(data.body, data);
	}

	function getFileName(request: Request) {
		return request.url.split("/").pop();
	}


	let handlers: Record<string, CustomAPICacheHandler> = {
		"Chat.GetMessages": {
			async Save(apiCache: Dexie.Table, request: Request, _: string, response: Response) {
				let formData = await request.clone().formData();
				let chatId: number = parseInt(<string>formData.get("chatId"));
				let lastMessageId: number = parseInt(<string>formData.get("lastMessageId") ?? "0");
				let hash = request.url + "#" + chatId;

				let cacheCollection = await apiCache.where("hash").equals(hash);
				if (lastMessageId == 0 || !(await cacheCollection.count())) {
					let serialized = await serializeResponse(response.clone());
					apiCache.put({
						hash: hash,
						response: serialized
					});
				} else {
					let cachedResponse: SerializedResponse = (await cacheCollection.toArray())[0].response;
					let cachedMessages: any[][] = JSON.parse(cachedResponse.body).response;

					let newResponse: SerializedResponse = await serializeResponse(response.clone());
					let { meta: newMeta, response: newMessages } = JSON.parse(newResponse.body);

					newResponse.body = JSON.stringify({
						meta: newMeta,
						response: cachedMessages.concat(newMessages)
					});
					apiCache.put({
						hash: hash,
						response: newResponse
					});
				}
			},
			async Load(apiCache: Dexie.Table, request: Request, request_hash: string): Promise<any> {
				let formData = await request.clone().formData();
				let chatId: number = parseInt(<string>formData.get("chatId"));
				let lastMessageId: number = parseInt(<string>formData.get("lastMessageId") ?? "0");
				let hash = request.url + "#" + chatId;

				let cacheItems = await apiCache.where("hash").equals(hash).toArray();
				if (!cacheItems.length) return null;

				let cachedResponse: SerializedResponse = cacheItems[0].response;
				let { meta: cachedMeta, response: cachedMessages } = JSON.parse(cachedResponse.body);

				cachedResponse.body = JSON.stringify({
					meta: cachedMeta,
					response: cachedMessages.filter((row) => row[0] > lastMessageId)
				});

				return deserializeResponse(cachedResponse);
			}
		},
		"default": {
			async Save(apiCache: Dexie.Table, request: Request, request_hash: string, response: Response) {
				// (don't cache Auth.*.php apis as they contain plain-text passwords)
				if (getFileName(request).startsWith("Auth.")) return;

				let serialized = await serializeResponse(response.clone());
				await apiCache.put({
					hash: request_hash,
					response: serialized,
				});
			},
			async Load(apiCache: Dexie.Table, request: Request, request_hash: string): Promise<any> {
				let cacheCollection = apiCache.where("hash").equals(request_hash);
				let cacheItems = await cacheCollection.toArray();
				if (cacheItems.length) return deserializeResponse(cacheItems[0].response);
				else return null;
			}
		}
	};

	return {
		async Save(apiCache: Dexie.Table, request: Request, request_hash: string, response: Response) {
			for (const url in handlers) {
				if (getFileName(request) !== url) continue;

				return await handlers[url].Save(apiCache, request, request_hash, response.clone());
			}
			return await handlers["default"].Save(apiCache, request, request_hash, response.clone());

		},
		async Load(apiCache: Dexie.Table, request: Request, request_hash: string): Promise<any> {
			for (const url in handlers) {
				if (getFileName(request) !== url) continue;

				return await handlers[url].Load(apiCache, request, request_hash);
			}
			return await handlers["default"].Load(apiCache, request, request_hash);
		}
	}
})();

alert("You should remove the `export {}` line from the generated js file. Also remove this alert.");
