import React, {useRef, useState} from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

const SignInPage = () => {

	const addressDivRef = useRef("");
	const secretDivRef = useRef("");
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [secret, setSecret] = useState("");


	const handleRegister = () => {
		fetch(`https://bis-api.online/users/signup/${name}`, {method: 'POST'})
			.then((response) => {
				console.log(response);
				return response.json()
			})
			.then((data) => {
				if (data.address !== undefined){
					const addressDiv = document.querySelector('.addressDiv')
					addressDiv.textContent = `${data.address}`;
					setAddress(data.address);
					const secretDiv = document.querySelector('.secretDiv')
					secretDiv.textContent = `${data.mnemonic}`;
					setSecret(data.mnemonic)
				}
				console.log(data);
			})
	};



	return (
		<div className="SignInPage">
			<h1 id="registration_h">Регистрация</h1>
			<h3 id="signIn_h3">Придумайте себе имя</h3>
			<input id="name_input"
				   type="text"
				   value={name}
				   onChange={(e) => setName(e.target.value)}
			/>
			<button id="registration_button" onClick={handleRegister}>Зарегистрироваться</button>
			<CopyToClipboard text={address}>
				<p id="registration_p_important" className="addressDiv" ref={addressDivRef}>{address}</p>
			</CopyToClipboard>
			<CopyToClipboard text={secret}>
				<p id="registration_p_important" className="secretDiv" ref={secretDivRef}>{secret}</p>
			</CopyToClipboard>
			<a id="registration_button" href={"/logIn"}>Вход</a>
		</div>
	);
};

export default SignInPage;