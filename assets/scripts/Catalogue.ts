import {Page} from "./Page";
import {PageFeed} from "./PageFeed";
import {PageCamera} from "./PageCamera";
import {PageChat} from "./PageChat";
import {PageChatOpen} from "./PageChatOpen";
import {PageSearch} from "./PageSearch";

class _Catalogue {
	PageFeed: PageFeed;
	PageCamera: PageCamera;
	PageChat: PageChat;

	PageChatOpen: PageChatOpen;
	PageSearch: PageSearch;

	get AllPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat, this.PageChatOpen, this.PageSearch ];
	}
	get AllOverlayPages(): Page[] {
		return [ this.PageChatOpen, this.PageSearch ];
	}
}

export let Catalogue: _Catalogue = new _Catalogue();
