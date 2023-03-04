
import { Link } from 'react-router-dom'
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react'
import axios from 'axios';

function NavBar(props) {
    const [systemStatus, setSystemStatus] = useState({ text: '[Checking]', color: '#001AFF', last: 0 });

    function checkSys() {
        axios.get('https://ring-relay-api-prod.vercel.app/api/auth?val=0', { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
            setSystemStatus({ text: 'Systems Nominal', color: '#00FF85', last: Date.now() });
        }).catch(e => {
            setSystemStatus({ text: 'System Error', color: '#FF002E', last: Date.now() });
        });
    }

    useEffect(() => {
        checkSys()
        setInterval(() => {
            checkSys()
        }, 300000);
    }, []);

    function navButtonBkgController(btnId) {
        if (btnId == props.wid) {
            return '#A055FF';
        } else {
            return '#6800EC';
        }
    }



    return (
        <div className="navBarContainer">
            <MinLogo id="navLogo"></MinLogo>
            <Button onClick={() => props.onNavButtonClick('chats')} id="chatsNavButton" fontSize="2.12vh" className="navButton" color={navButtonBkgController('chats')} width="20.555555556%" height="100%" label="Chats"></Button>
            <Button onClick={() => props.onNavButtonClick('newContact')} id="newContactNavButton" fontSize="2.12vh" className="navButton" color={navButtonBkgController('newContact')} width="20.555555556%" height="100%" label="New Contact"></Button>
            <Button onClick={() => props.onNavButtonClick('settings')} id="settingsNavButton" fontSize="2.12vh" className="navButton" color={navButtonBkgController('settings')} width="20.555555556%" height="100%" label="Settings"></Button>
            <Label id="sysStatusLabel" text={systemStatus.text} fontSize="1.6vh" color={systemStatus.color} bkg={`${systemStatus.color}20`} style={{ borderLeft: `solid 1px ${systemStatus.color}` }}></Label>
        </div>
    )
}

export default NavBar;