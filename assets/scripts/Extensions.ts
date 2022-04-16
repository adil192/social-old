interface Window {
	openPage(id: string);

	currentChat?: {
		id: number;
		name?: string;
		isGroupChat: boolean;
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
