/// <reference path="./Extensions.ts"/>
import { Catalogue } from "./Catalogue";
import { Page } from "./Page";
import { Session } from "./Session";

import { PageFeed } from "./PageFeed";
import { PageCamera } from "./PageCamera";
import { PageChat} from "./PageChat";
import { PageChatOpen } from "./PageChatOpen";
import { PageSearch } from "./PageSearch";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThreshold: number = 0.9;


window.addEventListener("load", function() {
	// set up PWA service worker
	if('serviceWorker' in navigator){
		navigator.serviceWorker.register("sw.js")
			.then(reg => console.log('service worker registered:', reg))
			.catch(err => console.log('service worker not registered', err));
	}

	if (!Session.isLoggedIn) {
		location.href = "login.php";
		return;
	}

	body = document.querySelector("body");

	Catalogue.PageFeed = new PageFeed();
	Catalogue.PageCamera = new PageCamera();
	Catalogue.PageChat = new PageChat();
	Catalogue.PageChatOpen = new PageChatOpen();
	Catalogue.PageSearch = new PageSearch();

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

window.openPage = function (id: string) {
	location.hash = id;
};

window.onhashchange = function () {
	if (location.hash == "#" + currentPageId) return;

	let page: HTMLDivElement;
	currentPageId = location.hash.substring(1);
	let currentPageElemId = currentPageId;
	if (location.hash.length <= 1) {
		page = Catalogue.PageCamera.pageElem;
		currentPageId = Catalogue.PageCamera.pageId;
		currentPageElemId = currentPageId;
	} else {
		page = document.querySelector(location.hash);
		if (page == null) {
			currentPageElemId = "pageOverlay" + location.hash.substring(5);
			page = document.querySelector("#" + currentPageElemId);
		}
	}

	// hide all other page overlays
	let isCurrentAnOverlay = false;
	let overlayPages = Catalogue.AllOverlayPages;
	for (let i in overlayPages) {
		let overlayPage: Page = overlayPages[i];
		if (overlayPage.pageId == currentPageId) {
			isCurrentAnOverlay = true;
		} else {
			overlayPage.pageElem.classList.remove("page-overlay-show");
		}
	}

	if (isCurrentAnOverlay) {
		page.classList.add("page-overlay-show");
	} else {
		page.scrollIntoView({
			behavior: "smooth"
		});
	}

	if (!!page.Page) (page.Page as Page).OnOpen();
}
