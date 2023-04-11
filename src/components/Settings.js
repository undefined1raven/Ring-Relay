import QRCode from 'qrcode'
import { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import Label from './Label';
import Button from '../components/Button.js'
import InputField from '../components/InputField.js'
import HorizontalLine from '../components/HorizontalLine.js'
import AuthDeviceImportDeco from '../components/authDeviceImportDeco.js'
import AuthDeviceExportDeco from '../components/authDeviceExportDeco.js'
import AuthDeviceScanDeco from '../components/authDeviceScanDeco.js'
import AuthDeviceDownloadDeco from '../components/authDeviceDownloadDeco.js'
import AuthDeviceLoadDeco from '../components/AuthDeviceLoadDeco.js'
import PasswordPrompt from '../components/PasswordPrompt.js'
import PasswordReset from '../components/SettingsNewPassword.js'
import ChangeUsername from '../components/SettingsNewUsername.js'
import { pemToKey, symmetricDecrypt, symmetricEncrypt } from '../fn/crypto.js';
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter';
import { download } from '../fn/download';
import { v4 } from 'uuid';
import NotificationsDialog from '../components/NotificationsDialog.js'
import SettingsLogs from '../components/SettingsLogs.js'
import SettingsKeyPairsRegen from '../components/SettingsKeyPairsRegen.js'
import QRCodeScanAreaDeco from './QRCodeScanAreaDeco';

const salt = window.crypto.getRandomValues(new Uint8Array(16))
const iv = window.crypto.getRandomValues(new Uint8Array(12))


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
                    if (!!error) { }
                }}
                style={{ width: '90%', top: '29.375%', left: '5%', border: 'solid 1px #001AFF', borderRadius: 'border-radius: 5px 5px 0px 0px' }}
            />
            <Label text="Adjust the distance/brightness of the screen while keeping it centered" style={{ top: '70%' }} fontSize="1.5vh" id="results" color="#999"></Label>
            {/* <QRCodeScanAreaDeco style={{ position: 'absolute', top: '42%', zIndex: '5000' }} id="QRCodeScanAreaDeco"></QRCodeScanAreaDeco> */}
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
    const [scanResultArray, setScanResultArray] = useState([]);
    const [decryptionParams, setDecryptionParams] = useState({ ini: false });
    const [authShareType, setAuthShareType] = useState('scan.export')//specifies the auth share method
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [revokeIDWindow, setRevokeIDWindow] = useState({ visible: false, stage: 0 })
    const [revokeIDFieldInput, setRevokeIDFieldInput] = useState('');
    let pkPem = localStorage.getItem(localStorage.getItem('PKGetter'))
    let pskPem = localStorage.getItem(`SV-${localStorage.getItem('PKGetter')}`)

    function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

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


    const reloadPage = () => {
        window.location.reload();
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
                setIsRefreshing(true)
                axios.post(`${DomainGetter('prodx')}api/dbop?getIDP=0`, { DPID: DPID, AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
                    if (res.data.flag) {
                        let ivBuf = _base64ToArrayBuffer(res.data.iv.toString())
                        let saltBuf = _base64ToArrayBuffer(res.data.salt.toString())
                        let nPKGetter = JSON.parse(scanResultArray[0]).PKGetter;
                        let cipherBuf = _base64ToArrayBuffer(cipher);
                        if (exportPassword != '') {
                            symmetricDecrypt(exportPassword, saltBuf, ivBuf, cipherBuf).then(plain => {
                                let exportPayloadJSON = JSON.parse(plain);
                                pemToKey(exportPayloadJSON.pkPem).then(privateKey => {
                                    pemToKey(exportPayloadJSON.pskPem, 'ECDSA').then(privateSigningKey => {
                                        localStorage.setItem('PKGetter', nPKGetter);
                                        localStorage.setItem(nPKGetter, exportPayloadJSON.pkPem);
                                        localStorage.setItem(`SV-${nPKGetter}`, exportPayloadJSON.pskPem);
                                        axios.post(`${DomainGetter('prodx')}api/dbop?removeExportToken`, { DPID: DPID, AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
                                            reloadPage();
                                        });
                                        setTimeout(() => {
                                            setIsRefreshing(false)
                                        }, 2000);
                                    })
                                }).catch(e => {
                                })
                            }).catch(e => { })
                        }
                    } else {
                    }

                }).catch(e => { });
            }
        } else { }
    }, [scanResultArray])


    function exportController() {
        if (exportPassword != '') {
            setAuthShareType('scan.export');
            let exportPayloadJSON = { pkPem: pkPem, pskPem: pskPem }
            symmetricEncrypt(salt, iv, JSON.stringify(exportPayloadJSON), exportPassword).then(cipher => {
                symmetricDecrypt(exportPassword, salt, iv, cipher.buffer).then(plain => { })
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
                let pk0s = { data: pk0, DPID: decryptParamsID, PKGetter: localStorage.getItem('PKGetter') };
                let splittedPKArr = [JSON.stringify(pk0s), pk1, pk2, pk3, pk4];
                QRCode.toCanvas(document.getElementById('pkShare'), splittedPKArr[scanExportStage], { color: { dark: '#090003', light: '#B479FF' } }, (res) => { })
            })
        }
    }

    useEffect(() => {
        if (scanExportStage == 5) {
            setScanExportStage(0)
            setActiveWindowId('home');
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
    const onDeviceRemoveAuth = () => {
        setRevokeIDWindow({ visible: true, stage: 0 });
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
    const deleteAccount = () => {
        if (revokeIDFieldInput == 'Delete my account') {
            localStorage.removeItem(localStorage.getItem('PKGetter'));
            localStorage.removeItem(`SV-${localStorage.getItem('PKGetter')}`);
            localStorage.removeItem('PKGetter');
            axios.post(`${DomainGetter('prodx')}api/dbop?deleteAccount`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(rsx => {
                setWindowHash('/login');
            });
        }
    }
    const onFileImportOrExport = () => {
        if (scanMode == 'export') {
            const exportPayloadJSON = { pkPem: pkPem, pskPem: pskPem };
            symmetricEncrypt(salt, iv, JSON.stringify(exportPayloadJSON), exportPassword).then(cipher => {
                let encryptedKey = JSON.stringify({ cipher: cipher.base64, iv: window.btoa(ab2str(iv)), salt: window.btoa(ab2str(salt)), PKGetter: localStorage.getItem('PKGetter') });
                let encoded = window.btoa(encryptedKey)
                download(`${v4().split('-')[1]}-${v4().split('-')[2]}.key.txt`, encoded);
            })
        }
    }
    const importKey = (e) => {
        let target = e.target;
        let reader = new FileReader();
        reader.onload = () => {
            let encodedKey = reader.result;
            let encryptedKeyObj = JSON.parse(window.atob(encodedKey));
            let lsalt = _base64ToArrayBuffer(encryptedKeyObj.salt);
            let liv = _base64ToArrayBuffer(encryptedKeyObj.iv);
            let lPKGetter = encryptedKeyObj.PKGetter;
            let cipher = _base64ToArrayBuffer(encryptedKeyObj.cipher);
            symmetricDecrypt(exportPassword, lsalt, liv, cipher).then(exportPayloadString => {
                let exportPayload = JSON.parse(exportPayloadString);
                pemToKey(exportPayload.pkPem).then(pk => {
                    pemToKey(exportPayload.pskPem, 'ECDSA').then(psk => {
                        if (pk.type == 'private' && psk.type == 'private') {
                            localStorage.setItem('PKGetter', lPKGetter);
                            localStorage.setItem(lPKGetter, exportPayload.pkPem);
                            localStorage.setItem(`SV-${lPKGetter}`, exportPayload.pskPem);
                            window.location.reload()
                        }
                    })
                })
            });
        }
        reader.readAsText(target.files[0])
    }
    useEffect(() => {
        if (!revokeIDWindow.visible) {
            setRevokeIDFieldInput('');
        }
    }, [revokeIDWindow])

    const onRevokeID = () => {
        setRevokeIDWindow({ visible: false, stage: 0 });
        window.location.reload()
        localStorage.removeItem(localStorage.getItem('PKGetter'))
        localStorage.removeItem('PKGetter')
    }
    return (
        <div>
            <Label show={props.user.username != 0} color="#9644FF" fontSize="2.1vh" bkg="#7000FF20" id="loggedInAsLabel" text={`${props.user.username}`}></Label>
            <Label show={props.user.ownUID != 0} color="#9644FF" fontSize="1.8vh" bkg="#7000FF00" id="loggedInAsQidLabel" text={`<${props.user.ownUID.toString().split('-')[4]}>`}></Label>
            <Label show={props.user.ownUID == 0 || props.user.username == 0} color="#001AFF" fontSize="1.8vh" bkg="#001AFF30" id="loggedInAsLabelLoading" text="[Loading]"></Label>
            <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="16.5625%"></HorizontalLine>
            {activeWindowId == 'home' ?
                <div id='mainMenuContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Account" fontSize="2.4vh" color="#FFF"></Label>
                    <Button onClick={logout} id="logoutBtn" width="90%" fontSize="2.3vh" height="6.46875%" color="#878787" bkg="#410093" label="Log Out"></Button>
                    <Button onClick={() => setActiveWindowId('changeUsername')} id="changeUsernameButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Change Username"></Button>
                    <Button onClick={() => setActiveWindowId('changePassword')} id="changePasswordButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Change Password"></Button>
                    <Button onClick={() => setActiveWindowId('deleteAccount')} id="deleteAccountButton" className="settingsMenuButton" fontSize="2.3vh" color="#FF002E" bkg="#FF002E" label="Delete Account"></Button>
                    <Button onClick={() => setActiveWindowId('notificationSettings')} id="notificationSettingsButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Notifications"></Button>
                    <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="51.25%"></HorizontalLine>
                    <Label className="settingsMenuLabel" id="securityLabel" text="Security" fontSize="2.4vh" color="#FFF"></Label>
                    <Button onClick={onDeviceAuth} id="authDeviceButton" className="settingsMenuButton" fontSize="1.9vh" color="#7000FF" bkg="#7000FF" label="Authenticate Another Device"></Button>
                    <Button onClick={onDeviceRemoveAuth} id="removeAuthFromDeviceButton" className="settingsMenuButton" fontSize="2vh" color="#FF002E" bkg="#FF002E" label="Distrust This Device"></Button>
                    <Button onClick={() => setActiveWindowId('keysRegen')} id="regenKeyPairButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Regenerate Key Pairs"></Button>
                    <Button onClick={() => setActiveWindowId('logs')} id="logsButton" className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label="Logs"></Button>
                    <HorizontalLine className="settingsHLine" color="#7000FF" width="89.8%" left="5%" top="87.5%"></HorizontalLine>
                </div>
                : ''}
            {activeWindowId == 'authDevice0' ?
                <div id='authAnotherDeviceContainer'>
                    <Label className="settingsMenuLabel" id="accountLabel" text="Authenticate Another Device" fontSize="2.4vh" color="#FFF"></Label>
                    <div onClick={() => { setActiveWindowId('exportID'); setScanMode('import'); setAuthShareType('scan.import') }} id='importIDButton' className='mainButton'>
                        <Label className="mainButtonLabel" text="Import Identity" color="#D9D9D9"></Label>
                        <AuthDeviceImportDeco className="mainButtonDeco"></AuthDeviceImportDeco>
                    </div>
                    <div onClick={() => { if (props.privateKeyStatus) { setActiveWindowId('exportID'); setScanMode('export'); setAuthShareType('scan.export') } }} id='exportIDButton' className='mainButton' style={{ border: `${props.privateKeyStatus ? 'solid 1px #7000FF' : 'solid 1px #5A5A5A'}` }}>
                        <Label className="mainButtonLabel" text={props.privateKeyStatus ? "Export Identity" : '[Not Available]'} color={props.privateKeyStatus ? "#D9D9D9" : '#5A5A5A'}></Label>
                        {props.privateKeyStatus ? <AuthDeviceExportDeco className="mainButtonDeco"></AuthDeviceExportDeco> : ''}
                    </div>
                    <Label className='settingsLabel' fontSize="2.2vh" id="authDeviceWarningLabel" text="Do not use this for any devices you do not trust" color="#FF002E" bkg="#FF002E30"></Label>
                    <Label className='settingsLabel' fontSize="2.1vh" id="authDeviceInfo0Label" text="This process allows you to authenticate your identity across multiple devices or to create a backup of your private keys" color="#7000FF" bkg="#7000FF30"></Label>
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
                    <div onClick={() => { setActiveWindowId('fileExportID'); if (scanMode == 'export') { setAuthShareType('file.export'); } else { setAuthShareType('file.import'); } if (!authed.ini) { setPasswordPrompt({ visible: true }) } }} id='downloadBackupOptionButton' className='mainButton bottomNoBorderRadius'>
                        <Label className="mainButtonLabel" text={scanMode == 'export' ? 'Make a backup' : 'Load a backup'} color="#D9D9D9"></Label>
                        {scanMode == 'export' ? <AuthDeviceDownloadDeco className="mainButtonDeco"></AuthDeviceDownloadDeco> : <AuthDeviceLoadDeco className="mainButtonDeco"></AuthDeviceLoadDeco>}
                    </div>
                    <Label fontSize="2vh" id="downloadBackupOptionLabel" color="#7000FF" bkg="#7000FF30" className="topNoBorderRadius" text={scanMode == 'export' ? "Make a copy of your private keys" : 'Load a copy of your private keys'}></Label>
                    <Label className='settingsLabel' fontSize="2.2vh" id="authDeviceWarningLabel" style={{ top: '80%' }} text="Do not use this for any devices you do not trust" color="#FF002E" bkg="#FF002E30"></Label>
                    <Button onClick={() => setActiveWindowId('authDevice0')} id="authDevicebackButton" style={{ top: '90%' }} className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Back"></Button>
                </div>
                : ''}
            {activeWindowId == 'scanExportID' ?
                <>
                    <Label className="settingsMenuLabel" id="accountLabel" text={scanMode == 'export' ? "Export Identity" : 'Import Identity'} fontSize="2.4vh" color="#FFF"></Label>
                    <Label fontSize="2vh" id="scanExpordIDLabel" bkg="#7000FF30" color="#9644FF" text={scanMode == 'export' ? "Scan this QR Code from the target device" : "Scan the QR Code from the exporting device"}></Label>
                    <Button onClick={() => setScanExportStage(prev => prev + 1)} id="scanExportIDNextButton" className="settingsMenuButton" fontSize="2.3vh" color="#001AFF" bkg="#001AFF" label={scanExportStage == 4 ? 'Done' : 'Next'}></Button>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel0" bkg={`${colorFromExportStage(0)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(0)} text="1"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel1" bkg={`${colorFromExportStage(1)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(1)} text="2"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel2" bkg={`${colorFromExportStage(2)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(2)} text="3"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel3" bkg={`${colorFromExportStage(3)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(3)} text="4"></Label>
                    <Label fontSize="2.5vh" id="scanExpordIDStageLabel4" bkg={`${colorFromExportStage(4)}30`} className="settingsMenuButton scanExpordIDStageLabelx" color={colorFromExportStage(4)} text="5"></Label>
                    <Button onClick={() => setActiveWindowId('exportID')} id="authDevicebackButton" style={{ top: '91.5%' }} className="settingsMenuButton" fontSize="2.3vh" color="#FF002E" label="Cancel"></Button>
                    <PasswordPrompt setExportPassword={(EP) => { EP.then(ep => setExportPassword(ep)) }} rtdbPayload={{ salt: window.btoa(ab2str(salt)), iv: window.btoa(ab2str(iv)) }} onValid={() => { setAuthed({ ini: true }); setPasswordPrompt({ visible: false }); exportController(); }} type="password" authShareType={authShareType} onBack={() => setActiveWindowId('exportID')} show={passwordPrompt.visible}></PasswordPrompt>
                    {authed.ini && scanMode == 'export' ? <canvas id="pkShare"></canvas> : ''}
                    {authed.ini && scanMode == 'import' ? <Reader onDataChange={(data) => onScanData(data)}></Reader> : ''}
                </>
                : ''}
            {activeWindowId == 'fileExportID' ?
                <>
                    <Label className="settingsMenuLabel" id="accountLabel" text={scanMode == 'export' ? "Export Identity" : 'Import Identity'} fontSize="2.4vh" color="#FFF"></Label>
                    <Label fontSize="2vh" id="scanExpordIDLabel" bkg="#7000FF30" color="#9644FF" text={scanMode == 'export' ? 'Download a copy of your private keys' : 'Load a copy of your private keys'}></Label>
                    <Label fontSize="2vh" id="scanExpordIDLabel" style={{ top: '47.375%' }} bkg="#FF002E30" color="#FF002E" text="Never share this file with anyone"></Label>
                    {scanMode == 'export' ? <AuthDeviceDownloadDeco top="25.46875%" className="mainButtonDeco fileExportDeco" width="30vh" height="20vh"></AuthDeviceDownloadDeco> : <AuthDeviceLoadDeco top="30.46875%" width="30vh" height="20vh" className="mainButtonDeco fileExportDeco"></AuthDeviceLoadDeco>}
                    <Button onClick={() => setActiveWindowId('exportID')} id="authDevicebackButton" style={{ top: '65.15625%' }} className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Cancel"></Button>
                    <PasswordPrompt setExportPassword={(EP) => { EP.then(ep => setExportPassword(ep)) }} rtdbPayload={{ salt: window.btoa(ab2str(salt)), iv: window.btoa(ab2str(iv)) }} onValid={() => { setAuthed({ ini: true }); setPasswordPrompt({ visible: false }); exportController(); }} type="password" authShareType={authShareType} onBack={() => setActiveWindowId('exportID')} show={passwordPrompt.visible}></PasswordPrompt>
                    {scanMode == 'import' ? <input type='file' accept='.key.txt' onChange={(e) => importKey(e)} id="fileImportButton"></input>
                        :
                        <Button onClick={onFileImportOrExport} id="authDevicebackButton" style={{ top: '54.6875%' }} className="settingsMenuButton" fontSize="2.3vh" color="#7000FF" bkg="#7000FF" label='Download'></Button>
                    }
                </>
                : ''}
            {activeWindowId == 'deleteAccount' ? <>
                <Label className="settingsMenuLabel" id="accountLabel" style={{ top: '43.90625%' }} text="Type your 'Delete my account' to continue" fontSize="2.2vh" color="#9948FF"></Label>
                <Label className='settingsLabel' fontSize="2vh" id="authDeviceWarningLabel" style={{ top: '24.375%', height: '8.65625%' }} text="This will delete all your account data including all conversations" color="#FF002E" bkg="#FF002E30"></Label>
                <Label className='settingsLabel' fontSize="2vh" id="authDeviceWarningLabel" style={{ top: '35.3125%', height: '6.65625%' }} text="This action is nonreversible" color="#FF002E" bkg="#FF002E30"></Label>
                <Button onClick={() => { setActiveWindowId('home'); setRevokeIDFieldInput('') }} id="authDevicebackButton" className="settingsMenuButton" style={{ top: '68.75%' }} fontSize="2.3vh" color="#929292" label="Back"></Button>
                <Button onClick={deleteAccount} id="authDevicebackButton" className="settingsMenuButton" style={{ top: '59.6875%', backgroundColor: `${revokeIDFieldInput == 'Delete my account' ? '#FF002E30' : '#00000000'}` }} fontSize="2.3vh" color={revokeIDFieldInput == 'Delete my account' ? '#FF002E' : '#929292'} bkg={revokeIDFieldInput == 'Delete my account' ? '#FF002E' : ''} label="Delete Account"></Button>
                <InputField type="text" id="passInput" color="#6300E0" style={{ top: '48.28125%' }} onChange={(e) => setRevokeIDFieldInput(e.target.value)} value={revokeIDFieldInput}></InputField>

            </> : ''}
            <Label show={isRefreshing} className="settingsMenuLabel" id="waitingForRefreshLabel" text="[Validating]" fontSize="2.4vh" color="#001AFF"></Label>
            {revokeIDWindow.visible ?
                <div id='revokeIDContainer'>
                    {revokeIDWindow.stage == 0 ?
                        <>
                            <Label className="settingsMenuLabel" id="accountLabel" style={{ top: '43.90625%' }} text="Type 'I understand' to continue" fontSize="2.4vh" color="#9948FF"></Label>
                            <Label className='settingsLabel' fontSize="2vh" id="authDeviceWarningLabel" style={{ top: '26.5625%', height: '12.65625%' }} text="This will remove the private keys from this device. Please make sure you have a backup on another device. Remember to delete all backups from this device if there are any." color="#FF002E" bkg="#FF002E30"></Label>
                            <Button onClick={() => setRevokeIDWindow({ visible: false, stage: 0 })} id="authDevicebackButton" className="settingsMenuButton" style={{ top: '68.75%' }} fontSize="2.3vh" color="#929292" label="Back"></Button>
                            <Button onClick={() => { if (revokeIDFieldInput == 'I understand') { setRevokeIDWindow({ visible: true, stage: 1 }) } }} id="authDevicebackButton" className="settingsMenuButton" style={{ top: '59.6875%' }} fontSize="2.3vh" color={revokeIDFieldInput == 'I understand' ? '#6300E0' : '#929292'} bkg={revokeIDFieldInput == 'I understand' ? '#6300E0' : ''} label="Continue"></Button>
                            <InputField type="text" id="passInput" color="#6300E0" style={{ top: '48.28125%' }} onChange={(e) => setRevokeIDFieldInput(e.target.value)} value={revokeIDFieldInput}></InputField>
                        </> :
                        <>
                            <Label className='settingsLabel' fontSize="2vh" id="authDeviceWarningLabel" style={{ top: '33.4375%', height: '12.65625%' }} text="If this device has the only private keys for your account, all conversations will become unreadable and your contacts will know you refreshed your key pair " color="#FF002E" bkg="#FF002E30"></Label>
                            <Label className='settingsLabel' fontSize="2vh" id="authDeviceWarningLabel" style={{ top: '48.75%', height: '6%' }} text="This action is nonreversible" color="#FF002E" bkg="#FF002E30"></Label>
                            <Button onClick={() => setRevokeIDWindow({ visible: false, stage: 0 })} id="authDevicebackButton" className="settingsMenuButton" style={{ top: '68.75%' }} fontSize="2.3vh" color="#929292" label="Cancel"></Button>
                            <Button onClick={onRevokeID} id="authDevicebackButton" className="settingsMenuButton" style={{ top: '60.625%' }} fontSize="2.3vh" color="#FF002E" bkg="#FF002E" label="Confirm"></Button>
                        </>}
                </div> : ''}
            <PasswordReset onCancel={() => setActiveWindowId('home')} show={activeWindowId == 'changePassword'}></PasswordReset>
            <NotificationsDialog onHide={() => setActiveWindowId('home')} show={activeWindowId == 'notificationSettings'}></NotificationsDialog>
            <ChangeUsername onCancel={() => setActiveWindowId('home')} show={activeWindowId == 'changeUsername'}></ChangeUsername>
            <SettingsLogs onBack={() => setActiveWindowId('home')} show={activeWindowId == 'logs'}></SettingsLogs>
            <SettingsKeyPairsRegen ownKeySigs={props.ownKeySigs} onBack={() => setActiveWindowId('home')} show={activeWindowId == 'keysRegen'}></SettingsKeyPairsRegen>
        </div>
    )
}

export default Settings;