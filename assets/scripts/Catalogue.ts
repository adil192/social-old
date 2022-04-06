import {Page} from "./Page";
import {PageFeed} from "./PageFeed";
import {PageCamera} from "./PageCamera";
import {PageChat} from "./PageChat";
import {PageMessages} from "./PageMessages";
import {PageSearch} from "./PageSearch";
import {PageProfile} from "./PageProfile";

class _Catalogue {
	PageFeed: PageFeed;
	PageCamera: PageCamera;
	PageChat: PageChat;

	PageMessages: PageMessages;
	PageSearch: PageSearch;
	PageProfile: PageProfile;

	get AllPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat, this.PageMessages, this.PageSearch, this.PageProfile ];
	}
	get AllSwipingPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat ];
	}
	get AllOverlayPages(): Page[] {
		return [ this.PageMessages, this.PageSearch, this.PageProfile ];
	}
}

export let Catalogue: _Catalogue = new _Catalogue();
