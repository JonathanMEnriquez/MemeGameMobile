import React, {useState} from 'react';
import '../css/InitialView.css';
import Header from '../reusable/Header';
import Message from '../reusable/Message';
import Constants from '../utils/Constants';
import Player from '../classes/Player';

const InitialView = (props) => {
    const { setGameMode, gameModes, socket, setSelf } = props;
    const [message, setMessage] = useState();
    const [messageHasError, setMessageHasError] = useState(false);
    const [signedUp, setSignedUp] = useState(false);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    const submit = async() => {
        setMessage();
        if (!code || !name) {
            return;
        }
        setMessage("Connecting...");
        try {
            const res = await socket.addSelfToGame(code, name);
            setSignedUp(true);
            setMessage('Connected. \nWaiting for other players.');
            setSelf(new Player(res.id, res.name));
        } catch(err) {
            setMessageHasError(true);
            setMessage(err);
        }
    }

    const nameChangeHandler = (name) => {
        if (name.length < 16) {
            setName(name);
        }
    }

    return (
        <div className="initial">
            <Header />
            <Message text={message} isError={messageHasError} />
            {!signedUp &&
            <div className="sign-up">
                <label htmlFor="code">Game Code</label>
                <input id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    name="code" />
                <label htmlFor="name">Name</label>
                <input id="name" 
                    value={name}
                    onChange={(e) => nameChangeHandler(e.target.value)}
                    name="name" />
                <button onClick={submit}>Join</button>
            </div>
            }
        </div>
    )
}

export default InitialView;