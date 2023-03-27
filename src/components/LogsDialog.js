import Label from '../components/Label.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react';
import DomainGetter from '../fn/DomainGetter.js';
import axios from 'axios';


function NotificationsDialog(props) {
    const [checking, setChecking] = useState(false);
    const [logsOptions, setLogsOptions] = useState({ account: true, security: false });

    const selectorColorController = (selectorKey) => {
        if (logsOptions[selectorKey]) {
            return { color: '#6300E0', label: 'On' };
        } else {
            return { color: '#3F008E', label: 'Off' };
        }
    }


    useEffect(() => {
        setChecking(true);
        axios.post(`${DomainGetter('prodx')}api/dbop?getLogsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(resx => {
            if (resx.data.logsConfig && resx.data.error == undefined) {
                const config = JSON.parse(resx.data.logsConfig);
                setLogsOptions({ ...config });
                setChecking(false);
            }
        }).catch(e => { });
    }, [])

    const atLeastOneSelected = () => {
        return logsOptions.account || logsOptions.security;
    }


    const onGranted = () => {
        let newPrefs = JSON.stringify({ ...logsOptions, ini: true });
        axios.post(`${DomainGetter('prodx')}api/dbop?updateLogsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), newPrefs: newPrefs });
        sessionStorage.removeItem('showLogsConfig')
        props.onHide();
    }

    const allow = () => {
        if (atLeastOneSelected()) {
            onGranted();
        }
        sessionStorage.removeItem('showLogsConfig')
        props.onHide();
    }

    const deny = () => {
        let allDeny = JSON.stringify({ ini: true, account: false, security: false });
        axios.post(`${DomainGetter('prodx')}api/dbop?updateLogsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), newPrefs: allDeny });
        props.onHide();
    }

    if (props.show) {
        return (
            <div className="notificationsDialogContainer">
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '12.96875%', height: '6.125%' }} fontSize="2vh" text="Allow the collection of logs for activity review"></Label>
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '20.35%', height: '12.34375%' }} fontSize="2vh" text="Logs help you identify any suspicious activities such as sessions on devices you do not recognize and more"></Label>
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '33.90625%', height: '6.125%' }} fontSize="2vh" text="You can delete those or change the settings later at any time"></Label>
                <Button onClick={() => setLogsOptions({ ...logsOptions, account: !logsOptions.account })} className="notificationsDialogButton" fontSize="2vh" color={checking ? "#001AFF" : selectorColorController('account').color} style={{ top: '49.53125%' }} bkg={checking ? "#001AFF" : selectorColorController('account').color} width="90%" height="6.25%" label={checking ? "[Checking]" : "Account Logs"}></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={checking ? "#001AFF" : selectorColorController('account').color} style={{ borderLeft: `solid 1px ${checking ? "#001AFF" : selectorColorController('account').color}`, left: '83.611111111%', top: 'calc(49.53125% + 0.1%)', height: '6.09%' }} fontSize="2vh" text={checking ? "▣" : selectorColorController('account').label}></Label>

                <Button onClick={() => setLogsOptions({ ...logsOptions, security: !logsOptions.security })} className="notificationsDialogButton" fontSize="2vh" color={checking ? "#001AFF" : selectorColorController('security').color} style={{ top: '57.34375%' }} bkg={checking ? "#001AFF" : selectorColorController('security').color} width="90%" height="6.25%" label={checking ? "[Checking]" : "Security Logs"}></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={checking ? "#001AFF" : selectorColorController('security').color} style={{ borderLeft: `solid 1px ${checking ? "#001AFF" : selectorColorController('security').color}`, left: '83.611111111%', top: 'calc(57.34375% + 0.1%)', height: '6.09%' }} fontSize="2vh" text={checking ? "▣" : selectorColorController('security').label}></Label>

                <Button onClick={allow} className="notificationsDialogFinalButton" fontSize="2vh" color={atLeastOneSelected() ? '#00FFD1' : '#929292'} style={{ top: '76.25%', backgroundColor: atLeastOneSelected() ? '#00FFD130' : '' }} width="90%" height="6.25%" label="Allow Selected"></Button>
                <Button onClick={deny} className="notificationsDialogFinalButton" fontSize="2vh" color="#FF002E" style={{ top: '86.09375%' }} bkg="#FF002E" width="90%" height="6.25%" label="Deny All"></Button>
            </div>
        )
    } else {
        return '';
    }
}

export default NotificationsDialog;