import {Page} from "./Page";
import {PageFeed} from "./PageFeed";
import {PageCamera} from "./PageCamera";
import {PageChat} from "./PageChat";
import {PageChatOpen} from "./PageChatOpen";

class _Catalogue {
	PageFeed: PageFeed;
	PageCamera: PageCamera;
	PageChat: PageChat;

	PageChatOpen: PageChatOpen;

	get AllPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat, this.PageChatOpen ];
	}
	get AllOverlayPages(): Page[] {
		return [ this.PageChatOpen ];
	}
}

export let Catalogue: _Catalogue = new _Catalogue();
