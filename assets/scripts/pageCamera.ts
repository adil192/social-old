let constraints: MediaStreamConstraints = {
	video: {
		facingMode: "user"
	},
	audio: false
};

let pageCamera: HTMLDivElement;
let cameraViewfinder: HTMLVideoElement,
	cameraOutput: HTMLImageElement,
	cameraSensor: HTMLCanvasElement,
	cameraTrigger: HTMLButtonElement;
let stream: MediaStream;

window.addEventListener("load", async function() {
	pageCamera = document.querySelector("#pageCamera");
	cameraViewfinder = pageCamera.querySelector("#cameraViewfinder");
	cameraOutput = pageCamera.querySelector("#cameraOutput");
	cameraSensor = pageCamera.querySelector("#cameraSensor");
	cameraTrigger = pageCamera.querySelector("#cameraTrigger");

	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
		console.log("Let's get this party started")
		await setCameraPaused(false);
	} else {
		return; // todo: show camera error message
	}

	cameraTrigger.onclick = takePicture;
});

async function setCameraPaused(pause: boolean) {
	if (pause) {
		stream.getTracks().forEach(function(track) {
			track.stop();
		});
	} else {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		cameraViewfinder.srcObject = stream;
	}
}
window.setCameraPaused = setCameraPaused;

async function takePicture() {
	cameraSensor.width = cameraViewfinder.videoWidth;
	cameraSensor.height = cameraViewfinder.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraViewfinder, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL("image/webp");
	cameraOutput.classList.add("show");
	await setCameraPaused(true);
}