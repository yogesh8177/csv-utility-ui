import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import logo from './logo.svg';
import './App.css';
import ScreenContainer from './Components/Screens/ScreenContainer';

function App() {

  const [userId, setUserId]       = useState('null');
  const [webSocket, setWebSocket] = useState(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    intitializeUser();
    initializeWebSocket();
    return () => {
      setWebSocket(null);
      setConnected(false);
    }
  }
  , 
  [connected]);

  function intitializeUser() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userId', userId);
    }
    setUserId(userId);
  }
  
  function initializeWebSocket() {
    const socket = new WebSocket(`wss://ymhc0xvi9h.execute-api.us-east-1.amazonaws.com/test`);
    socket.onopen = event => {
      setWebSocket(socket);
      setConnected(true);
      console.log('connected to websocket', event);
    }
    socket.onmessage = event => {
      console.log(JSON.parse(event));
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
      <ScreenContainer userId={userId}
      />
      </header>
    </div>
  );
}

export default App;
