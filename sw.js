importScripts(
	"../assets/ext/dexie.3.2.1.js", // https://unpkg.com/dexie/dist/dexie.js
	"./assets/scripts/sw/CustomAPICache.js"
);

// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "SocialMediaDemo-static-cache-" + "22-04-14-1835";
const apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api";

// Dexie (IndexedDB)
let db = new Dexie("APICache");

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		(async () => {
			db.version(1).stores({
				apiCache: `hash, response`
			});

			const cache = await caches.open(staticCacheName);
			// non-essential cache items (don't await)
			cache.addAll([
				'/SocialMediaDemo/assets/images/icons/larr.svg',
				'/SocialMediaDemo/assets/images/icons/uparr.svg',
				'/SocialMediaDemo/assets/images/transparent.webp',
				'/SocialMediaDemo/assets/images/unknown.webp',

				'/favicon.ico',
				'/maskable_icon_x128.png',
				'/maskable_icon_x192.png',
				'/maskable_icon_x512.png',
				'/favicon_maskable.svg',
			]).then();
			// essential cache items
			await cache.addAll([
				'/SocialMediaDemo/',
				'/SocialMediaDemo/index.php',
				'/SocialMediaDemo/login.php',

				'/SocialMediaDemo/manifest.webmanifest',

				'/assets/ext/bootstrap.5.1.3.min.css',
				'/assets/ext/bootstrap.bundle.5.1.3.min.js',
				'/assets/ext/dexie.3.2.1.js',

				'/SocialMediaDemo/assets/css/style.css',

				'/SocialMediaDemo/assets/scripts/sw/CustomAPICache.js',
				'/SocialMediaDemo/assets/scripts/Catalogue',
				'/SocialMediaDemo/assets/scripts/login.js',
				'/SocialMediaDemo/assets/scripts/main.js',
				'/SocialMediaDemo/assets/scripts/Networker',
				'/SocialMediaDemo/assets/scripts/Page',
				'/SocialMediaDemo/assets/scripts/PageCamera',
				'/SocialMediaDemo/assets/scripts/PageChat',
				'/SocialMediaDemo/assets/scripts/PageFeed',
				'/SocialMediaDemo/assets/scripts/PageMessages',
				'/SocialMediaDemo/assets/scripts/PageSearch',
				'/SocialMediaDemo/assets/scripts/Session',
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
	try {
		formData = await request.formData();
	} catch (e) {
		// request.formData() fails in Chrome when using multipart/form-data, just ignore
		console.log("request.formData() failed for url:", url)
	}
	return await digestMessage(JSON.stringify(formData) + "|" + url);
}
