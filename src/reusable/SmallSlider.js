import React, {useState} from 'react';
import '../css/SmallSlider.css';
import Next from '../img/next.png';

const SmallSlider = (props) => {
    const { hand, selectCard } = props;
    const [inView, setInView] = useState([]);

    if (!inView.length) {
        const forView = [];
        hand.forEach((card, idx) => {
            card.originalIdx = idx;
            if (forView.length < 3) {
                forView.push(card);
            }
        });
        setInView(forView);
    }

    const setCardView = () => {
        const currView = inView.map(el => el.originalIdx);
        const highestIdx = Math.max(...currView);
        const forView = [];
        let i = highestIdx + 1;

        while (forView.length < 3) {
            if (i === hand.length) {
                i = 0;
            }
            if (!currView.includes(i)) {
                forView.push(hand[i]);
            }
            i += 1;
        }

        setInView(forView);
    };

    const clickHandler = (card) => {
        selectCard(hand.find(c => c.id === card.id));
    };

    return (
        <div className="small-slider">
            {inView.map((card, key) => {
                return (
                    <div className="single-card"
                        key={key}
                        style={{backgroundImage: `url(${card.data})`}}
                        onClick={() => clickHandler(card)} >
                    </div>
                )
            })}
            <div className="next-section"
                onClick={setCardView}>
                <img src={Next}
                    alt=">" />
            </div>
        </div>
    )
}

export default SmallSlider;