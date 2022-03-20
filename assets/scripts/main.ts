import { Catalogue } from "./Catalogue.js";
import { PageFeed } from "./PageFeed.js";
import { PageCamera } from "./PageCamera.js";
import { PageChat} from "./PageChat.js";
import { PageChatOpen } from "./PageChatOpen.js";
import { Page } from "./Page.js";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThreshold: number = 0.9;

function isPageAnOverlay(pageId: string) {
	let allOverlayPages = Catalogue.AllOverlayPages;
	for (let i in allOverlayPages) {
		let overlayPage: Page = allOverlayPages[i];
		if (pageId == overlayPage.pageId) return true;
	}
	return false;
}

window.addEventListener("load", function() {
	// set up PWA service worker
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register("sw.js")
			.then(reg => console.log('service worker registered:', reg))
			.catch(err => console.log('service worker not registered', err));
	}

	body = document.querySelector("body");

	Catalogue.PageFeed = new PageFeed();
	Catalogue.PageCamera = new PageCamera();
	Catalogue.PageChat = new PageChat();
	Catalogue.PageChatOpen = new PageChatOpen(); // todo: create PageChatOpen class

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
	observer.observe(Catalogue.PageFeed.pageElem);
	observer.observe(Catalogue.PageCamera.pageElem);
	observer.observe(Catalogue.PageChat.pageElem);
});

let bodyScrolledTimeout = null;
let currentPageId: string = "pageCamera";
let bodyScrolled = (entries: IntersectionObserverEntry[], observer: any) => {
	entries.forEach(entry => {
		if (entry.intersectionRatio < intersectionThreshold) {
			if (entry.target.id == Catalogue.PageCamera.pageId) {
				Catalogue.PageCamera.isCameraPaused = true;
			}
			return;
		}

		clearTimeout(bodyScrolledTimeout);
		bodyScrolledTimeout = setTimeout(function () {
			currentPageId = entry.target.id;
			if (currentPageId == Catalogue.PageCamera.pageId) {
				location.replace("#" + currentPageId);
				Catalogue.PageCamera.isCameraPaused = false;
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
	return location.hash.length <= 1 || location.hash == "#" + Catalogue.PageCamera.pageId;
}

window.addEventListener("resize", function () {
	document.getElementById(currentPageId).scrollIntoView();
});

window.onhashchange = function () {
	if (location.hash == "#" + currentPageId) return;

	let page: HTMLDivElement;
	if (location.hash.length <= 1) {
		page = Catalogue.PageCamera.pageElem;
		currentPageId = Catalogue.PageCamera.pageId;
	} else {
		page = document.querySelector(location.hash);
		currentPageId = location.hash.substring(1);
	}

	// hide all other page overlays
	for (let i in Catalogue.AllOverlayPages) {
		let overlayPage: Page = Catalogue.AllOverlayPages[i];
		if (overlayPage.pageId == currentPageId) continue;
		overlayPage.pageElem.classList.remove("page-overlay-show");
	}

	if (isPageAnOverlay(page.id)) {
		page.classList.add("page-overlay-show");
	} else {
		page.scrollIntoView({
			behavior: "smooth"
		});
	}
}
