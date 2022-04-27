interface Window {
	prefersReducedMotion: boolean;

	openPage(id: string);

	currentChat?: {
		id: number;
		name?: string;
		isGroupChat: boolean;
		userId?: number;
	};

	currentProfileId?: number;
	currentProfileChanged?: boolean;

	pageMessages: {
		expandImage(image: HTMLImageElement): void;
	}
}

interface HTMLDivElement {
	Page: unknown;
}
