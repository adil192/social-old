/// <reference path="./Extensions.ts"/>
import {Catalogue} from "./Catalogue";
import {Page} from "./Page";
import {Session} from "./Session";

import {PageFeed} from "./PageFeed";
import {PageCamera} from "./PageCamera";
import {PageChat} from "./PageChat";
import {PageMessages} from "./PageMessages";
import {PageSearch} from "./PageSearch";
import {PageProfile} from "./PageProfile";

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
	Catalogue.PageMessages = new PageMessages();
	Catalogue.PageSearch = new PageSearch();
	Catalogue.PageProfile = new PageProfile();

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
	startObserver();
});

let bodyScrolledTimeout = null;
let currentPageId: string = "pageCamera";
let openCompleteTimeout: number = null;
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
	if (Catalogue.AllSwipingPages.filter(page => page.pageId == currentPageId).length > 0)
		document.getElementById(currentPageId).scrollIntoView();
});

window.openPage = function (id: string) {
	location.hash = id;
};

window.onhashchange = function () {
	if (location.hash == "#" + currentPageId) return;

	let previousPageId: string = currentPageId;
	let previousPage: HTMLDivElement = document.querySelector("#" + previousPageId);
	if (previousPage == null) {
		previousPage = document.querySelector("#pageOverlay" + previousPageId.substring(4));
	}

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

	clearTimeout(openCompleteTimeout);
	openCompleteTimeout = setTimeout(() => {
		(page.Page as Page).OnOpened();
	}, 1000);

	if (!!previousPage.Page) (page.Page as Page).OnClose();
	if (!!page.Page) (page.Page as Page).OnOpening();

	if (isCurrentAnOverlay) {
		Catalogue.PageChat.pageElem.scrollIntoView({
			behavior: "smooth"
		});
		stopObserver();
	} else {
		startObserver();
	}
}

function startObserver() {
	let allSwipingPages = Catalogue.AllSwipingPages;
	for (let i in allSwipingPages) {
		observer.observe(allSwipingPages[i].pageElem);
	}
}
function stopObserver() {
	let allSwipingPages = Catalogue.AllSwipingPages;
	for (let i in allSwipingPages) {
		observer.unobserve(allSwipingPages[i].pageElem);
	}
}
