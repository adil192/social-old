let constraints: MediaStreamConstraints = {
	video: {
		width: {
			min: 500,
			ideal: 1080,
			max: 2000
		},
		height: {
			min: 500,
			ideal: 2400,
			max: 4000
		},
		facingMode: "user"
	},
	audio: false
};

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

	cameraTrigger.onclick = takePicture;
});

async function startCamera() {
	let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

	//let track = mediaStream.getTracks()[0];
	cameraViewfinder.srcObject = mediaStream;
}

function takePicture() {
	cameraSensor.width = cameraViewfinder.videoWidth;
	cameraSensor.height = cameraViewfinder.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraViewfinder, 0, 0);
	cameraOutput.src = cameraSensor.toDataURL("image/webp");
	cameraOutput.classList.add("show");
}

