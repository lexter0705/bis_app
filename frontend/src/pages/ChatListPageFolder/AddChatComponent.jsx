import React, {useState} from "react";
import Cookies from 'js-cookie';
import {CopyToClipboard} from 'react-copy-to-clipboard';


const AddChatComponent = () => {

	const [addUser, setAddUser] = useState("");

	const addChat = () => {
		fetch(`https://bis-api.online/chats/add_chat/${Cookies.get('address')}/${addUser}`, {method: 'POST'})
	};

	return (
		<div className="AddChatComponent">
			<input id="AddChatInput"
				   type="text"
				   value={addUser}
				   placeholder="Введите адрес пользователя"
				   onChange={(e) => setAddUser(e.target.value)}/>
			<button id="AddChatButton" onClick={addChat}>+</button>
		</div>
	);
};

export default AddChatComponent;