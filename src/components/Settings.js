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
import PasswordPrompt from '../components/PasswordPrompt.js'
import { symmetricDecrypt, symmetricEncrypt } from '../fn/crypto.js';
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter';
const Reader = (props) => {
    const [data, setData] = useState('No result');





    useEffect(() => {
        props.onDataChange(data);
    }, [data])

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
                style={{ width: '90%', top: '29.375%', left: '5%', border: 'solid 1px #001AFF', borderRadius: 'border-radius: 5px 5px 0px 0px' }}
            />
            <Label text={props.len} id="results" color="#FFF"></Label>
        </>
    );
};


function Settings(props) {
    const [activeWindowId, setActiveWindowId] = useState('home')
    const [windowHash, setWindowHash] = useState('/');
    const [scanExportStage, setScanExportStage] = useState(0);
    const [authed, setAuthed] = useState({ ini: false });
    const [passwordPrompt, setPasswordPrompt] = useState({ visible: false });
    const [exportPassword, setExportPassword] = useState('');
    const [scanMode, setScanMode] = useState('export');
    const [scanResult, setScanResult] = useState(0);
    const [scanResultArray, setScanResultArray] = useState([]);
    const [decryptionParams, setDecryptionParams] = useState({ ini: false });

    let pkPem = localStorage.getItem(localStorage.getItem('PKGetter'))


    function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    const salt = window.crypto.getRandomValues(new Uint8Array(16))
    const iv = window.crypto.getRandomValues(new Uint8Array(12))


    const onScanData = (data) => {
        if (data.length >= 840 && scanResultArray.length <= 4) {
            if (scanResultArray.indexOf(data) == -1) {
                setScanResultArray((prev) => [...prev, data]);
                setScanExportStage(prev => prev + 1)
            }
        }
    }

    function _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    useEffect(() => {
        if (scanResultArray.length == 5) {

            let cipher = ''
            let DPID = ''
            for (let ix = 0; ix < scanResultArray.length; ix++) {
                if (ix == 0) {
                    DPID = JSON.parse(scanResultArray[ix]).DPID;
                    cipher += JSON.parse(scanResultArray[ix]).data;
                } else {
                    cipher += scanResultArray[ix];
                }
            }

            if (!decryptionParams.ini) {
                axios.post(`${DomainGetter('prodx')}api/dbop?getIDP=0`, { DPID: DPID, AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
                    if (res.data.flag) {
                        let ivBuf = _base64ToArrayBuffer(res.data.iv.toString())
                        let saltBuf = _base64ToArrayBuffer(res.data.salt.toString())
                        let cipherBuf = _base64ToArrayBuffer(cipher);
                        if (exportPassword != '') {
                            symmetricDecrypt('nicer', saltBuf, ivBuf, cipherBuf).then(plain => { setScanResult(`${plain} | ${cipher.length} | ${ivBuf.byteLength}x | ${saltBuf.byteLength}s | ${'nicer'}`) }).catch(e => setScanResult(`dE  | ${e} | ${DPID} | ${cipher}`))
                        }
                    } else {
                        setScanResult(`rexq failewd | ${DPID} | ${cipher}`)
                    }

                }).catch(e => { setScanResult(`req failewd | ${DPID} | ${cipher}`) });
            }
        } else {
            setScanResult('cff')
        }
    }, [scanResultArray])

    useEffect(() => {
        // setScanResult(`${scanResultArray[0]?.length}|${scanResultArray[1]?.length}|${scanResultArray[2]?.length}|${scanResultArray[3]?.length}|${scanResultArray[4]?.length}`)
    }, [scanResultArray])

    function exportController() {
        if (exportPassword != '') {
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

                let decryptParamsID = props.user.ownUID;
                let pk0s = { data: pk0, DPID: decryptParamsID };
                console.log(cipher.base64.length)
                let splittedPKArr = [JSON.stringify(pk0s), pk1, pk2, pk3, pk4];
                QRCode.toCanvas(document.getElementById('pkShare'), splittedPKArr[scanExportStage], { color: { dark: '#090003', light: '#B479FF' } }, (res) => { console.log(res) })
            })
        }
    }

    useEffect(() => {
        if (scanExportStage == 5) {
            // setActiveWindowId('home');
            setScanExportStage(0)
            setAuthed({ ini: false })
        } else if (scanExportStage <= 4) {
            exportController();
        }
    }, [activeWindowId, scanExportStage, exportPassword])

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
    const colorFromExportStage = (stage) => {
        if (scanExportStage == stage) {
            return '#001AFF'
        } else if (scanExportStage < stage) {
            return '#46009E'

        } else if (scanExportStage > stage) {
            return '#00FFD1'
        }
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
                    <Button id="regenKeyPairButton" className="settingsMenuButton" fontSize="2.3vh" color={props.privateKeyStatus ? "#7000FF" : '#5A5A5A'} bkg={props.privateKeyStatus ? "#7000FF" : ''} label={props.privateKeyStatus ? "Regenerate Key Pair" : '[Not Available]'}></Button>
                    <Button id="logsButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Logs"></Button>
                    <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="87.5%"></HorizontalLine>
                </div>
                : ''}
            {activeWindowId == 'authDevice0' ?
                <div id='authAnotherDeviceContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Authenticate Another Device" fontSize="2.4vh" color="#FFF"></Label>
                    <div onClick={() => { setActiveWindowId('exportID'); setScanMode('import') }} id='importIDButton' className='mainButton'>
                        <Label className="mainButtonLabel" text="Import Identity" color="#D9D9D9"></Label>
                        <AuthDeviceImportDeco className="mainButtonDeco"></AuthDeviceImportDeco>
                    </div>
                    <div onClick={() => { if (props.privateKeyStatus) { setActiveWindowId('exportID'); setScanMode('export') } }} id='exportIDButton' className='mainButton' style={{ border: `${props.privateKeyStatus ? 'solid 1px #7000FF' : 'solid 1px #5A5A5A'}` }}>
                        <Label className="mainButtonLabel" text={props.privateKeyStatus ? "Export Identity" : '[Not Available]'} color={props.privateKeyStatus ? "#D9D9D9" : '#5A5A5A'}></Label>
                        {props.privateKeyStatus ? <AuthDeviceExportDeco className="mainButtonDeco"></AuthDeviceExportDeco> : ''}
                    </div>
                    <Label className='settingsLabel' fontSize="2.2vh" id="authDeviceWarningLabel" text="Do not use this for any devices you do not trust" color="#FF002E" bkg="#FF002E30"></Label>
                    <Label className='settingsLabel' fontSize="2.1vh" id="authDeviceInfo0Label" text="This process allows you to authenticate your identity across multiple devices or to create a backup of your private key" color="#7000FF" bkg="#7000FF30"></Label>
                    <Button onClick={() => setActiveWindowId('home')} id="authDevicebackButton" className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Back"></Button>
                </div>
                : ''}
            {activeWindowId == 'exportID' ?
                <div id='authAnotherDeviceContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text={scanMode == 'export' ? 'Export Identity' : 'Import Identity'} fontSize="2.4vh" color="#FFF"></Label>
                    <div onClick={() => { setActiveWindowId('scanExportID'); if (!authed.ini) { setPasswordPrompt({ visible: true }) } }} id='scanFromDeviceOptionButton' className='mainButton bottomNoBorderRadius'>
                        <Label className="mainButtonLabel" text="Scan From Another Device" color="#D9D9D9"></Label>
                        <AuthDeviceScanDeco className="mainButtonDeco"></AuthDeviceScanDeco>
                    </div>
                    <Label fontSize={scanMode == 'export' ? '2vh' : '1.6vh'} id="scanFromDeviceOptionLabel" color="#7000FF" bkg="#7000FF30" className="topNoBorderRadius" text={scanMode == 'export' ? "Scan QR Codes using the target device" : 'Scan the QR Code from the device you’re exporting from'}></Label>
                    <div id='downloadBackupOptionButton' className='mainButton bottomNoBorderRadius'>
                        <Label className="mainButtonLabel" text={scanMode == 'export' ? 'Make a backup' : 'Load a backup'} color="#D9D9D9"></Label>
                        <AuthDeviceDownloadDeco className="mainButtonDeco"></AuthDeviceDownloadDeco>
                    </div>
                    <Label fontSize="2vh" id="downloadBackupOptionLabel" color="#7000FF" bkg="#7000FF30" className="topNoBorderRadius" text={scanMode == 'export' ? "Make a copy of your private key" : 'Load a copy of your private key'}></Label>
                    <Label className='settingsLabel' fontSize="2.2vh" id="authDeviceWarningLabel" style={{ top: '80%' }} text="Do not use this for any devices you do not trust" color="#FF002E" bkg="#FF002E30"></Label>
                    <Button onClick={() => setActiveWindowId('authDevice0')} id="authDevicebackButton" style={{ top: '90%' }} className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Back"></Button>
                </div>
                : ''}
            {activeWindowId == 'scanExportID' ?
                <>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Export Identity" fontSize="2.4vh" color="#FFF"></Label>
                    <Label fontSize="2vh" id="scanExpordIDLabel" bkg="#7000FF30" color="#9644FF" text="Scan this QR Code from the target device"></Label>
                    <Button onClick={() => setScanExportStage(prev => prev + 1)} id="scanExportIDNextButton" className="settingsMenuButton" fontSize="2.3vh" color="#001AFF" bkg="#001AFF" label={scanExportStage == 4 ? 'Done' : 'Next'}></Button>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel0" bkg={`${colorFromExportStage(0)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(0)} text="1"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel1" bkg={`${colorFromExportStage(1)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(1)} text="2"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel2" bkg={`${colorFromExportStage(2)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(2)} text="3"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel3" bkg={`${colorFromExportStage(3)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(3)} text="4"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel4" bkg={`${colorFromExportStage(4)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(4)} text="5"></Label>
                    <Button onClick={() => setActiveWindowId('exportID')} id="authDevicebackButton" style={{ top: '91.5%' }} className="settingsMenuButton" fontSize="2.3vh" color="#FF002E" label="Cancel"></Button>
                    <PasswordPrompt setExportPassword={(EP) => { EP.then(ep => setExportPassword(ep)) }} rtdbPayload={{ salt: window.btoa(ab2str(salt)), iv: window.btoa(ab2str(iv)) }} onValid={() => { setAuthed({ ini: true }); setPasswordPrompt({ visible: false }); exportController(); }} type="password" exportType="scan" onBack={() => setActiveWindowId('exportID')} show={passwordPrompt.visible}></PasswordPrompt>
                    {authed.ini && scanMode == 'export' ? <canvas id="pkShare"></canvas> : ''}
                    {authed.ini && scanMode == 'import' ? <Reader len={scanResult} onDataChange={(data) => onScanData(data)}></Reader> : ''}
                    <Label text={scanResult} color="#FFF"></Label>
                </>
                : ''}
        </div>
    )
}

export default Settings;