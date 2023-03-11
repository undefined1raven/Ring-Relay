import QRCode from 'qrcode'
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'
import AuthDeviceImportDeco from '../components/authDeviceImportDeco.js'
import AuthDeviceExportDeco from '../components/authDeviceExportDeco.js'
import AuthDeviceScanDeco from '../components/authDeviceScanDeco.js'
import AuthDeviceDownloadDeco from '../components/authDeviceDownloadDeco.js'
import { symmetricDecrypt, symmetricEncrypt } from '../fn/crypto.js';
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
    const [activeWindowId, setActiveWindowId] = useState('home')
    const [windowHash, setWindowHash] = useState('/');
    const [scanExportStage, setScanExportStage] = useState(0);

    let pkPem = localStorage.getItem(localStorage.getItem('PKGetter'))




    let salt = window.crypto.getRandomValues(new Uint8Array(16))
    let iv = window.crypto.getRandomValues(new Uint8Array(12))


    useEffect(() => {
        symmetricEncrypt(salt, iv, pkPem, 'nicer').then(cipher => {
            symmetricDecrypt('nicer', salt, iv, cipher.buffer).then(plain => { })
            let pk0 = ''
            let pk1 = ''
            let pk2 = ''
            let pk3 = ''
            let pk4 = ''
            for (let ix = 0; ix < cipher.base64.length; ix++) {
                let rd = cipher.base64.length / 5;
                if (pk0.length <= rd) {
                    pk0 += cipher.base64[ix];
                } else if (pk1.length <= rd) {
                    pk1 += cipher.base64[ix];
                } else if (pk2.length <= rd) {
                    pk2 += cipher.base64[ix];
                } else if (pk3.length <= rd) {
                    pk3 += cipher.base64[ix];
                } else if (pk4.length <= rd) {
                    pk4 += cipher.base64[ix];
                }
            }
            let splittedPKArr = [pk0, pk1, pk2, pk3, pk4];
            QRCode.toCanvas(document.getElementById('pkShare'), splittedPKArr[0], { color: { dark: '#090003', light: '#B479FF' } }, (res) => { console.log(res) })
        })
    }, [activeWindowId])

    useEffect(() => {
        window.location.hash = windowHash;
    }, [windowHash]);

    const onDeviceAuth = () => {
        setActiveWindowId('authDevice0')
    }
    const logout = () => {
        localStorage.removeItem('AT');
        localStorage.removeItem('CIP');
        setWindowHash('#/login');
    }
    return (
        <div>
            <Label show={props.user.username != 0} color="#9644FF" fontSize="2.1vh" bkg="#7000FF20" id="loggedInAsLabel" text={`${props.user.username}`}></Label>
            <Label show={props.user.ownUID != 0} color="#9644FF" fontSize="1.8vh" bkg="#7000FF00" id="loggedInAsQidLabel" text={`<${props.user.ownUID.toString().split('-')[4]}>`}></Label>
            <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="16.5625%"></HorizontalLine>
            {activeWindowId == 'home' ?
                <div id='mainMenuContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Account" fontSize="2.4vh" color="#FFF"></Label>
                    <Button onClick={logout} id="logoutBtn" width="90%" fontSize="2.3vh" height="6.46875%" color="#878787" bkg="#410093" label="Log Out"></Button>
                    <Button id="changeUsernameButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Change Username"></Button>
                    <Button id="changePasswordButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Change Password"></Button>
                    <Button id="deleteAccountButton" className="settingsMenuButton" fontSize="2.3vh" color="#FF002E" bkg="#FF002E" label="Delete Account"></Button>
                    <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="51.25%"></HorizontalLine>
                    <Label className="settingsMenuLabel" id="securityLabel" text="Security" fontSize="2.4vh" color="#FFF"></Label>
                    <Button onClick={onDeviceAuth} id="authDeviceButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Authenticate Another Device"></Button>
                    <Button id="regenKeyPairButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Regenerate Key Pair"></Button>
                    <Button id="logsButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Logs"></Button>
                    <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="87.5%"></HorizontalLine>
                </div>
                : ''}
            {activeWindowId == 'authDevice0' ?
                <div id='authAnotherDeviceContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Authenticate Another Device" fontSize="2.4vh" color="#FFF"></Label>
                    <div id='importIDButton' className='mainButton'>
                        <Label className="mainButtonLabel" text="Import Identity" color="#D9D9D9"></Label>
                        <AuthDeviceImportDeco className="mainButtonDeco"></AuthDeviceImportDeco>
                    </div>
                    <div onClick={() => setActiveWindowId('exportID')} id='exportIDButton' className='mainButton'>
                        <Label className="mainButtonLabel" text="Export Identity" color="#D9D9D9"></Label>
                        <AuthDeviceExportDeco className="mainButtonDeco"></AuthDeviceExportDeco>
                    </div>
                    <Label className='settingsLabel' fontSize="2.2vh" id="authDeviceWarningLabel" text="Do not use this for any devices you do not trust" color="#FF002E" bkg="#FF002E30"></Label>
                    <Label className='settingsLabel' fontSize="2.1vh" id="authDeviceInfo0Label" text="This process allows you to authenticate your identity across multiple devices or to create a backup of your private key" color="#7000FF" bkg="#7000FF30"></Label>
                    <Button onClick={() => setActiveWindowId('home')} id="authDevicebackButton" className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Back"></Button>
                </div>
                : ''}
            {activeWindowId == 'exportID' ?
                <div id='authAnotherDeviceContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Export Identity" fontSize="2.4vh" color="#FFF"></Label>
                    <div onClick={() => setActiveWindowId('scanExpordID')} id='scanFromDeviceOptionButton' className='mainButton bottomNoBorderRadius'>
                        <Label className="mainButtonLabel" text="Scan From Another Device" color="#D9D9D9"></Label>
                        <AuthDeviceScanDeco className="mainButtonDeco"></AuthDeviceScanDeco>
                    </div>
                    <Label fontSize="2vh" id="scanFromDeviceOptionLabel" color="#7000FF" bkg="#7000FF30" className="topNoBorderRadius" text="Scan QR Codes using the target device"></Label>
                    <div id='downloadBackupOptionButton' className='mainButton bottomNoBorderRadius'>
                        <Label className="mainButtonLabel" text="Make a backup" color="#D9D9D9"></Label>
                        <AuthDeviceDownloadDeco className="mainButtonDeco"></AuthDeviceDownloadDeco>
                    </div>
                    <Label fontSize="2vh" id="downloadBackupOptionLabel" color="#7000FF" bkg="#7000FF30" className="topNoBorderRadius" text="Make a copy of your private key"></Label>
                    <Label className='settingsLabel' fontSize="2.2vh" id="authDeviceWarningLabel" style={{ top: '80%' }} text="Do not use this for any devices you do not trust" color="#FF002E" bkg="#FF002E30"></Label>
                    <Button onClick={() => setActiveWindowId('authDevice0')} id="authDevicebackButton" style={{ top: '90%' }} className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Back"></Button>
                </div>
                : ''}
            {activeWindowId == 'scanExpordID' ?
                <>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Export Identity" fontSize="2.4vh" color="#FFF"></Label>
                    <Label fontSize="2vh" id="scanExpordIDLabel" bkg="#7000FF30" color="#9644FF" text="Scan this QR Code from the target device"></Label>
                    <canvas id="pkShare"></canvas>
                    {/* <canvas style={{ top: '0%' }} id="pkShare1"></canvas>
                    <canvas style={{ top: '10%' }} id="pkShare2"></canvas> */}

                </>
                : ''}
            {/* <Test></Test> */}
        </div>
    )
}

export default Settings;