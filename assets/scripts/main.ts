import "./pageCamera.js";
import "./pageChat.js";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThreshold: number = 0.9;

// eventually move this into its own page script
let pageFeed: HTMLDivElement;

enum AllPages {
	PageFeed = "pageFeed",
	PageCamera = "pageCamera",
	PageChat = "pageChat",

	PageChatOpen = "pageChatOpen",
}
window["AllPages"] = AllPages;
function isPageAnOverlay(pageId: string) {
	return !(pageId == AllPages.PageFeed || pageId == AllPages.PageCamera || pageId == AllPages.PageChat);
}

window.addEventListener("load", function() {
	// set up PWA service worker
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register("sw.js")
			.then(reg => console.log('service worker registered:', reg))
			.catch(err => console.log('service worker not registered', err));
	}

	body = document.querySelector("body");

	pageFeed = document.querySelector("#pageFeed");

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

	// (todo: remove)
	let pageChatOpen = document.querySelector("#pageChatOpen");

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

window.addEventListener("resize", function () {
	document.getElementById(currentPageId).scrollIntoView();
});

window.onhashchange = function () {
	if (location.hash == "#" + currentPageId) return;

	let page: HTMLDivElement;
	if (location.hash.length <= 1) {
		page = pageCamera;
		currentPageId = pageCamera.id;
	} else {
		page = document.querySelector(location.hash);
		currentPageId = location.hash.substring(1);
	}

	// hide all page overlays
	for (let i in AllPages) {
		let pageId = AllPages[i];
		if (!isPageAnOverlay(pageId) || pageId == currentPageId) continue;
		document.getElementById(pageId).classList.remove("page-overlay-show");
	}

	if (isPageAnOverlay(page.id)) {
		page.classList.add("page-overlay-show");
	} else {
		page.scrollIntoView({
			behavior: "smooth"
		});
	}
}
