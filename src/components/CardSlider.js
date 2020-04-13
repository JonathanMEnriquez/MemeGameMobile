import React, {useState} from 'react';
import Back from '../img/back.png';
import Next from '../img/next.png';
import '../css/CardSlider.css';

const CardSlider = (props) => {
    const { hand, selectCard } = props;
    const [idx, setIdx] = useState(0);
    const [card, setCard] = useState(hand && hand.length && hand[0]);
    
    const nextCard = () => {
        let index = ((idx + 1) >= hand.length 
                    ? 0
                    : idx + 1);
        setIdx(index);
        setCard(hand[index]);
    }

    const prevCard = () => {
        let index = (idx === 0 ? hand.length - 1 : idx - 1);
        setIdx(index);
        setCard(hand[index]);
    }

    const clickHandler = () => {
        selectCard(card);
    }

    return (
        <div className="card-slider">
            <div className="back-section"
                onClick={prevCard}>
                <img src={Back}
                    alt="<" />
            </div>
            <div className="selected-card"
                style={{backgroundImage: `url(${card.data})`}}
                onClick={clickHandler} >
            </div>
            <div className="next-section"
                onClick={nextCard}>
                <img src={Next}
                    alt=">" />
            </div>
        </div>
    )
}

export default CardSlider;