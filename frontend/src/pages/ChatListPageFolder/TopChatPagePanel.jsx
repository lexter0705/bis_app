import AddChatComponent from "./AddChatComponent";
import ExitButton from "./ExitButton";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Cookies from "js-cookie";
import React from "react";


const TopChatPagePanel = () => {

	return (
		<>
			<CopyToClipboard className="CopyAddressButton" text={Cookies.get('address')}>
				<span className="CopyAddressButton">{Cookies.get('address')}</span>
			</CopyToClipboard>
			<div className="TopChatPagePanel">
				<ExitButton/>
				<AddChatComponent/>
			</div>
		</>

	);
};

export default TopChatPagePanel;