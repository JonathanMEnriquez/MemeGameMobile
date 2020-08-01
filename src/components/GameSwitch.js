import React, {useState, useEffect, Component} from 'react';
import InitialView from './InitialView';
import SocketConnection from './Socket';
import Constants from '../utils/Constants';
import JudgeView from './JudgeView';
import PlayerView from './PlayerView';
import Select from './Select';
import WinnerView from './WinnerView';

const gameModes = {
    initial: 'in',
    judge: 'ju',
    player: 'pl',
    select: 'se',
    winner: 'wi',
}

class GameSwitch extends Component {
    state = { 
        gameModes: {
            initial: 'in',
            judge: 'ju',
            player: 'pl',
            select: 'se',
            winner: 'wi',
        },
        mode: gameModes.initial,
        socketId: null,
        socket: null,
        socketMethods: {},
        hand: [],
        round: null,
        playerSelf: null,
        judgeReady: false,
        isJudge: false,
        choices: [],
        winners: [],
        isNextRoundJudge: false,
    }

    componentWillMount(props) {
        this.setState({mode: this.state.gameModes.initial});
        const socketCallbacks = {};
        socketCallbacks[Constants.SOCKET_SEND_ID] = () => this.setState({ mode: this.state.gameModes.initial });
        socketCallbacks[Constants.SOCKET_SEND_HAND] = (cards) => this.receiveNewHand(cards);
        socketCallbacks[Constants.SOCKET_START_ROUND_AS_JUDGE] = (round) => this.startRound(true, round);
        socketCallbacks[Constants.SOCKET_START_ROUND_AS_PLAYER] = (round) => this.startRound(false, round);
        socketCallbacks[Constants.SOCKET_SEND_CARD] = (card) => this.addCardToHand(card);
        socketCallbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE] = this.receivedJudgePromptToContinue.bind(this);
        socketCallbacks[Constants.SOCKET_SEND_OPTIONS_TO_PLAYERS] = (choices) => this.startSelection(choices);
        socketCallbacks[Constants.SOCKET_SEND_WINNER_INFO] = (winnerInfo) => this.setWinnerInfo(winnerInfo);
        socketCallbacks[Constants.SOCKET_SEND_START_ROUND_OPTION] = () => this.showJudgeOptionStartRound.bind(this);

        this.setState({ 
            socketMethods: socketCallbacks,
            socket: new SocketConnection(this.props.socket, socketCallbacks)
        });
    }

    setWinnerInfo(winners) {
        this.setState({ winners: winners });
    }

    receiveNewHand(cards) {
        if (!this.state.hand.length) {
            this.setState({ hand: cards });
        }
    }

    showJudgeOptionStartRound() {
        console.debug('showjudgeoptionstartround called');
        if (!this.state.isJudge) {
            this.setState({ isNextRoundJudge: true });
        }
    }

    startRound(isJudge, round) {
        const { gameModes } = this.state;
        this.setState({ 
            isJudge: isJudge,
            round: round,
            judgeReady: false,
            isNextRoundJudge: false,
            mode: isJudge ? gameModes.judge : gameModes.player 
        });
    }

    startSelection(choices) {
        const { gameModes } = this.state;
        this.setState({ 
            choices: choices,
            mode: gameModes.select 
        });
    }

    removeCardFromHand(cardId) {
        const { hand } = this.state;
        const filtered = hand.filter(card => card.id !== cardId);
        this.setState({ hand: filtered });
    }

    receivedJudgePromptToContinue() {
        this.setState({ judgeReady: true });
    }

    addCardToHand(card) {
        const { hand } = this.state;
        const dupe = [...hand, card];
        this.setState({ hand: dupe });
    }

    judgeReadyToProceed() {
        this.state.socket.confirmReadyToJudge(this.state.playerSelf.name);
    }

    startNextRound() {
        this.state.socket.startNextRoundSignal(this.state.playerSelf.name);
    }

    submitRoundSelection(choice) {
        console.debug('Gameswitch SubmitRoundSelection method called with data: ' + choice);
        this.state.socket.submitRoundSelection(
            choice, 
            this.state.isJudge, 
            this.state.playerSelf.name, 
            this.state.round);
    }

    renderContent() {
        const { mode, socket, socketId, judgeReady, playerSelf,
                hand, round, isJudge, choices, winners, isNextRoundJudge } = this.state;
        switch(mode) {
            case gameModes.initial:
                return <InitialView socket={socket}
                        socketId={socketId}
                        setGameMode={(newMode) => this.setState({ mode: newMode })}
                        gameModes={gameModes}
                        setSelf={(selfInfo) => this.setState({ playerSelf: selfInfo })} />
            case gameModes.judge:
                return <JudgeView showButton={judgeReady}
                        confirm={this.judgeReadyToProceed.bind(this)} />
            case gameModes.player:
                return <PlayerView hand={hand} 
                        playerSelf={playerSelf} 
                        round={round}
                        socket={socket}
                        removeCardFromHand={(card) => this.removeCardFromHand(card)} />
            case gameModes.select:
                return <Select isJudge={isJudge} 
                        choices={choices}
                        playerSelf={playerSelf}
                        submitRoundSelection={(selection) => this.submitRoundSelection(selection)}
                        switchToWinnerMode={() => this.setState({ mode: gameModes.winner })} />
            case gameModes.winner:
                return <WinnerView winners={winners}
                        isJudge={isJudge}
                        playerSelf={playerSelf}
                        displayNewRoundButton={isNextRoundJudge}
                        startNextRound={this.startNextRound.bind(this)} />
            default:
                return (
                    <div style={{width: '100vw', height: '100vh', display: 'flex', 
                        justifyContent: 'center', alignItems: 'center'}}>
                            <p>Waiting for connection to Game Server...</p>
                    </div>
                )
        }
    }

    render() { return this.renderContent() }
}
 
export default GameSwitch;
