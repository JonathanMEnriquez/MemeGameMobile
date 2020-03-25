import React, {useState} from 'react';
import '../css/InitialView.css';
import Header from '../reusable/Header';
import Message from '../reusable/Message';

const InitialView = (props) => {
    const { setGameMode, gameModes } = props;
    const [message, setMessage] = useState();
    const [messageHasError, setMessageHasError] = useState(false);

    const submit = () => {
        setMessage();
        console.log('submit!');
        setMessage("Connecting...");
    }

    return (
        <div className="initial">
            <Header />
            <Message text={message} isError={messageHasError} />
            <div className="sign-up">
                <label for="code">Game Code</label>
                <input id="code" name="code" />
                <label for="name">Name</label>
                <input id="name" name="name" />
                <button onClick={submit}>Join</button>
            </div>
        </div>
    )
}

export default InitialView;