import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import ScreenContainer from './Components/Screens/ScreenContainer';

function App() {

  const [webSocket, setWebSocket] = useState(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
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
    return () => {
      setWebSocket(null);
      setConnected(false);
    }
  }
  , 
  [connected]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      <ScreenContainer
      />
      </header>
    </div>
  );
}

export default App;
