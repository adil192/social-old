import "./pageCamera.js";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThreshold: number = 0.9;

// eventually move these into their own scripts
let pageFeed: HTMLDivElement,
	pageMessages: HTMLDivElement;


window.addEventListener("load", function() {
	// set up PWA service worker
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register("sw.js")
			.then(reg => console.log('service worker registered:', reg))
			.catch(err => console.log('service worker not registered', err));
	}

	body = document.querySelector("body");

	pageFeed = document.querySelector("#pageFeed");
	pageMessages = document.querySelector("#pageMessages");

	observer = new IntersectionObserver(bodyScrolled, {
		root: body,
		rootMargin: '0px',
		threshold: intersectionThreshold
	});
	observer.observe(pageFeed);
	observer.observe(pageCamera);
	observer.observe(pageMessages);
});

let bodyScrolledTimeout = null;
let currentPageId: string = "pageCamera";
let bodyScrolled = (entries: IntersectionObserverEntry[], observer: any) => {
	entries.forEach(entry => {
		if (entry.intersectionRatio < intersectionThreshold) return;

		clearTimeout(bodyScrolledTimeout);
		bodyScrolledTimeout = setTimeout(function () {
			currentPageId = entry.target.id;
			if (currentPageId == pageCamera.id) {
				while (!isOnCameraPage()) {
					// remove previous page from history so the back button stays on camera next time
					history.back();
				}
				location.replace("#" + currentPageId);
			} else {
				if (isOnCameraPage()) {
					location.hash = currentPageId; // add new hash to history
				} else {
					location.replace("#" + currentPageId); // don't add to history, just replace
				}
			}
		}, 100);
	});
};

function isOnCameraPage(): boolean {
	return location.hash.length <= 1 || location.hash == "#" + pageCamera.id;
}

window.onhashchange = function () {
	let page: HTMLDivElement;
	if (location.hash.length <= 1) {
		page = pageCamera;
	} else if (location.hash != "#" + currentPageId) {
		page = document.querySelector(location.hash);
	} else return;
	page.scrollIntoView({
		behavior: "smooth"
	});
}
