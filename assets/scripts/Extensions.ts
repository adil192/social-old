interface Window {
	openPage(id: string);

	currentChat?: {
		id: number;
		name?: string;
	};

	currentProfileId?: number;
}

interface HTMLDivElement {
	Page;
}
