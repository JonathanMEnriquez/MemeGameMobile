import React from 'react';
import '../css/Header.css';
import Logo from '../img/whatdoyoumemelogo.png';

const Header = (props) => {

    return (
        <header>
            <img src={Logo} alt="What do you Meme?" />
        </header>
    )
}

export default Header;