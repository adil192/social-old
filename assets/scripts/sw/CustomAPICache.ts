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
		"Users.Search": {
			async Save(apiCache: Dexie.Table, request: Request, request_hash: string, response: Response) {
				// todo
			},
			async Load(apiCache: Dexie.Table, request: Request, request_hash: string): Promise<any> {
				// todo
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
				let cacheCollection = await apiCache.where("hash").equals(request_hash);
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

				return await handlers[url].Save(apiCache, request, request_hash, response);
			}
			return await handlers["default"].Save(apiCache, request, request_hash, response);

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
