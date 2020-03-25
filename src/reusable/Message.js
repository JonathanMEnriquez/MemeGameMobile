import React from 'react';

const Message = (props) => {
    const { text, isError } = props;

    return (
        <p className="message"
            style={isError ? {color: "red"} : {}} >
            {text}
        </p>
    )
}

export default Message;