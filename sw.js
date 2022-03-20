// Cache name has a timestamp because the browser re-caches the assets when the service worker file is modified
const staticCacheName = "SocialMediaDemo-cache-" + "22-03-20-1829";
const assets = [
	'/favicon.ico',
	'/SocialMediaDemo/',
	'/SocialMediaDemo/index.php',
	'/SocialMediaDemo/manifest.webmanifest',

	'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',

	'/SocialMediaDemo/assets/css/style.css',

	'/SocialMediaDemo/assets/scripts/Catalogue.js',
	'/SocialMediaDemo/assets/scripts/main.js',
	'/SocialMediaDemo/assets/scripts/Page.js',
	'/SocialMediaDemo/assets/scripts/PageCamera.js',
	'/SocialMediaDemo/assets/scripts/PageChat.js',
	'/SocialMediaDemo/assets/scripts/PageChatOpen.js',
	'/SocialMediaDemo/assets/scripts/PageFeed.js',

	'/SocialMediaDemo/assets/images/transparent.webp',
	'/SocialMediaDemo/assets/images/icons/larr.svg',
	'/SocialMediaDemo/assets/images/icons/uparr.svg',
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
				ignoreSearch: true // ignore the "?lastUpdated=..." part
			});
			if (!!response) return response;

			// otherwise, try internet
			return await fetch(event.request);
		})()
	);
});
