import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import Cookies from "js-cookie";

const CallPage = () => {
	const params = useParams();

	const [status, setStatus] = useState("Подключение к сети");
	const [micEnabled, setMicEnabled] = useState(true);
	const [callStarted, setCallStarted] = useState(false);

	const localAudioRef = useRef(null);
	const remoteAudioRef = useRef(null);

	const peerConnection = useRef(null);
	const localStream = useRef(null);
	const ws = useRef(null); // WebSocket для сигнализации

	useEffect(() => {
		// Устанавливаем соединение с сервером WebSocket
		ws.current = new WebSocket("ws://localhost:5000");

		ws.current.onopen = () => {
			setStatus("Подключено")
		};

		ws.current.onmessage = async (event) => {
			const data = JSON.parse(event.data);

			if (data.type === "offer") {
				await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));

				const answer = await peerConnection.current.createAnswer();
				await peerConnection.current.setLocalDescription(answer);

				ws.current.send(JSON.stringify({
					chat_id: params.chatId,
					user: Cookies.get('address'),
					type: "answer",
					answer: peerConnection.current.localDescription
				}));
			} else if (data.type === "answer") {
				await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
			} else if (data.type === "candidate") {
				await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
			}
		};

		return () => {
			if (ws.current) {
				ws.current.close();
				ws.current = null;
			}
		};
	}, [params.chatId]);

	const startCall = async () => {
		try {
			// Инициализируем медиапоток
			localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
			if (localAudioRef.current) {
				localAudioRef.current.srcObject = localStream.current;
			}

			// Создаем PeerConnection
			peerConnection.current = new RTCPeerConnection();

			// Добавляем локальные треки в PeerConnection
			localStream.current.getTracks().forEach(track => {
				peerConnection.current.addTrack(track, localStream.current);
			});

			// Обрабатываем входящие медиапотоки
			peerConnection.current.ontrack = (event) => {
				if (remoteAudioRef.current) {
					remoteAudioRef.current.srcObject = event.streams[0];
				}
			};

			// Обрабатываем ICE-кандидаты
			peerConnection.current.onicecandidate = (event) => {
				if (event.candidate) {
					ws.current.send(JSON.stringify({
						chat_id: params.chatId,
						user: Cookies.get('address'),
						type: "candidate",
						candidate: event.candidate
					}));
				}
			};

			// Создаем и отправляем предложение (offer)
			const offer = await peerConnection.current.createOffer();
			await peerConnection.current.setLocalDescription(offer);

			ws.current.send(JSON.stringify({
				chat_id: params.chatId,
				user: Cookies.get('address'),
				type: "offer",
				offer: peerConnection.current.localDescription
			}));

			setStatus("Звонок начался. Ожидание ответа...");
			setCallStarted(true);
		} catch (error) {
			console.error("Ошибка при подключении к звонку:", error);
			setStatus("Ошибка подключения.");
		}
	};

	const toggleMic = () => {
		if (localStream.current) {
			localStream.current.getAudioTracks().forEach(track => {
				track.enabled = !track.enabled;
				setMicEnabled(track.enabled);
			});
		}
	};

	const endCall = () => {
		// Очистка ресурсов при завершении звонка
		if (peerConnection.current) {
			peerConnection.current.close();
			peerConnection.current = null;
		}

		if (localStream.current) {
			localStream.current.getTracks().forEach(track => track.stop());
			localStream.current = null;
		}

		if (ws.current) {
			ws.current.close();
			ws.current = null;
		}

		setStatus("Звонок завершен.");
		setCallStarted(false);
		window.location.href = `/chat/${params.chat_name}/${params.chat_id}`
	};

	return (
		<div className="CallPage">
			<div className="CallName">{params.chat_name}</div>
			<p className="CallInformation">{status}</p>
			<div className="AudioContainer">
				<audio ref={localAudioRef} autoPlay muted></audio>
				<audio ref={remoteAudioRef} autoPlay></audio>
			</div>
			<div className="CallButtons">
				{!callStarted && <button className="StartCallButton" onClick={startCall}>Начать звонок</button>}
				{!callStarted && <button className="StartCallButton" onClick={(e) => window.location.href = `/chat/${params.chat_name}/${params.chat_id}`}>Назад</button>}
				{callStarted && <button className="VoisButton" onClick={toggleMic}>{micEnabled ? "Выключить микрофон" : "Включить микрофон"}</button>}
				{callStarted && <button className="CallOffButton" onClick={endCall}>Завершить звонок</button>}
			</div>
		</div>
	);
};

export default CallPage;
