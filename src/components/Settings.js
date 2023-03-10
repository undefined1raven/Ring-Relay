import QRCode from 'qrcode'
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'

const Test = (props) => {
    const [data, setData] = useState('No result');

    return (
        <>
            <QrReader
                constraints={{ facingMode: 'environment' }}
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                style={{ width: '100%' }}
            />
            <Label text={data} id="results" color="#FFF"></Label>
        </>
    );
};

function Settings(props) {


    // QRCode.toCanvas(document.getElementById('pkShare'), splittedPKArr[0], { color: { dark: '#B479FF', light: '#090003' } }, (res) => { console.log(res) })
    // QRCode.toCanvas(document.getElementById('pkShare1'), splittedPKArr[0], { color: { dark: '#B479FF', light: '#090003' } }, (res) => { console.log(res) })
    // QRCode.toCanvas(document.getElementById('pkShare2'), splittedPKArr[0], { color: { dark: '#050045', light: '#7000FF' } }, (res) => { console.log(res) })

    return (
        <div>
            <div id='mainMenuContainer'>
                <Label show={props.user.username != 0} color="#9644FF" fontSize="2.1vh" bkg="#7000FF20" id="loggedInAsLabel" text={`${props.user.username}`}></Label>
                <Label show={props.user.ownUID != 0} color="#9644FF" fontSize="1.8vh" bkg="#7000FF00" id="loggedInAsQidLabel" text={`<${props.user.ownUID.toString().split('-')[4]}>`}></Label>
                <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="16.5625%"></HorizontalLine>
                <Label className="settingsMenuLabel" id="accountLabel" text="Account" fontSize="2.4vh" color="#FFF"></Label>
                <Button id="changeUsernameButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Change Username"></Button>
                <Button id="changePasswordButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Change Password"></Button>
                <Button id="deleteAccountButton" className="settingsMenuButton" fontSize="2.3vh" color="#FF002E" bkg="#FF002E" label="Delete Account"></Button>
                <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="51.25%"></HorizontalLine>
                <Label className="settingsMenuLabel" id="securityLabel" text="Security" fontSize="2.4vh" color="#FFF"></Label>
                <Button id="authDeviceButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Authenticate Another Device"></Button>
                <Button id="regenKeyPairButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Regenerate Key Pair"></Button>
                <Button id="logsButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Logs"></Button>
                <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="87.5%"></HorizontalLine>
            </div>
            {/* <canvas id="pkShare"></canvas> */}
            {/* {/* <canvas style={{top: '0%'}} id="pkShare1"></canvas> */}
            {/* <canvas style={{ top: '10%' }} id="pkShare2"></canvas> */}
            {/* <Test></Test> */}
        </div>
    )
}

export default Settings;