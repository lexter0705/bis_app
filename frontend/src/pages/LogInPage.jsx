import React, {useState} from "react";
import Cookies from 'js-cookie';


const LogInPage = () => {

	const [secret, setSecret] = useState("");

	const handleRegister = () => {
		fetch(`https://bis-api.online/users/login/${secret}`, {method: 'POST'})

			.then((response) => response.json())
			.then((data) => {
				if (data.address !== undefined){
					Cookies.set('address', `${data.address}`, {expires: 365})
					window.location.href = '/'
				}
			})
	};

	return (
		<div className="LogInPage">
			<h1 id="login_h1">Вход</h1>
			<h3 id="login_h3">Введите секретную фразу</h3>
			<input id="login_input"
				   type="text"
				   value={secret}
				   onChange={(e) => setSecret(e.target.value)}
			/>
			<button id="login_button" onClick={handleRegister}>Войти</button>
			<a id="login_button" href={"/signIn"}>Регистрация</a>
		</div>
	);
};

export default LogInPage;