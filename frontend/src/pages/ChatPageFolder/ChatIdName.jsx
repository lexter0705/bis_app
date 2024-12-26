import React from "react";
import { useParams } from "react-router";

const ChatIdName = () => {

	const params = useParams();

	return (
		<div className="ChatIdName">
			{params.chat_name}
		</div>
	);
};

export default ChatIdName;