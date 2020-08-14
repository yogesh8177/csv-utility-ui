import React, {useState, useEffect} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import logo from './logo.svg';
import './App.css';
import ScreenContainer from './Components/Screens/ScreenContainer';

function App() {

  const [userId, setUserId]       = useState('null');
  const [webSocket, setWebSocket] = useState(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    let _userId = intitializeUser();
    initializeWebSocket(_userId, toast);
    return () => {
      setWebSocket(null);
      setConnected(false);
    }
  }
  , 
  [connected]);

  function displayToast(message, type) {
    console.log('inside toast trigger function');
    toast[type](message);
  }

  function intitializeUser() {
    let _userId = localStorage.getItem('userId');
    if (!_userId) {
      _userId = uuidv4();
      localStorage.setItem('userId', _userId);
    }
    setUserId(_userId);
    return _userId;
  }
  
  function initializeWebSocket(_userId, _toast) {
    const socket = new WebSocket(`wss://ymhc0xvi9h.execute-api.us-east-1.amazonaws.com/test?userId=${_userId}`);
    socket.onopen = event => {
      setWebSocket(socket);
      setConnected(true);
      console.log('connected to websocket', event);
    }
    socket.onmessage = event => {
      console.log(event);
      const data = JSON.parse(event.data);
      const toastMessage = data.status === 'complete' ? {message: 'Your job was successfully completed!', type: 'info'} : {message: 'Your job failed!', type: 'error'};
      _toast[toastMessage.type](toastMessage.message);
      console.log(JSON.parse(event.data));
    }
    socket.onerror = e => {
      console.error({message: 'Error while connecitng to websocket', e});
      setWebSocket(null);
      setConnected(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <ScreenContainer userId={userId} />
      <ToastContainer newestOnTop={true} />
      </header>
    </div>
  );
}

export default App;
