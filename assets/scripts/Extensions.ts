interface Window {
	openPage(id: string);

	currentChat?: {
		id: number;
		name?: string;
	};

	currentProfileId?: number;
	currentProfileChanged?: boolean;
}

interface HTMLDivElement {
	Page;
}
