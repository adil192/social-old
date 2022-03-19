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
let isCameraPaused: boolean = true;
let isPictureTaken: boolean = false;

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

let stopCameraTimeout: number = null;
async function setCameraPaused(pause: boolean) {
	if (isCameraPaused == pause) return;
	if (pause) {
		if (stopCameraTimeout != null) return;
		stopCameraTimeout = setTimeout(function () {
			try {
				stream.getTracks().forEach(function(track) {
					track.stop();
				});
			} catch (e) { }
			stream = null;
			cameraViewfinder.srcObject = null;
			isCameraPaused = true;
		}, 3000);
	} else {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		cameraViewfinder.srcObject = stream;
		isCameraPaused = false;
		clearTimeout(stopCameraTimeout);
		stopCameraTimeout = null;
	}
}
window.setCameraPaused = setCameraPaused;

async function takePicture() {
	if (isPictureTaken) {
		await setCameraPaused(false);
		isPictureTaken = false;
		cameraOutput.classList.remove("show");
		return;
	}
	cameraSensor.width = cameraViewfinder.videoWidth;
	cameraSensor.height = cameraViewfinder.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraViewfinder, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL("image/webp");
	isPictureTaken = true;
	cameraOutput.classList.add("show");
	await setCameraPaused(true);
}
