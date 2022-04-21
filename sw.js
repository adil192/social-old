importScripts(
	"/assets/ext/dexie.3.2.1.js", // https://unpkg.com/dexie/dist/dexie.js
	"/assets/scripts/sw/CustomAPICache.js"
);

// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "SocialMediaDemo-static-cache-" + "22-04-21-1612";
const userMediaCacheName = "SocialMediaDemo-user-media-cache";

const localUrlPrefix = "https://social.adil.hanney.org";
const apiUrlPrefix = localUrlPrefix + "/api";
const userMediaUrlPrefix = localUrlPrefix + "/assets/images/user-media";

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
				'/assets/images/icons/larr.svg',
				'/assets/images/icons/uparr.svg',
				'/assets/images/transparent.webp',
				'/assets/images/unknown.webp',

				'/favicon.ico',
				'/maskable_icon_x128.png',
				'/maskable_icon_x192.png',
				'/maskable_icon_x512.png',
				'/favicon_maskable.svg',
			]).then();
			// essential cache items
			await cache.addAll([
				'/',
				'/index.php',
				'/login.php',

				'/manifest.webmanifest',

				'/assets/ext/bootstrap.5.1.3.min.css',
				'/assets/ext/bootstrap.bundle.5.1.3.min.js',
				'/assets/ext/dexie.3.2.1.js',

				'/assets/css/style.css',

				'/assets/scripts/sw/CustomAPICache.js',
				'/assets/scripts/Catalogue',
				'/assets/scripts/login.js',
				'/assets/scripts/main.js',
				'/assets/scripts/Networker',
				'/assets/scripts/Page',
				'/assets/scripts/PageCamera',
				'/assets/scripts/PageChat',
				'/assets/scripts/PageFeed',
				'/assets/scripts/PageMessages',
				'/assets/scripts/PageSearch',
				'/assets/scripts/Session',
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
					return cacheName !== staticCacheName && cacheName !== userMediaCacheName;
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
			} else if (event.request.url.startsWith(userMediaUrlPrefix)) {
				return await fetchUserMedia(event);
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

	// special handling for Auth requests
	if (getFilename(url).startsWith("Auth.")) {
		await db.apiCache.clear();
		return await fetch(event.request.clone());
	}

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

async function fetchUserMedia(event) {
	console.log("fetchUserMedia:", event.request.url)

	// first try user-media cache
	let cache = await caches.open(userMediaCacheName);
	let response = await cache.match(event.request.url);
	if (!!response) return response;

	// next try internet
	response = await fetch(event.request.clone()); // will throw exception if fails

	// if internet fetch worked, save to cache (don't await)
	cache.put(event.request.url, response.clone()).then();

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
	// get FormData if it exists
	let formData = {};
	let isFormDataBlank = true;
	try {
		formData = await request.formData();
		isFormDataBlank = [...formData.entries()].length === 0;
	} catch (e) {
		// request.formData() fails in Chrome when using multipart/form-data, just ignore
		console.log("request.formData() failed for url:", url)
	}

	// shorten url if it starts with localUrlPrefix
	let i = url.indexOf(localUrlPrefix);
	if (i === 0) {
		url = url.substring(localUrlPrefix.length);
	}

	if (isFormDataBlank) return url;
	else return url + "|" + await digestMessage(JSON.stringify(formData));
}

function getFilename(url) {
	return url.split("/").pop();
}
