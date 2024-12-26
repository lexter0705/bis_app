import React from "react";
import { Link } from 'react-router-dom';

const Chat = (props) => {

	return (
		<Link className="Chat" to={`/chat/${props.chat_name}/${props.chat_id}`}>
			{props.chat_name}
		</Link>
	);
};

export default Chat;