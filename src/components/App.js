import React from 'react';
import '../css/App.css';
import GameSwitch from './GameSwitch';
import OpenSocket from 'socket.io-client';

const App = () => {
  const socket = OpenSocket('192.168.1.21:6969');

  return (
    <div className="App">
      <GameSwitch
        socket={socket} />
    </div>
  );
}

export default App;
