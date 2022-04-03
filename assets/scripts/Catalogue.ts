import {Page} from "./Page";
import {PageFeed} from "./PageFeed";
import {PageCamera} from "./PageCamera";
import {PageChat} from "./PageChat";
import {PageMessages} from "./PageMessages";
import {PageSearch} from "./PageSearch";

class _Catalogue {
	PageFeed: PageFeed;
	PageCamera: PageCamera;
	PageChat: PageChat;

	PageMessages: PageMessages;
	PageSearch: PageSearch;

	get AllPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat, this.PageMessages, this.PageSearch ];
	}
	get AllOverlayPages(): Page[] {
		return [ this.PageMessages, this.PageSearch ];
	}
}

export let Catalogue: _Catalogue = new _Catalogue();
