import React, {useEffect, useRef, useState} from "react";
import Cookies from 'js-cookie';
import Chat from "./Chat";

const ChatList = () => {

	const [chats, setChats] = useState([]);
	const usersDivRef = useRef(null);
	const socket = useRef(null);

	useEffect(() => {
		const cookieValue = Cookies.get('address')
		socket.current = new WebSocket(`wss://bis-api.online/chats/ws/${cookieValue}`);

		socket.current.onopen = function () {
			console.log("Соединение установлено!!");
		};

		socket.current.onmessage = function (event) {
			console.log("Get message");
			console.log(event.data);
			const data = JSON.parse(event.data);
			setChats(data.chats);
		};

		socket.current.onclose = function (event) {
			console.log("Соединение закрыто");
		};

		socket.current.onerror = function (error) {
			console.log(`Ошибка: ${error.message}`);
		};

		return () => {
			if (socket.current) {
				socket.current.close();
			}
		};
	}, []);

	return (
		<div className="ChatList" ref={usersDivRef}>
			{chats.map((chat) => (
				<Chat key={chat.chat_id} chat_id={chat.chat_id} chat_name={chat.chat_name} />
			))}
		</div>
	);
};

export default ChatList;