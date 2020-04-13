import React, {useState} from 'react';
import '../css/PlayerView.css';
import CardSlider from './CardSlider';
import Modal from '../reusable/Modal';
import SmallSlider from '../reusable/SmallSlider';
import Message from '../reusable/Message';

const PlayerView = (props) => {
    const { hand, playerSelf, round, socket, removeCardFromHand } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState('');

    const submitChoice = (card) => {
        socket.submitChoice(playerSelf.name, card.id, round);
        removeCardFromHand(card.id);
        setMessage('Submitted your answer. Waiting for other players to make their choices. Good luck!');
        setSubmitted(true);
    }

    const confirmModalContent = () => {
        return (
            <div className="modal-content-info">
                <p>You'd like to submit 
                    <span>{selectedCard && selectedCard.alt}</span>
                    this round?</p>
                <div>
                    <button onClick={() => submitChoice(selectedCard)}>
                        Yes
                    </button>
                    <button onClick={() => setModalVisible(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    };

    const selectCard = (card) => {
        setSelectedCard(card);
        setModalVisible(true);
    }

    return (
        <div className="player-view-content">
            {!submitted &&
                <div className="player-view">
                    <div className="player-header">
                        <span>{playerSelf.name}</span>
                        <span>Points: {playerSelf.points}</span>
                        <span>Round: {round}</span>
                    </div>
                    <div className="main-slider-area">
                        <CardSlider hand={hand} 
                            selectCard={selectCard} />
                    </div>
                    <div className="small-slider-area">
                        <SmallSlider hand={hand}
                            selectCard={selectCard} />
                    </div>
                    {modalVisible &&
                        <Modal content={confirmModalContent()}
                            close={() => setModalVisible(false)} />
                    }
                </div>
            }
            {submitted &&
                <Message text={message} isError={false} />
            }
        </div>
    )
}

export default PlayerView;