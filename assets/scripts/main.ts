import "./pageCamera.js";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThreshold: number = 0.9;

// eventually move these into their own scripts
let pageFeed: HTMLDivElement,
	pageChat: HTMLDivElement;


window.addEventListener("load", function() {
	// set up PWA service worker
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register("sw.js")
			.then(reg => console.log('service worker registered:', reg))
			.catch(err => console.log('service worker not registered', err));
	}

	body = document.querySelector("body");

	pageFeed = document.querySelector("#pageFeed");
	pageChat = document.querySelector("#pageChat");

	document.querySelectorAll(".page-header-backBtn").forEach(backBtn => {
		backBtn.addEventListener("click", function () {
			history.back();
		});
	});

	observer = new IntersectionObserver(bodyScrolled, {
		root: body,
		rootMargin: '0px',
		threshold: intersectionThreshold
	});
	observer.observe(pageFeed);
	observer.observe(pageCamera);
	observer.observe(pageChat);
});

let bodyScrolledTimeout = null;
let currentPageId: string = "pageCamera";
let bodyScrolled = (entries: IntersectionObserverEntry[], observer: any) => {
	entries.forEach(entry => {
		if (entry.intersectionRatio < intersectionThreshold) {
			if (entry.target.id == pageCamera.id) {
				setCameraPaused(true);
			}
			return;
		}

		clearTimeout(bodyScrolledTimeout);
		bodyScrolledTimeout = setTimeout(function () {
			currentPageId = entry.target.id;
			if (currentPageId == pageCamera.id) {
				location.replace("#" + currentPageId);
				setCameraPaused(false);
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
