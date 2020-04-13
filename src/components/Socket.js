import Constants from '../utils/Constants';
import OpenSocket from 'socket.io-client';
// const OpenSocket = window.require('socket.io-client');

function SocketConnection(methods) {
    let self = this;
    self.id = '';
    self.callbacks = methods;
    self.socket = OpenSocket('http://localhost:6969');

    self.socket.emit(Constants.SOCKET_NEW_CONNECTION);
    self.socket.on(Constants.SOCKET_SEND_ID, function(data) {
        console.log('SOCKET_SEND_ID ', data, self.callbacks);
        self.id = data.id;
        self.callbacks[Constants.SOCKET_SEND_ID]();
    });
    self.socket.on(Constants.SOCKET_SEND_HAND, (data) => {
        console.log('got a hand! ', data.hand.length);
        if (self.callbacks[Constants.SOCKET_SEND_HAND]) {
            self.callbacks[Constants.SOCKET_SEND_HAND](data.hand);
        }
        self.socket.emit(Constants.SOCKET_SEND_HAND_CONFIRM);
    });
    self.socket.on(Constants.SOCKET_START_ROUND_AS_JUDGE, (data) => {
        console.log('woooooo! I\'m the judge! ', data);
        if (self.callbacks[Constants.SOCKET_START_ROUND_AS_JUDGE]) {
            self.callbacks[Constants.SOCKET_START_ROUND_AS_JUDGE](data.round);
        }
    });
    self.socket.on(Constants.SOCKET_START_ROUND_AS_PLAYER, (data) => {
        console.log('woooooo! I\'m a player next round! ', data);
        if (self.callbacks[Constants.SOCKET_START_ROUND_AS_PLAYER]) {
            self.callbacks[Constants.SOCKET_START_ROUND_AS_PLAYER](data.round);
        }
    });
    self.socket.on(Constants.SOCKET_SEND_CARD, (data) => {
        console.log('woooo! got a card! ', data);
        if (self.callbacks[Constants.SOCKET_SEND_CARD]) {
            self.callbacks[Constants.SOCKET_SEND_CARD](data.card);
        }
        if (data && data.card) {
            self.socket.emit(Constants.SOCKET_SEND_CARD_CONFIRM);
        }
    });
    self.socket.on(Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE, () => {
        console.debug(`socket received \'${Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE}\' signal.`);
        if (self.callbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE]) {
            self.callbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE]();
        }
    });

    self.addCallback = (signalName, callback) => {
        if (!self.callbacks[signalName]) {
            self.callbacks[signalName] = callback;
        }
    };

    self.addSelfToGame = (code, name) => {
        return new Promise((resolve, reject) => {
            self.socket.emit(Constants.SOCKET_ADD_PLAYER, 
                {code: code, name: name}
            );
            self.socket.on(Constants.SOCKET_ADD_PLAYER_ERROR, (data) => {
                console.error(data);
                reject(data.error);
            });
            self.socket.on(Constants.SOCKET_CONFIRM_PLAYER_ADDED, () => {
                console.debug('Player added to game');
                resolve({id: self.id, name: name, socket: self.socket});
            });
        });
    };

    self.submitChoice = (name, cardId, round) => {
        console.debug(`Socket emitting ${Constants.SOCKET_SEND_ROUND_SUBMISSION} from ${name} about ${cardId} during round ${round}`);
        self.socket.emit(Constants.SOCKET_SEND_ROUND_SUBMISSION, {name: name, id: cardId, round: round});
    }

    self.confirmReadyToJudge = (name) => {
        console.debug(`Socket emitting ${Constants.SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE} with name: ${name}`);
        self.socket.emit(Constants.SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE, { name: name });
    }
}

export default SocketConnection;
