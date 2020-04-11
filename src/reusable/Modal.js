import React from 'react';
import '../css/Modal.css';

const Modal = (props) => {
    const { content, close } = props;

    return (
        <div className="modal"
            onClick={close}>
            <div className="modal-content">
                {content}
            </div>
        </div>
    )
}

export default Modal;