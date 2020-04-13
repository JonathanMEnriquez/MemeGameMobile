import React, {useState} from 'react';
import '../css/JudgeView.css';
import Gavel from '../img/conangavel.gif';

const JudgeView = (props) => {
    const { showButton, confirm } = props;
    const [submitting, setSubmitting] = useState(false);

    const clickHandler = () => {
        if (submitting) {
            return
        }

        setSubmitting(true);
        if (confirm) {
            confirm();
        }
    }

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
                        Ready to Bang the Gavel!
                    </button>
                }
            </div>
        </div>
    )
}

export default JudgeView;