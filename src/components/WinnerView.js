import React from 'react';
import '../css/WinnerView.css';
import Message from '../reusable/Message';
import Button from '../reusable/Button';

const WinnerView = (props) => {
    const { winners, playerSelf, displayNewRoundButton, isJudge,
        startNextRound } = props;
    let judgeChoice,
        playersChoice;

    if (winners) {
        judgeChoice = winners.judgeChoice;
        playersChoice = winners.playersChoice;
    }

    const isJudgeChoice = judgeChoice === playerSelf.name;
    const isPeoplesChoice = playersChoice === playerSelf.name;

    const generateMessage = () => {
        if (!winners) {
            return 'Thanks for voting. Waiting for everyone\'s choices to be submitted.'
        } else {
            if (isJudge) {
                return 'You have rendered judgment. Awaiting next round\'s judge to start the ' +
                'next round.';
            } else if (isJudgeChoice && isPeoplesChoice) {
                return 'Wow! You were both voted the player\'s favorite and' + 
                'selected by the judge! You earned 3 points!';
            } else if (isJudgeChoice) {
                return 'Congrats! You were selected by the Judge as the winner of this round. ' +
                'You earned 2 points!';
            } else if (isPeoplesChoice) {
                return 'Congrats! You were selected by the other player\'s as their favorite. ' +
                'You earned 1 point this round!';
            } else {
                return 'Oof. Better luck next time.';
            }
        }
    };

    return (
        <div className="winner-view">
            <Message text={generateMessage()} />
            {displayNewRoundButton &&
                <div className="button-div">
                    <Button text="Start Next Round!"
                        clickHandler={startNextRound} />
                </div>
            }
        </div>
    )
}

export default WinnerView;