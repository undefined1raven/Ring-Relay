import Label from '../components/Label.js'
import Button from '../components/Button.js'
import { useState } from 'react';

let oneSig = window.OneSignal;

function NotificationsDialog(props) {

    const [notificationOptions, setNotificationOptions] = useState({ messages: true, contactReqests: false, security: false });

    const selectorColorController = (selectorKey) => {
        if (notificationOptions[selectorKey]) {
            return { color: '#6300E0', label: 'On' };
        } else {
            return { color: '#3F008E', label: 'Off' };
        }
    }


    const atLeastOneSelected = () => {
        return notificationOptions.contactReqests || notificationOptions.messages || notificationOptions.security;
    }

    const allow = () => {
        if (atLeastOneSelected()) {
            if (Notification.permission == 'default' || Notification.permission == 'denied') {
                Notification.requestPermission(resx => {
                    if (resx == 'granted') {
                        oneSig.registerForPushNotifications();
                    }
                })
            }
            props.onHide();
        }
    }

    const deny = () => {
        props.onHide();
    }

    if (props.show) {
        return (
            <div className="notificationsDialogContainer">
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '13.28125%', height: '7.65625%' }} fontSize="2vh" text="Allow push notifications for functionality purposes (message notifications)"></Label>
                <Label className="notificationsDialogLabel" bkg="#6300E020" color="#7100FF" style={{ top: '22.5%', height: '12.34375%' }} fontSize="2vh" text="Notifications can be used for other events such as new contact requests, and important security events such as exports/imports of your account’s private keys"></Label>
                <Button onClick={() => setNotificationOptions({ ...notificationOptions, messages: !notificationOptions.messages })} className="notificationsDialogButton" fontSize="2vh" color={selectorColorController('messages').color} style={{ top: '42.8125%' }} bkg={selectorColorController('messages').color} width="90%" height="6.25%" label="Message Notifications"></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={selectorColorController('messages').color} style={{ borderLeft: `solid 1px ${selectorColorController('messages').color}`, left: '83.611111111%', top: 'calc(42.8125% + 0.1%)', height: '6.24%' }} fontSize="2vh" text={selectorColorController('messages').label}></Label>

                <Button onClick={() => setNotificationOptions({ ...notificationOptions, contactReqests: !notificationOptions.contactReqests })} className="notificationsDialogButton" fontSize="2vh" color={selectorColorController('contactReqests').color} style={{ top: '50.625%' }} bkg={selectorColorController('contactReqests').color} width="90%" height="6.25%" label="New Contact Requests"></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={selectorColorController('contactReqests').color} style={{ borderLeft: `solid 1px ${selectorColorController('contactReqests').color}`, left: '83.611111111%', top: 'calc(50.625% + 0.1%)', height: '6.24%' }} fontSize="2vh" text={selectorColorController('contactReqests').label}></Label>

                <Button onClick={() => setNotificationOptions({ ...notificationOptions, security: !notificationOptions.security })} className="notificationsDialogButton" fontSize="2vh" color={selectorColorController('security').color} style={{ top: '58.4375%' }} bkg={selectorColorController('security').color} width="90%" height="6.25%" label="Security Notifications"></Button>
                <Label className="notificationsDialogButtonSelectedLabel" bkg="#6300E000" color={selectorColorController('security').color} style={{ borderLeft: `solid 1px ${selectorColorController('security').color}`, left: '83.611111111%', top: 'calc(58.4375% + 0.1%)', height: '6.24%' }} fontSize="2vh" text={selectorColorController('security').label}></Label>

                <Button onClick={allow} className="notificationsDialogFinalButton" fontSize="2vh" color={atLeastOneSelected() ? '#00FFD1' : '#929292'} style={{ top: '76.25%', backgroundColor: atLeastOneSelected() ? '#00FFD130' : '' }} width="90%" height="6.25%" label="Allow Selected"></Button>
                <Button onClick={deny} className="notificationsDialogFinalButton" fontSize="2vh" color="#FF002E" style={{ top: '86.09375%' }} bkg="#FF002E" width="90%" height="6.25%" label="Deny All"></Button>
            </div>
        )
    } else {
        return '';
    }
}

export default NotificationsDialog;