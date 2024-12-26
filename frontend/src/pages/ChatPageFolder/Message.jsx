import React from "react";

const Message = (props) => {

	return (
		<div className={`Message ${props.className}`}>
			{props.messageText}
		</div>
	);
};

export default Message;