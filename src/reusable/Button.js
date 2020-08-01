import React from 'react';
import '../css/Button.css';

const Button = (props) => {
    const { text, clickHandler } = props;

    return (
        <button className="main-button"
            onClick={clickHandler} >
                {text}
        </button>
    )
}

export default Button;