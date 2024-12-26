import React, { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie';
import Message from "./Message";
import { useParams } from "react-router";

const MessagesPanel = () => {
	const [messages, setMessages] = useState([]); // Состояние для хранения сообщений
	const socket = useRef(null);
	const params = useParams();
	const messagesDivRef = useRef(null);

	useEffect(() => {
		socket.current = new WebSocket(`wss://bis-api.online/messages/ws/${params.chat_id}`);

		socket.current.onopen = () => {
			console.log("Соединение установлено");
		};

		socket.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setMessages(data.messages);
		};

		socket.current.onclose = () => {
			console.log("Соединение закрыто");
		};

		socket.current.onerror = (error) => {
			console.log(`Ошибка: ${error.message}`);
		};

		return () => {
			if (socket.current) {
				socket.current.close();
			}
		};
	}, [params.chat_id]);

	useEffect(() => {
		if (messagesDivRef.current) {
			messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="MessagesPanel" ref={messagesDivRef}>
			{messages.map((message, index) => (
				<Message
					key={index}
					messageText={message.messageText}
					className={
						message.userId === Cookies.get('address')
							? "user_message"
							: "interlocutor_message"
					}
				/>
			))}
		</div>
	);
};

export default MessagesPanel;
