// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "SocialMediaDemo-static-cache-" + "22-03-24-1546";
const apiCacheName = "SocialMediaDemo-api-cache";
const apiUrlPrefix = "https://adil.hanney.org/SocialMediaDemo/api"

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		(async () => {
			// non-essential cache items
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

				'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',

				'/SocialMediaDemo/assets/css/style.css',

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
					return staticCacheName.indexOf(cacheName) === -1 && apiCacheName.indexOf(cacheName) === -1;
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
			if (event.request.url.startsWith(apiUrlPrefix)) {
				return await fetchApi(event);
			} else {
				return await fetchStatic(event);
			}
		})()
	);
});

async function fetchApi(event) {
	console.log("fetchApi:", event.request.url)

	// first try internet
	let response = null;
	try {
		response = await fetch(event.request);
	} catch (e) {
		// if offline, used cached response
		return await caches.match(event.request.url, {
			cacheName: apiCacheName
		});
	}

	// if internet fetch worked, cache the new response for later
	// (don't cache Auth.*.php api requests as they contain plain-text passwords)
	if (!event.request.url.startsWith(apiUrlPrefix + "/Auth."))
		caches.open(apiCacheName).then(cache => {
			cache.put(event.request, response.clone());
		});

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
