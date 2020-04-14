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
    const [judgeReady, setJudgeReady] = useState(false);
    const socketCallbacks = {};
    socketCallbacks[Constants.SOCKET_SEND_ID] = () => setMode(gameModes.initial);
    socketCallbacks[Constants.SOCKET_SEND_HAND] = (hand) => setHand(hand);
    socketCallbacks[Constants.SOCKET_START_ROUND_AS_JUDGE] = (round) => startRound(true, round);
    socketCallbacks[Constants.SOCKET_START_ROUND_AS_PLAYER] = (round) => startRound(false, round);
    socketCallbacks[Constants.SOCKET_SEND_CARD] = (card) => addCardToHand(card);
    socketCallbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE] = () => receivedJudgePromptToContinue();

    const startRound = (isJudge, round) => {
        setJudgeReady(false);
        setRound(round);
        setMode(isJudge ? gameModes.judge : gameModes.player);
    };

    const removeCardFromHand = (cardId) => {
        const filtered = hand.filter(card => card.id !== cardId);
        setHand(filtered);
    };

    const receivedJudgePromptToContinue = () => {
        console.log(this, mode, gameModes.judge);
        console.log('about to set judge to ready');
        setJudgeReady(true);
    }

    const addCardToHand = (card) => {
        const dupe = [...hand, card];
        setHand(dupe);
    }

    const judgeReadyToProceed = () => {
        socket.confirmReadyToJudge(playerSelf.name);
    }

    useEffect(() => setSocket(new SocketConnection(socketCallbacks)), []);

    const renderContent = () => {
        switch(mode) {
            case gameModes.initial:
                return <InitialView socket={socket}
                        setGameMode={setMode}
                        gameModes={gameModes}
                        setSelf={setSelf} />
            case gameModes.judge:
                return <JudgeView showButton={judgeReady}
                        confirm={judgeReadyToProceed} />
            case gameModes.player:
                return <PlayerView hand={hand} 
                        playerSelf={playerSelf} 
                        round={round}
                        socket={socket}
                        removeCardFromHand={removeCardFromHand} />
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