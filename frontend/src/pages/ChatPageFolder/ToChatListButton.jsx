import React from "react";

const ToChatListButton = () => {

	const exit = () =>{
		window.location.href = '/'
	}

	return (
		<button className="ToChatListButton" onClick={exit}/>
	);
};

export default ToChatListButton;