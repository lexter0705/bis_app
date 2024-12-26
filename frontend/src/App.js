import './App.css';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';
import SignInPage from './pages/SignInPage';
import LogInPage from './pages/LogInPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ChatListPage/>}/>
					<Route path="/chat/:chat_name/:chat_id" element={<ChatPage />} />
					<Route path="/call/:chat_name/:chat_id" element={<CallPage />} />
					<Route path="/signIn" element={<SignInPage />} />
					<Route path="/logIn" element={<LogInPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
