import React, {useState} from 'react';
import '../css/JudgeView.css';
import Gavel from '../img/conangavel.gif';
import Message from '../reusable/Message';

const JudgeView = (props) => {
    const { showButton, confirm } = props;
    const judgeModes = {
        initial: 'in',
        message: 'me',
        select: 'se',
    };
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState(judgeModes.initial);

    const generateContent = () => {
        switch(mode) {
            case judgeModes.initial:
                return (
                    <div className="judge-view">
                        <div className="main-message">
                            <span>You are the JUDGE this round</span>
                        </div>
                        <div className="judge-gif"
                            style={{backgroundImage: `url(${Gavel})`}} >
                        </div>
                        <div className="sub-message">
                            {!showButton &&
                                'You will be prompted to confirm that you\'re ready to be shown the submissions' + 
                                ' once everyone has submitted them'
                            }
                            {showButton &&
                                'Click below when you\'re ready to select the round winner'
                            }
                        </div>
                        <div className="button-div">
                            {showButton &&
                                <button onClick={clickHandler}>
                                    Ready to Bang the Gavel?
                                </button>
                            }
                        </div>
                    </div>
                )
            case judgeModes.me:
                return (
                    <div className="judge-view">
                        <Message text={message} />
                    </div>
                )
            case judgeModes.select:
                return (
                    <div>SELECT MODE</div>
                )
            default:
                return <div>should not happen</div>
        }
    }

    const clickHandler = () => {
        if (submitting) {
            return
        }

        setSubmitting(true);
        if (confirm) {
            confirm();
            setMessage('The submissions will be played on the main screen.');
            setMode(judgeModes.message);
            setTimeout(() => setMode(judgeModes.select), 5000);
        }
    }

    return generateContent();
}

export default JudgeView;