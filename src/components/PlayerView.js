import React, {useState} from 'react';
import '../css/PlayerView.css';
import CardSlider from './CardSlider';
import Modal from '../reusable/Modal';

const PlayerView = (props) => {
    const { hand, playerSelf, round } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState();

    const confirmModalContent = () => {
        return (
            <div className="modal-content-info">
                <p>You'd like to submit 
                    <span>{selectedCard && selectedCard.alt}</span>
                    this round?</p>
                <div>
                    <button onClick={() => console.log('wooo')}>
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
        console.log('hola card ', card);
        setSelectedCard(card);
        setModalVisible(true);
    }

    return (
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
            {modalVisible &&
                <Modal content={confirmModalContent()}
                    close={() => setModalVisible(false)} />
            }
        </div>
    )
}

export default PlayerView;