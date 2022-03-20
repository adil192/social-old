import {Page} from "./Page.js";
import {PageFeed} from "./PageFeed.js";
import {PageCamera} from "./pageCamera.js";
import {PageChat} from "./pageChat.js";
import {PageChatOpen} from "./PageChatOpen.js";

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
