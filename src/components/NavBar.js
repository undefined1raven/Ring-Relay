
import { Link } from 'react-router-dom'
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react'
import DomainGetter from '../fn/DomainGetter.js'
import axios from 'axios';

function NavBar(props) {
    const [systemStatus, setSystemStatus] = useState({ text: '[Checking]', color: '#001AFF', last: 0 });


    function checkSys() {
        setSystemStatus({ text: `▣`, color: '#001AFF', last: Date.now() });
        axios.get(`${DomainGetter('prodx')}api/auth?val=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
            setSystemStatus({ text: `Systems Nominal ${window.Notification ? '_' : 'Γ'}`, color: '#00FF85', last: Date.now() });
        }).catch(e => {
            setSystemStatus({ text: `System Error ${window.Notification ? '_' : 'Γ'}`, color: '#FF002E', last: Date.now() });
        });
    }

    useEffect(() => {
        checkSys()
        let interval = setInterval(() => {
            checkSys()
        }, 15000);
        return () => clearInterval(interval)
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
            <MinLogo onClick={() => props.onNavButtonClick('chats')} id="navLogo"></MinLogo>
            <Button onClick={() => props.onNavButtonClick('chats')} id="chatsNavButton" fontSize="2.12vh" className="navButton" color={navButtonBkgController('chats')} width="20.555555556%" height="100%" label="Home"></Button>
            <Button onClick={() => props.onNavButtonClick('newContact')} id="newContactNavButton" fontSize="2.12vh" className="navButton" color={navButtonBkgController('newContact')} width="20.555555556%" height="100%" label="New Contact"></Button>
            <Button onClick={() => props.onNavButtonClick('settings')} id="settingsNavButton" fontSize="2.12vh" className="navButton" color={navButtonBkgController('settings')} width="20.555555556%" height="100%" label="Settings"></Button>
            <Label id="sysStatusLabel" text={systemStatus.text} fontSize="1.6vh" color={systemStatus.color} bkg={`${systemStatus.color}20`} style={{ borderLeft: `solid 1px ${systemStatus.color}` }}></Label>
        </div>
    )
}

export default NavBar;