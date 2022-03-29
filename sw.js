importScripts(
	"https://unpkg.com/dexie@3.2.1/dist/dexie.js", // https://unpkg.com/dexie/dist/dexie.js
	"./assets/scripts/sw/CustomAPICache.js"
);

// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "SocialMediaDemo-static-cache-" + "22-03-29-0942";
const apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api";

// Dexie (IndexedDB)
let db = new Dexie("APICache");

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		(async () => {
			db.version(1).stores({
				apiCache: `hash, response`
			});

			// non-essential cache items (don't await)
			caches.open(staticCacheName).then(cache => {
				cache.addAll([
					'/SocialMediaDemo/assets/images/transparent.webp',
					'/SocialMediaDemo/assets/images/icons/larr.svg',
					'/SocialMediaDemo/assets/images/icons/uparr.svg',
				]);
			})

			// essential cache items
			const cache = await caches.open(staticCacheName);
			await cache.addAll([
				'/favicon.ico',
				'/SocialMediaDemo/',
				'/SocialMediaDemo/index.php',
				'/SocialMediaDemo/login.php',

				'/SocialMediaDemo/manifest.webmanifest',

				'https://unpkg.com/dexie@3.2.1/dist/dexie.js',
				'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',

				'/SocialMediaDemo/assets/css/style.css',

				'/SocialMediaDemo/assets/scripts/sw/CustomAPICache.js',
				'/SocialMediaDemo/assets/scripts/Catalogue',
				'/SocialMediaDemo/assets/scripts/main.js',
				'/SocialMediaDemo/assets/scripts/Page',
				'/SocialMediaDemo/assets/scripts/PageCamera',
				'/SocialMediaDemo/assets/scripts/PageChat',
				'/SocialMediaDemo/assets/scripts/PageChatOpen',
				'/SocialMediaDemo/assets/scripts/PageFeed',

				'/SocialMediaDemo/assets/scripts/login.js',
			]);
		})()
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		(async () => {
			let cacheNames = await caches.keys();
			await Promise.all(cacheNames
				.filter((cacheName) => {
					return staticCacheName.indexOf(cacheName) === -1;
				})
				.map((cacheName) => {
					return caches.delete(cacheName);
				})
			);
		})()
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		(async () => {
			if (event.request.method === "POST" || event.request.url.startsWith(apiUrlPrefix)) {
				return await fetchApi(event);
			} else {
				return await fetchStatic(event);
			}
		})()
	);
});

async function fetchApi(event) {
	let url = event.request.url;
	let hash = await hashRequest(url, event.request.clone()); // hash post data for caching purposes
	console.log("fetchApi:", url, "hash:", hash)

	// try internet first
	let response = null;
	try {
		response = await fetch(event.request.clone());
	} catch (e) {
		// if offline, try to find a cached response
		return await CustomAPICache.Load(db.apiCache, event.request.clone(), hash);
	}

	// if internet fetch worked, cache the new response for later (don't await)
	CustomAPICache.Save(db.apiCache, event.request.clone(), hash, response).then();

	return response;
}

async function fetchStatic(event) {
	console.log("fetchStatic:", event.request.url)

	// first try static cache
	let response = await caches.match(event.request.url, {
		cacheName: staticCacheName,
		ignoreSearch: true // ignore the "?lastUpdated=..." part
	});
	if (!!response) return response;

	// otherwise, try internet
	return await fetch(event.request);
}

// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
async function digestMessage(message) {
	const encoded = new TextEncoder().encode(message);
	const buffer = await crypto.subtle.digest('SHA-256', encoded);
	const byteArray = Array.from(new Uint8Array(buffer));
	return byteArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
async function hashRequest(url, request) {
	let formData = {};
	for (let pair of (await request.formData()).entries()) {
		formData[pair[0]] = pair[1];
	}
	return await digestMessage(JSON.stringify(formData) + "|" + url);
}
