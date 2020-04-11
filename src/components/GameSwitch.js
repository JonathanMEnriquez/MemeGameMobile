import React, {useState, useEffect} from 'react';
import InitialView from './InitialView';
import SocketConnection from './Socket';
import Constants from '../utils/Constants';
import JudgeView from './JudgeView';
import PlayerView from './PlayerView';

const GameSwitch = (props) => {
    const gameModes = {
        initial: 'in',
        judge: 'ju',
        player: 'pl'
    }
    const [mode, setMode] = useState();
    const [socket, setSocket] = useState();
    const [hand, setHand] = useState([]);
    const [round, setRound] = useState();
    const [playerSelf, setSelf] = useState();
    const socketCallbacks = {};
    socketCallbacks[Constants.SOCKET_SEND_ID] = () => setMode(gameModes.initial);
    socketCallbacks[Constants.SOCKET_SEND_HAND] = (hand) => setHand(hand);
    socketCallbacks[Constants.SOCKET_START_ROUND_AS_JUDGE] = (round) => startRound(true, round);
    socketCallbacks[Constants.SOCKET_START_ROUND_AS_PLAYER] = (round) => startRound(false, round);

    const startRound = (isJudge, round) => {
        setRound(round);
        setMode(isJudge ? gameModes.judge : gameModes.player);
    };

    useEffect(() => setSocket(new SocketConnection(socketCallbacks)), []);

    const renderContent = () => {
        switch(mode) {
            case gameModes.initial:
                return <InitialView socket={socket}
                        setGameMode={setMode}
                        gameModes={gameModes}
                        setSelf={setSelf} />
            case gameModes.judge:
                return <JudgeView />
            case gameModes.player:
                return <PlayerView hand={hand} 
                        playerSelf={playerSelf} 
                        round={round} />
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