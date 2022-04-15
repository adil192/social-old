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
import {PageProfileEdit} from "./PageProfileEdit";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThresholdOpening: number = 0.6;
const intersectionThresholdOpened: number = 1;


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
	Catalogue.PageProfileEdit = new PageProfileEdit();

	document.querySelectorAll(".page-header-backBtn").forEach(backBtn => {
		backBtn.addEventListener("click", function () {
			history.back();
		});
	});

	observer = new IntersectionObserver(bodyScrolled, {
		root: body,
		rootMargin: '0px',
		threshold: [intersectionThresholdOpening, intersectionThresholdOpened]
	});
	startObserver();
});

let currentPageId: string = "Camera";

let openCompleteHandler: Function = () => {};
let openCompleteTimeout: number = null;

let bodyScrolled = (entries: IntersectionObserverEntry[]) => {
	entries.forEach(entry => {
		if (entry.intersectionRatio < intersectionThresholdOpening) return;

		if (entry.intersectionRatio < intersectionThresholdOpened) {
			// OnOpening
			location.replace("#" + entry.target.id.substring(4));
		} else {
			// OnOpened
			openCompleteHandler();
		}
	});
};

function isOnCameraPage(): boolean {
	return location.hash.length <= 1 || location.hash == "#Camera";
}

window.addEventListener("resize", function () {
	if (Catalogue.AllSwipingPages.filter(page => page.pageId == currentPageId).length > 0)
		document.getElementById("page" + currentPageId).scrollIntoView();
});

window.openPage = function (id: string) {
	if (id.substring(0, 4) == "page") id = id.substring(4);
	location.hash = id;
};

window.onhashchange = function () {
	if (location.hash == "#" + currentPageId) return;

	let previousPageId: string = currentPageId;
	let previousPage: HTMLDivElement = document.querySelector("#page" + previousPageId);

	let page: HTMLDivElement;
	currentPageId = location.hash.substring(1);
	if (location.hash.length <= 1) {
		currentPageId = Catalogue.PageCamera.pageId;
		page = Catalogue.PageCamera.pageElem;
	} else {
		page = document.querySelector("#page" + currentPageId);
	}

	// hide all other page overlays
	let isCurrentAnOverlay = false;
	let overlayPages = Catalogue.AllOverlayPages;
	for (let i in overlayPages) {
		let overlayPage: Page = overlayPages[i];
		if (overlayPage.pageId == currentPageId) {
			isCurrentAnOverlay = true;
			page.classList.add("page-overlay-show");
		} else {
			overlayPage.pageElem.classList.remove("page-overlay-show");
		}
	}

	openCompleteHandler = () => {
		clearTimeout(openCompleteTimeout);
		openCompleteHandler = () => {};
		(page.Page as Page).OnOpened();

		if (!isCurrentAnOverlay) {
			startObserver();
		}
	};
	clearTimeout(openCompleteTimeout);
	openCompleteTimeout = setTimeout(openCompleteHandler, 1000);

	if (!!previousPage.Page) (previousPage.Page as Page).OnClose();
	if (!!page.Page) (page.Page as Page).OnOpening();

	if (isCurrentAnOverlay) {
		stopObserver();
	} else {
		let isPreviousAnOverlay = Catalogue.AllSwipingPages.indexOf(previousPage.Page as Page) === -1;
		if (!isPreviousAnOverlay) { // swiping page to swiping page transition
			stopObserver(); // observer is re-enabled after openCompleteTimeout
			page.scrollIntoView({
				behavior: "smooth"
			});
		}
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
