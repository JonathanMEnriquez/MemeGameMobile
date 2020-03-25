import React, {useState} from 'react';
import InitialView from './InitialView';

const GameSwitch = (props) => {
    const gameModes = {
        initial: 'in',
        judge: 'ju',
        gamer: 'ga'
    }
    const [mode, setMode] = useState(gameModes.initial);

    const renderContent = () => {
        switch(mode) {
            case gameModes.initial:
                return <InitialView setGameMode={setMode} gameModes={gameModes} />
            default:
                return <div></div>
        }
    }

    return renderContent();
}

export default GameSwitch;