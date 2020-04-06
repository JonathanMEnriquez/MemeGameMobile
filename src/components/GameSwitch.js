import React, {useState, useEffect} from 'react';
import InitialView from './InitialView';
import SocketConnection from './Socket';
import Constants from '../utils/Constants';

const GameSwitch = (props) => {
    const gameModes = {
        initial: 'in',
        judge: 'ju',
        gamer: 'ga'
    }
    const [mode, setMode] = useState();
    const [socket, setSocket] = useState();
    const [hand, setHand] = useState([]);
    const socketCallbacks = {};
    socketCallbacks[Constants.SOCKET_SEND_ID] = () => setMode(gameModes.initial);
    socketCallbacks[Constants.SOCKET_SEND_HAND] = (hand) => setHand(hand);

    useEffect(() => setSocket(new SocketConnection(socketCallbacks)), []);

    const renderContent = () => {
        switch(mode) {
            case gameModes.initial:
                return <InitialView socket={socket}
                        setGameMode={setMode}
                        gameModes={gameModes} />
            case gameModes.judge:
                return <div></div>
            default:
                return (
                    <div style={{width: '100vw', height: '100vh', display: 'flex', 
                        justifyContent: 'center', alignItems: 'center'}}>
                            <p>Waiting for connection to Game Server...</p>
                    </div>
                )
        }
    }

    return renderContent();
}

export default GameSwitch;