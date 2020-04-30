import React, {useState, useEffect} from 'react';
import InitialView from './InitialView';
import SocketConnection from './Socket';
import Constants from '../utils/Constants';
import JudgeView from './JudgeView';
import PlayerView from './PlayerView';
import Select from './Select';
import WinnerView from './WinnerView';

const GameSwitch = (props) => {
    const gameModes = {
        initial: 'in',
        judge: 'ju',
        player: 'pl',
        select: 'se',
        winner: 'wi',
    }
    const [mode, setMode] = useState();
    const [socket, setSocket] = useState();
    const [hand, setHand] = useState([]);
    const [round, setRound] = useState();
    const [playerSelf, setSelf] = useState();
    const [judgeReady, setJudgeReady] = useState(false);
    const [isJudge, setIsJudge] = useState();
    const [choices, setChoices] = useState();
    const [winners, setWinners] = useState();
    const [isNextRoundJudge, setIsNextRoundJudge] = useState(false);
    const socketCallbacks = {};
    socketCallbacks[Constants.SOCKET_SEND_ID] = () => setMode(gameModes.initial);
    socketCallbacks[Constants.SOCKET_SEND_HAND] = (cards) => receiveNewHand(cards);
    socketCallbacks[Constants.SOCKET_START_ROUND_AS_JUDGE] = (round) => startRound(true, round);
    socketCallbacks[Constants.SOCKET_START_ROUND_AS_PLAYER] = (round) => startRound(false, round);
    socketCallbacks[Constants.SOCKET_SEND_CARD] = (card) => addCardToHand(card, hand);
    socketCallbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE] = () => receivedJudgePromptToContinue();
    socketCallbacks[Constants.SOCKET_SEND_OPTIONS_TO_PLAYERS] = (choices) => startSelection(choices);
    socketCallbacks[Constants.SOCKET_SEND_WINNER_INFO] = (winnerInfo) => setWinnerInfo(winnerInfo);
    socketCallbacks[Constants.SOCKET_SEND_START_ROUND_OPTION] = () => showJudgeOptionStartRound();

    const setWinnerInfo = (winners) => {
        setWinners(winners);
    };

    useEffect(() => console.log('handy ', hand), [hand]);

    const receiveNewHand = (cards) => {
        console.log('receiving hand? ', cards);
        if (!hand.length) {
            setHand(cards);
        }
    };

    const showJudgeOptionStartRound = () => {
        // checks if player is judge this round because if so, he would not be the next round's judge
        if (!isJudge) {
            // give a view a button to continue
            setIsNextRoundJudge(true);
        }
    };

    const startRound = (isJudge, round) => {
        console.log(hand);
        setIsJudge(isJudge);
        setIsNextRoundJudge(false);
        setJudgeReady(false);
        setRound(round);
        setMode(isJudge ? gameModes.judge : gameModes.player);
    };

    const startSelection = (choices) => {
        setChoices(choices);
        setMode(gameModes.select);
    };

    const removeCardFromHand = (cardId) => {
        console.log('removing card with ', cardId);
        console.log(hand.filter(card => card.id !== cardId));
        const filtered = hand.filter(card => card.id !== cardId);
        setHand(filtered);
    };

    const receivedJudgePromptToContinue = () => {
        setJudgeReady(true);
    };

    const addCardToHand = (card, myHand) => {
        console.log('what? ', hand, myHand);
        const dupe = [...hand];
        dupe.push(card);
        console.log('adding ', dupe);
        // setHand(dupe);
    };

    const judgeReadyToProceed = () => {
        socket.confirmReadyToJudge(playerSelf.name);
    };

    const startNextRound = () => {
        socket.startNextRoundSignal(playerSelf.name);
    };

    const submitRoundSelection = (choice) => {
        console.log('Gameswitch SubmitRoundSelection method called with data: ' + choice);
        socket.submitRoundSelection(choice, isJudge, playerSelf.name, round);
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
                return <JudgeView showButton={judgeReady}
                        confirm={judgeReadyToProceed} />
            case gameModes.player:
                return <PlayerView hand={hand} 
                        playerSelf={playerSelf} 
                        round={round}
                        socket={socket}
                        removeCardFromHand={removeCardFromHand} />
            case gameModes.select:
                return <Select isJudge={isJudge} 
                        choices={choices}
                        playerSelf={playerSelf}
                        submitRoundSelection={submitRoundSelection}
                        switchToWinnerMode={() => setMode(gameModes.winner)} />
            case gameModes.winner:
                return <WinnerView winners={winners}
                        isJudge={isJudge}
                        playerSelf={playerSelf}
                        displayNewRoundButton={isNextRoundJudge}
                        startNextRound={startNextRound} />
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