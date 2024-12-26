import React from "react";
import ChatIdName from "./ChatIdName";
import ToChatListButton from "./ToChatListButton";
import {useParams} from "react-router";
import { Link } from 'react-router-dom';



const TopChatPanel = () => {


	const params = useParams();

	return (
		<div className="TopChatPanel">
			<ToChatListButton/>
			<ChatIdName/>
			<Link id="CallButton" to={`/call/${params.chat_name}/${params.chat_id}`}/>
		</div>
	);
};

export default TopChatPanel;