import React, {useState, useEffect} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import logo from './logo.svg';
import './App.css';
import ScreenContainer from './Components/Screens/ScreenContainer';
import NotificationContainer from './Components/Notification/NotificationContainer';

function App() {

  const [userId, setUserId]               = useState(null);
  const [webSocket, setWebSocket]         = useState(null);
  const [connected, setConnected]         = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    initializeNotifications();
    console.log('calling notification useEffect');
  }, [JSON.stringify(notifications)]); // Have to stringify as it will enter infinite loop as arrays are not detected!!

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
      const _notifications = data.jobs;
      const toastMessage = data.status === 'complete' ? {message: 'Your job was successfully completed!', type: 'info'} : {message: 'Your job failed!', type: 'error'};
      _toast[toastMessage.type](toastMessage.message);
     
      let savedNotifications = localStorage.getItem('notifications') ? JSON.parse(localStorage.getItem('notifications')) : [];
      
      savedNotifications.length && _notifications.forEach(n => savedNotifications.unshift(n));
      if(savedNotifications.length === 0) savedNotifications = _notifications;
      
      setNotifications(savedNotifications);
      localStorage.setItem('notifications', JSON.stringify(savedNotifications));
      console.log(JSON.parse(event.data));
    }
    socket.onerror = e => {
      console.error({message: 'Error while connecitng to websocket', e});
      setWebSocket(null);
      setConnected(false);
    }
  }

  function initializeNotifications() {
    let savedNotifications = localStorage.getItem('notifications') ? JSON.parse(localStorage.getItem('notifications')) : [];
    setNotifications(savedNotifications);
  }

  function handleNotificationChange(items) {
    console.log('notifications changed', items);
    setNotifications(items);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CSV transformation tool</h1>
        <p>(Launching as beta)</p>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <ScreenContainer userId={userId} />
        <ToastContainer newestOnTop={true} />
        <div>
          <NotificationContainer 
            notifications            = {notifications} 
            handleNotificationChange = {handleNotificationChange}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
