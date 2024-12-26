import React from "react";
import TopChatPagePanel from "./ChatListPageFolder/TopChatPagePanel";
import ChatList from "./ChatListPageFolder/ChatList";
import Cookies from 'js-cookie';


const ChatListPage = () => {

	if (!Cookies.get('address')){
		window.location.href = '/SignIn'
	}

	return (
		<div className="ChatListPage">
			<TopChatPagePanel/>
			<ChatList/>
		</div>
	);
};

export default ChatListPage;