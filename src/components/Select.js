import React, {useState} from 'react';
import '../css/Select.css';

const Select = (props) => {
    const { isJudge, choices, playerSelf, submitRoundSelection, switchToWinnerMode } = props;
    const [selected, setSelected] = useState(null);
    // removes self from choices
    const cleansedChoices = isJudge ? choices 
        : choices.filter(c => c.name !== playerSelf.name );
    const message = isJudge ? 
        'Who is winning this round, Judge?' 
        : 'Which was your favorite?';

    const submitChoice = () => {
        if (selected !== null) {
            console.debug('Submitting choice: ', selected, submitRoundSelection);
            submitRoundSelection(selected);
            switchToWinnerMode();
            setSelected(null);
        }
    };

    const changeHandler = (choice) => {
        setSelected(choice);
    };

    return (
        <div className="select">
            <div className="select-header">
                {message}
            </div>
            <div className="choices">
                {cleansedChoices.map((choice, key) => {
                    return (
                        <div key={key}
                            onClick={() => changeHandler(choice.number)}
                            className={selected === choice.number ? 'selected option' : 'option'} >
                            {selected === choice.number ? `Selected #${choice.number}` : `Option #${choice.number}`}
                        </div>
                    )
                })}
            </div>
            <div className="submit-div">
                <button className={selected !== null ? '' : 'hidden'}
                    onClick={submitChoice}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Select;