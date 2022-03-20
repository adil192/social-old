import { Page } from "./Page.js";

export class PageCamera extends Page {
	readonly constraints: MediaStreamConstraints = {
		video: {
			facingMode: "user"
		},
		audio: false
	};

	cameraViewfinder: HTMLVideoElement;
	cameraOutput: HTMLImageElement;
	cameraSensor: HTMLCanvasElement;
	cameraTrigger: HTMLButtonElement;

	stream: MediaStream = null;
	isPictureTaken: boolean = false;

	constructor() {
		super("pageCamera");
		this.cameraViewfinder = this.pageElem.querySelector("#cameraViewfinder");
		this.cameraOutput = this.pageElem.querySelector("#cameraOutput");
		this.cameraSensor = this.pageElem.querySelector("#cameraSensor");
		this.cameraTrigger = this.pageElem.querySelector("#cameraTrigger");

		if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) return;

		this.isCameraPaused = false;
		this.cameraTrigger.onclick = this.takePicture;
	}

	private _isCameraPaused: boolean = true;
	private stopCameraTimeout: number = null;
	get isCameraPaused(): boolean {
		return this._isCameraPaused;
	}
	set isCameraPaused(pause: boolean) {
		if (this.isPictureTaken) return;
		if (pause) {
			if (this._isCameraPaused) return;
			if (this.stopCameraTimeout != null) return;
			this.stopCameraTimeout = setTimeout(() => {
				try {
					this.stream.getTracks().forEach(function(track) {
						track.stop();
					});
				} catch (e) { }
				this.stream = null;
				this.cameraViewfinder.srcObject = null;
				this._isCameraPaused = pause;
			}, 3000);
		} else {
			if (this._isCameraPaused) { // then unpause
				navigator.mediaDevices.getUserMedia(this.constraints)
					.then(stream => {
						this.stream = stream;
						this.cameraViewfinder.srcObject = this.stream;
					});
			} // otherwise still clear timeout
			this._isCameraPaused = pause;
			clearTimeout(this.stopCameraTimeout);
			this.stopCameraTimeout = null;
		}

	}

	async takePicture() {
		if (this.isPictureTaken) {
			this.isPictureTaken = false;
			this.isCameraPaused = false;
			this.cameraOutput.classList.remove("show");
			return;
		}
		if (this.stream == null) return;
		this.cameraSensor.width = this.cameraViewfinder.videoWidth;
		this.cameraSensor.height = this.cameraViewfinder.videoHeight;
		this.cameraSensor.getContext("2d").drawImage(this.cameraViewfinder, 0, 0);
		this.cameraOutput.src = this.cameraSensor.toDataURL("image/webp");
		this.cameraOutput.classList.add("show");
		this.isCameraPaused = true;
		this.isPictureTaken = true;
	}
}
