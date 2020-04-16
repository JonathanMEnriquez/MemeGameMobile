import React, {useState} from 'react';
import '../css/Select.css';

const Select = (props) => {
    const { isJudge, choices, playerSelf } = props;
    const [selected, setSelected] = useState();
    // removes self from choices
    const cleansedChoices = isJudge ? choices 
        : choices.filter(c => c.name !== playerSelf.name );
    const message = isJudge ? 'Who is winning this round, Judge?' : 'Which was your favorite?';

    const submitChoice = (target) => {
        console.log('submitting choice: ', selected);
    };

    const changeHandler = (e) => {
        setSelected(e.target.value);
    };

    return (
        <div className="select">
            <div className="select-header">
                {message}
            </div>
            <div className="choices">
                {cleansedChoices.map((choice, key) => {
                    return (
                        <div className="radio" key={key}>
                            <input type="radio"
                                    name="round-winner"
                                    value={choice.number}
                                    checked={selected === choice.number}
                                    onChange={changeHandler}
                                    id={`CHOICE-${choice.number}`} />
                            <label htmlFor={`CHOICE-${choice.number}`} >{`Option ${choice.number}`}</label>
                        </div>
                    )
                })}
            </div>
            <div className="submit-div">
                <button onClick={submitChoice}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Select;