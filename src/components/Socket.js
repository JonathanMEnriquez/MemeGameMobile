import Constants from '../utils/Constants';
import OpenSocket from 'socket.io-client';
// const OpenSocket = window.require('socket.io-client');

// class SocketMethods {
//     constructor(socket) {
//         this.socket = socket;
//     }

//     addSelfToGame(code, name, id) {
//         return new Promise((resolve, reject) => {
//             this.socket.emit(Constants.SOCKET_ADD_PLAYER, 
//                 {code: code, name: name}
//             );
//             this.socket.on(Constants.SOCKET_ADD_PLAYER_ERROR, (data) => {
//                 console.error(data);
//                 reject(data.error);
//             });
//             this.socket.on(Constants.SOCKET_CONFIRM_PLAYER_ADDED, () => {
//                 console.debug('Player added to game ', this);
//                 resolve({id: id, name: name, socket: this.socket});
//             });
//         });
//     };

//     submitRoundSelection = (choice, isJudge, name, round) => {
//         console.debug(`Socket emitting ${Constants.SOCKET_SEND_ROUND_SELECTION} from ${name} selecting option-${choice} during round ${round}`);
//         this.socket.emit(Constants.SOCKET_SEND_ROUND_SELECTION, {isJudge: isJudge, name: name, choice: choice, round: round});
//     }

//     submitChoice(name, cardId, round) {
//         console.debug(`Socket emitting ${Constants.SOCKET_SEND_ROUND_SUBMISSION} from ${name} about ${cardId} during round ${round}`);
//         this.socket.emit(Constants.SOCKET_SEND_ROUND_SUBMISSION, {name: name, id: cardId, round: round});
//     }

//     confirmReadyToJudge(name) {
//         console.debug(`Socket emitting ${Constants.SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE} with name: ${name}`);
//         this.socket.emit(Constants.SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE, { name: name });
//     }

//     startNextRoundSignal(name) {
//         console.debug(`Socket emitting ${Constants.SOCKET_RECEIVED_JUDGE_NEW_ROUND_START} with name ${name}`);
//         this.socket.emit(Constants.SOCKET_RECEIVED_JUDGE_NEW_ROUND_START, { name: name });
//     }
// }

function SocketConnection(socket, methods) {
    let self = this;
    self.id = '';
    self.callbacks = methods;
    self.socket = socket;

    self.socket.emit(Constants.SOCKET_NEW_CONNECTION);
    self.socket.on(Constants.SOCKET_SEND_ID, function(data) {
        console.debug('SOCKET_SEND_ID ', data, self.callbacks);
        self.id = data.id;
        self.callbacks[Constants.SOCKET_SEND_ID]();
    });
    self.socket.on(Constants.SOCKET_SEND_HAND, (data) => {
        console.debug(`Socket received ${Constants.SOCKET_SEND_HAND} with `, data.hand);
        if (self.callbacks[Constants.SOCKET_SEND_HAND]) {
            self.callbacks[Constants.SOCKET_SEND_HAND](data.hand);
        }
        self.socket.emit(Constants.SOCKET_SEND_HAND_CONFIRM);
    });
    self.socket.on(Constants.SOCKET_START_ROUND_AS_JUDGE, (data) => {
        if (self.callbacks[Constants.SOCKET_START_ROUND_AS_JUDGE]) {
            self.callbacks[Constants.SOCKET_START_ROUND_AS_JUDGE](data.round);
        }
    });
    self.socket.on(Constants.SOCKET_START_ROUND_AS_PLAYER, (data) => {
        if (self.callbacks[Constants.SOCKET_START_ROUND_AS_PLAYER]) {
            self.callbacks[Constants.SOCKET_START_ROUND_AS_PLAYER](data.round);
        }
    });
    self.socket.on(Constants.SOCKET_SEND_CARD, (data) => {
        if (self.callbacks[Constants.SOCKET_SEND_CARD]) {
            self.callbacks[Constants.SOCKET_SEND_CARD](data.card);
        }
        if (data && data.card) {
            self.socket.emit(Constants.SOCKET_SEND_CARD_CONFIRM);
        }
    });
    self.socket.on(Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE, () => {
        console.debug(`Socket received ${Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE} signal.`);
        if (self.callbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE]) {
            self.callbacks[Constants.SOCKET_SEND_JUDGE_CAN_CONTINUE]();
        }
    });
    self.socket.on(Constants.SOCKET_SEND_OPTIONS_TO_PLAYERS, data => {
        console.debug(`Socket received ${Constants.SOCKET_SEND_OPTIONS_TO_PLAYERS} signal. `, data);
        if (self.callbacks[Constants.SOCKET_SEND_OPTIONS_TO_PLAYERS]) {
            self.callbacks[Constants.SOCKET_SEND_OPTIONS_TO_PLAYERS](data.choices);
        }
    });
    self.socket.on(Constants.SOCKET_SEND_WINNER_INFO, data => {
        console.debug(`Socket received ${Constants.SOCKET_SEND_WINNER_INFO} signal. `, data);
        if (self.callbacks[Constants.SOCKET_SEND_WINNER_INFO]) {
            self.callbacks[Constants.SOCKET_SEND_WINNER_INFO](data);
        }
    });
    self.socket.on(Constants.SOCKET_SEND_START_ROUND_OPTION, () => {
        console.debug(`Socket received ${Constants.SOCKET_SEND_START_ROUND_OPTION} signal.`);
        if (self.callbacks[Constants.SOCKET_SEND_START_ROUND_OPTION]) {
            self.callbacks[Constants.SOCKET_SEND_START_ROUND_OPTION]();
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

    self.submitRoundSelection = (choice, isJudge, name, round) => {
        console.debug(`Socket emitting ${Constants.SOCKET_SEND_ROUND_SELECTION} from ${name} selecting option-${choice} during round ${round}`);
        self.socket.emit(Constants.SOCKET_SEND_ROUND_SELECTION, {isJudge: isJudge, name: name, choice: choice, round: round});
    }

    self.submitChoice = (name, cardId, round) => {
        console.debug(`Socket emitting ${Constants.SOCKET_SEND_ROUND_SUBMISSION} from ${name} about ${cardId} during round ${round}`);
        self.socket.emit(Constants.SOCKET_SEND_ROUND_SUBMISSION, {name: name, id: cardId, round: round});
    }

    self.confirmReadyToJudge = (name) => {
        console.debug(`Socket emitting ${Constants.SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE} with name: ${name}`);
        self.socket.emit(Constants.SOCKET_RECEIVE_JUDGE_PERMISSION_TO_CONTINUE, { name: name });
    }

    self.startNextRoundSignal = (name) => {
        console.debug(`Socket emitting ${Constants.SOCKET_RECEIVED_JUDGE_NEW_ROUND_START} with name ${name}`);
        self.socket.emit(Constants.SOCKET_RECEIVED_JUDGE_NEW_ROUND_START, { name: name });
    }
}

export default SocketConnection;