interface Window {
	openPage(id: string);

	currentChat?: {
		id: number;
		name?: string;
		isGroupChat: boolean;
	};

	currentProfileId?: number;
	currentProfileChanged?: boolean;
}

interface HTMLDivElement {
	Page: unknown;
}
