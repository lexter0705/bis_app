import React from "react";
import TopChatPanel from "./ChatPageFolder/TopChatPanel";
import MessagesPanel from "./ChatPageFolder/MessagesPanel";
import InputPanel from "./ChatPageFolder/InputPanel";


const ChatPage = () => {

	return (
		<div className="ChatPage">
			<TopChatPanel/>
			<MessagesPanel/>
			<InputPanel/>
		</div>
	);
};

export default ChatPage;