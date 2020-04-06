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
        self.socket.emit(Constants.SOCKET_SEND_HAND_CONFIRM);
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
                console.log('added to game!');
                resolve({id: self.id, name: name, socket: self.socket});
            });
        });
    };
}

export default SocketConnection;
