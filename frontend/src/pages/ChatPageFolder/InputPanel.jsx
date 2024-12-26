import React, {useState} from "react";
import Cookies from 'js-cookie';
import {useParams} from "react-router";
import FileAlt from "../../images/FileAlt.svg";
import axios from "axios"

const InputPanel = () => {
    const [file, setFile] = useState(null);
    const [isImage, setIsImage] = useState(false); // Добавляем состояние для определения, является ли файл изображением

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.type.split('/')[1];
            setIsImage(fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'gif');

            setFile({
                file: selectedFile,
                url: URL.createObjectURL(selectedFile),
                name: selectedFile.name,
                type: fileExtension
            });
        }
    };


    const [message, setMessage] = useState("");
    const params = useParams();


    const sendMessage = () => {
        if (!message.trim()) return;
        axios.post(`https://bis-api.online/messages/send_message/`,
            {
                chat_id: params.chat_id,
                user: Cookies.get('address'),
                text: message
            },
            {headers: {'Content-Type': 'application/json'}})
        setMessage("");
    };

    return (
        <>
            {(file != null)
                ? <div className="UploadedFile">
                    <img
                        src={isImage
                            ? file.url
                            : FileAlt}
                        alt="file"
                        className="FileIcon"
                    />
                    <div className="FileName">{file.name}</div>
                    <button className="DeleteFileButton" onClick={() => setFile(null)}></button>
                </div>
                : null}

            <div className="InputPanel">
                <input id="MessageInput"
                       type="text"
                       value={message}
                       placeholder="Введите сообщение"
                       onChange={(e) => setMessage(e.target.value)}/>

                {(message === "" && file === null)
                    ? <>
                        <input type="file" id="AddFileButton" name="AddFileButton"
                               onChange={handleChange}></input>
                        <label id="AddFileButtonIMG" htmlFor="AddFileButton"/>
                        <button id="SendMessageButton" onClick={sendMessage}/>
                        {/*<button id="RecordVoiseButton" onClick={sendMessage}/>*/}
                    </>
                    : <button id="SendMessageButton" onClick={sendMessage}/>
                }
            </div>
        </>
    )
        ;
};

export default InputPanel;