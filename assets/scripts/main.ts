let constraints = { video: { facingMode: "user" }, audio: false };

let pageCamera: HTMLDivElement;
let cameraViewfinder: HTMLVideoElement,
	cameraOutput: HTMLImageElement,
	cameraSensor: HTMLCanvasElement,
	cameraTrigger: HTMLButtonElement;

window.addEventListener("load", function() {
	pageCamera = document.querySelector("#pageCamera");
	cameraViewfinder = pageCamera.querySelector("#cameraViewfinder");
	cameraOutput = pageCamera.querySelector("#cameraOutput");
	cameraSensor = pageCamera.querySelector("#cameraSensor");
	cameraTrigger = pageCamera.querySelector("#cameraTrigger");

	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
		console.log("Let's get this party started")
		startCamera();
	} else {
		return; // todo: show camera error message
	}
});

async function startCamera() {
	let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

	//let track = mediaStream.getTracks()[0];
	cameraViewfinder.srcObject = mediaStream;
}
