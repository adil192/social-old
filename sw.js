// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "SocialMediaDemo-cache-" + "22-03-18-2149";
const assets = [
	'/favicon.ico',
	'/SocialMediaDemo/',
	'/SocialMediaDemo/index.php',
	'/SocialMediaDemo/manifest.webmanifest',
	'/SocialMediaDemo/assets/css/style.css',
	'/SocialMediaDemo/assets/scripts/main.js',
	'/SocialMediaDemo/assets/scripts/pageCamera.js',
	'/SocialMediaDemo/assets/images/transparent.webp',
	'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
];

self.addEventListener('install', (evt) => {
	evt.waitUntil(
		(async () => {
			const cache = await caches.open(staticCacheName);
			await cache.addAll(assets);
		})()
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		(async () => {
			let cacheNames = await caches.keys();
			await Promise.all(cacheNames.map((cacheName) => {
				if (staticCacheName.indexOf(cacheName) === -1) return caches.delete(cacheName);
			}));
		})()
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		(async () => {
			// try cache
			let response = await caches.match(event.request.url, {
				cacheName: staticCacheName,
				ignoreSearch: false
			});
			if (!!response) return response;

			console.log(event.request.url, "not in cache");

			// next try internet
			try {
				response = await fetch(event.request);
			} catch (e) {
				// if there's no internet, we'll try ignoring the query string
				return await caches.match(event.request.url, {
					cacheName: staticCacheName,
					ignoreSearch: true
				});
			}

			// add new file to cache (asynchronously)
			if (!!response) {
				caches.open(staticCacheName).then((cache) => cache.put(event.request, response));
			}

			return response;
		})()
	);
});
