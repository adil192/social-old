import "./pageCamera.js";

let body: HTMLBodyElement;
let observer: IntersectionObserver;

const intersectionThreshold: number = 0.9;

// eventually move these into their own scripts
let pageFeed: HTMLDivElement,
	pageMessages: HTMLDivElement;


window.addEventListener("load", function() {
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
let bodyScrolled = (entries: IntersectionObserverEntry[], observer: any) => {
	entries.forEach(entry => {
		if (entry.intersectionRatio < intersectionThreshold) return;

		clearTimeout(bodyScrolledTimeout);
		bodyScrolledTimeout = setTimeout(function () {
			if (location.hash != "#" + entry.target.id) {
				location.hash = entry.target.id;
			}
		}, 100);
	});
};
