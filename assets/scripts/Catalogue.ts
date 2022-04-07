import {Page} from "./Page";
import {PageFeed} from "./PageFeed";
import {PageCamera} from "./PageCamera";
import {PageChat} from "./PageChat";
import {PageMessages} from "./PageMessages";
import {PageSearch} from "./PageSearch";
import {PageProfile} from "./PageProfile";
import {PageProfileEdit} from "./PageProfileEdit";

class _Catalogue {
	PageFeed: PageFeed;
	PageCamera: PageCamera;
	PageChat: PageChat;

	PageMessages: PageMessages;
	PageSearch: PageSearch;
	PageProfile: PageProfile;
	PageProfileEdit: PageProfileEdit;

	get AllPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat, this.PageMessages, this.PageSearch, this.PageProfile, this.PageProfileEdit ];
	}
	get AllSwipingPages(): Page[] {
		return [ this.PageFeed, this.PageCamera, this.PageChat ];
	}
	get AllOverlayPages(): Page[] {
		return [ this.PageMessages, this.PageSearch, this.PageProfile, this.PageProfileEdit ];
	}
}

export let Catalogue: _Catalogue = new _Catalogue();
