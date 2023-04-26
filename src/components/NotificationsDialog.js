import Label from '../components/Label.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react';
import DomainGetter from '../fn/DomainGetter.js';
import axios from 'axios';

let oneSig = window.OneSignal;

function NotificationsDialog(props) {
    const [checking, setChecking] = useState(false);
    const [notificationOptions, setNotificationOptions] = useState({ messages: true, newContacts: false, security: false });

    const selectorColorController = (selectorKey) => {
        if (notificationOptions[selectorKey]) {
            return { color: '#6300E0', label: 'On' };
        } else {
            return { color: '#3F008E', label: 'Off' };
        }
    }


    useEffect(() => {
        setChecking(true);
        axios.post(`${DomainGetter('prodx')}api/dbop?getNotificationsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(resx => {
            if (resx.data.notificationsConfig && resx.data.error == undefined) {
                const config = JSON.parse(resx.data.notificationsConfig);
                setNotificationOptions({ ...config });
                setChecking(false);
            }
        }).catch(e => {});
    }, [])

    const atLeastOneSelected = () => {
        return notificationOptions.newContacts || notificationOptions.messages || notificationOptions.security;
    }


    const onGranted = () => {
        oneSig.registerForPushNotifications();
        let newPrefs = JSON.stringify(notificationOptions)
        axios.post(`${DomainGetter('prodx')}api/dbop?updateNotificationsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), newPrefs: newPrefs });

    }

    const allow = () => {
        if (atLeastOneSelected()) {
            if (window.Notification.permission == 'default' || window.Notification.permission == 'denied') {
                window.Notification.requestPermission(resx => {
                    if (resx == 'granted') {
                        onGranted();
                    }
                })
            }
            if (window.Notification.permission == 'granted') {
                onGranted();
            }
            props.onHide();
        }
    }

    const deny = () => {
        let allDeny = JSON.stringify({ messages: false, newContacts: false, security: false });
        axios.post(`${DomainGetter('prodx')}api/dbop?updateNotificationsConfig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), newPrefs: allDeny });
        props.onHide();
    }

    if (props.show) {
        return (
            <div className="notificationsDialogContainer">
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '13.28125%', height: '7.65625%' }} fontSize="2vh" text="Allow push notifications for functionality purposes (message notifications)"></Label>
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '22.5%', height: '12.34375%' }} fontSize="2vh" text="Notifications can be used for other events such as new contact requests, and important security events such as exports/imports of your account’s private keys"></Label>
                <Button onClick={() => setNotificationOptions({ ...notificationOptions, messages: !notificationOptions.messages })} className="notificationsDialogButton" fontSize="2vh" color={checking ? "#001AFF" : selectorColorController('messages').color} style={{ top: '42.8125%' }} bkg={checking ? "#001AFF" : selectorColorController('messages').color} width="90%" height="6.25%" label={checking ? "[Checking]" : "Message Notifications"}></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={checking ? "#001AFF" : selectorColorController('messages').color} style={{ borderLeft: `solid 1px ${checking ? "#001AFF" : selectorColorController('messages').color}`, left: '83.611111111%', top: 'calc(42.8125% + 0.1%)', height: '6.09%' }} fontSize="2vh" text={checking ? "▣" : selectorColorController('messages').label}></Label>

                <Button onClick={() => setNotificationOptions({ ...notificationOptions, newContacts: !notificationOptions.newContacts })} className="notificationsDialogButton" fontSize="2vh" color={checking ? "#001AFF" : selectorColorController('newContacts').color} style={{ top: '50.625%' }} bkg={checking ? "#001AFF" : selectorColorController('newContacts').color} width="90%" height="6.25%" label={checking ? "[Checking]" : "New Contact Requests"}></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={checking ? "#001AFF" : selectorColorController('newContacts').color} style={{ borderLeft: `solid 1px ${checking ? "#001AFF" : selectorColorController('newContacts').color}`, left: '83.611111111%', top: 'calc(50.625% + 0.1%)', height: '6.09%' }} fontSize="2vh" text={checking ? "▣" : selectorColorController('newContacts').label}></Label>

                <Button onClick={() => setNotificationOptions({ ...notificationOptions, security: !notificationOptions.security })} className="notificationsDialogButton" fontSize="2vh" color={checking ? "#001AFF" : selectorColorController('security').color} style={{ top: '58.4375%' }} bkg={checking ? "#001AFF" : selectorColorController('security').color} width="90%" height="6.25%" label={checking ? "[Checking]" : "Security Notifications"}></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={checking ? "#001AFF" : selectorColorController('security').color} style={{ borderLeft: `solid 1px ${checking ? "#001AFF" : selectorColorController('security').color}`, left: '83.611111111%', top: 'calc(58.4375% + 0.1%)', height: '6.09%' }} fontSize="2vh" text={checking ? "▣" : selectorColorController('security').label}></Label>

                <Button onClick={allow} className="notificationsDialogFinalButton" fontSize="2vh" color={atLeastOneSelected() ? '#00FFD1' : '#929292'} style={{ top: '76.25%', backgroundColor: atLeastOneSelected() ? '#00FFD130' : '' }} width="90%" height="6.25%" label="Allow Selected"></Button>
                <Button onClick={deny} className="notificationsDialogFinalButton" fontSize="2vh" color="#FF002E" style={{ top: '86.09375%' }} bkg="#FF002E" width="90%" height="6.25%" label="Deny All"></Button>
            </div>
        )
    } else {
        return '';
    }
}

export default NotificationsDialog;