import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import PasswordValidator from '../components/PasswordValidator.js'
import { useState, useEffect } from 'react';
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter';
import { deviceType, browserName, osName, osVersion, browserVersion } from 'react-device-detect';


function SettingsNewPassword(props) {
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [currentPasswordInputFieldColor, setCurrentPasswordInputFieldColor] = useState('#6300E0');
    const [newPasswordInputFieldColor, setNewPasswordInputFieldColor] = useState('#6300E0');
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [enterButtonProps, setEnterButtonProps] = useState({ color: '#7100FF', label: 'Enter' });

    let reg = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;


    useEffect(() => {
        setCurrentPasswordInput('')
        setNewPasswordInput('')
    }, [props.show])

    const passwordResetResponse = (resx) => {
        if (resx.data.flag) {
            setEnterButtonProps({ label: 'Success', color: '#00FFD1' });
            localStorage.removeItem('AT');
            localStorage.removeItem('CIP');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setEnterButtonProps({ label: 'Action Failed', color: '#FF002E' });
            setCurrentPasswordInput('')
            setNewPasswordInput('')
            setTimeout(() => {
                setEnterButtonProps({ label: 'Enter', color: '#7100FF' });
            }, 2000);
        }
    }


    const onEnter = () => {
        if (enterButtonProps.label == 'Enter') {

            if (currentPasswordInput.length < 7 || currentPasswordInput.match(reg)) {
                setCurrentPasswordInputFieldColor('#FF002E');
                setEnterButtonProps({ label: 'Invalid Input', color: '#FF002E' });
                setTimeout(() => {
                    setCurrentPasswordInputFieldColor('#6300E0');
                    setEnterButtonProps({ label: 'Enter', color: '#7100FF' });
                }, 2000);
            }
            if (newPasswordInput.length < 7 || newPasswordInput.match(reg)) {
                setNewPasswordInputFieldColor('#FF002E');
                setEnterButtonProps({ label: 'Invalid Input', color: '#FF002E' });
                setTimeout(() => {
                    setNewPasswordInputFieldColor('#6300E0');
                    setEnterButtonProps({ label: 'Enter', color: '#7100FF' });
                }, 2000);
            }
            if (currentPasswordInput.length > 7 && !currentPasswordInput.match(reg) && newPasswordInput.length > 7 && !newPasswordInput.match(reg)) {
                var detailsObj = { device: deviceType, browser: `${browserName} v${browserVersion}`, os: `${osName} ${osVersion}` };
                setEnterButtonProps({ label: 'Validating ▣', color: '#001AFF' });
                axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=dd09c5fe81bb40f09731ac62189a515c`).then(res => {
                    var location = { name: `${res.data.city}, ${res.data.country_code}`, coords: { lat: res.data.latitude, long: res.data.longitude } };
                    axios.post(`${DomainGetter('devx')}api/dbop?changePassword`, {
                        AT: localStorage.getItem('AT'),
                        CIP: localStorage.getItem('CIP'),
                        currentPassword: currentPasswordInput.toString(),
                        newPassword: newPasswordInput.toString(),
                        location: JSON.stringify(location),
                        details: JSON.stringify(detailsObj),
                    }).then(resx => {
                        passwordResetResponse(resx);
                    }).catch(e => {
                        setEnterButtonProps({ label: 'Request Failed', color: '#FF002E' });
                    })
                }).catch(e => {
                    axios.post(`${DomainGetter('devx')}api/dbop?changePassword`, {
                        AT: localStorage.getItem('AT'),
                        CIP: localStorage.getItem('CIP'),
                        currentPassword: currentPasswordInput.toString(),
                        newPassword: newPasswordInput.toString(),
                        location: JSON.stringify({ name: 'Unknown', coords: { lat: 0, long: 0 } }),
                        details: JSON.stringify(detailsObj),
                    }).then(resx => {
                        passwordResetResponse(resx);
                    }).catch(e => {
                        setEnterButtonProps({ label: 'Request Failed', color: '#FF002E' });
                    })
                });
            }
        }
    }

    if (props.show) {
        return (<div className="resetPasswordContainer">
            <Label text="Current Password" color="#9948FF" fontSize="2vh" style={{ top: '19.375%' }} className="changePasswordFieldLabel"></Label>
            <Label text="New Password" color="#9948FF" fontSize="2vh" style={{ top: '32.8125%' }} className="changePasswordFieldLabel"></Label>
            <Button onClick={onEnter} className="settingsMenuButton" style={{ top: '50.46875%', border: `${enterButtonProps.label == 'Enter' ? 'solid 1px #7100FF' : 'solid 0px #000'}` }} fontSize="2.3vh" color={enterButtonProps.color} bkg={enterButtonProps.color} label={enterButtonProps.label}></Button>
            <Button onClick={props.onCancel} className="settingsMenuButton" style={{ top: '59.0625%' }} fontSize="2.3vh" color="#929292" label="Cancel"></Button>
            <Label className='settingsLabel' style={{ top: '70%', height: '10.3125%' }} fontSize="2vh" text="Changing your password will invalidate all existing private key backups since they are encrypted with your account’s password" color="#FF002E" bkg="#FF002E30"></Label>
            <Label className='settingsLabel' style={{ top: '82.34375%', height: '11.3125%' }} fontSize="2vh" text="Making a new backup of your private keys is highly recommended so you wouldn’t lose access to your conversations in the event of losing your device" color="#6300E0" bkg="#6300E030"></Label>
            <form>
                <InputField autoComplete="current-password" color={currentPasswordInputFieldColor} type="password" style={{ top: '23.59375%' }} className="changePasswordInputField" onChange={(e) => setCurrentPasswordInput(e.target.value)} value={currentPasswordInput}></InputField>
                <InputField autoComplete="new-password" color={newPasswordInputFieldColor} type="password" style={{ top: '37.03125%' }} className="changePasswordInputField" onChange={(e) => setNewPasswordInput(e.target.value)} value={newPasswordInput}></InputField>
            </form>
            <PasswordValidator password={newPasswordInput} top="45%"></PasswordValidator>
        </div>)
    } else {
        return ''
    }
}

export default SettingsNewPassword;