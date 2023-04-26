import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react';
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter';
import { deviceType, browserName, osName, osVersion, browserVersion } from 'react-device-detect';


function SettingsNewPassword(props) {
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [currentPasswordInputFieldColor, setCurrentPasswordInputFieldColor] = useState('#6300E0');
    const [newUsernameInputFieldColor, setNewUsernameInputFieldColor] = useState('#6300E0');
    const [newUsernameInput, setNewUsernameInput] = useState('');
    const [enterButtonProps, setEnterButtonProps] = useState({ color: '#7100FF', label: 'Enter' });

    let reg = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;

    useEffect(() => {
        setCurrentPasswordInput('')
        setNewUsernameInput('')
    }, [props.show])


    const usernameChangeResponse = (resx) => {
        if (resx.data.flag) {
            setEnterButtonProps({ label: 'Success', color: '#00FFD1' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            setEnterButtonProps({ label: 'Action Failed', color: '#FF002E' });
            setCurrentPasswordInput('')
            setNewUsernameInput('')
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
            if (newUsernameInput.length < 3) {
                setNewUsernameInputFieldColor('#FF002E');
                setEnterButtonProps({ label: 'Username has to have at least 3 chars', color: '#FF002E' });
                setTimeout(() => {
                    setNewUsernameInputFieldColor('#6300E0');
                    setEnterButtonProps({ label: 'Enter', color: '#7100FF' });
                }, 2000);
            }
            if (currentPasswordInput.length > 7 && !currentPasswordInput.match(reg) && newUsernameInput.length > 2) {
                setEnterButtonProps({ label: 'Validating ▣', color: '#001AFF' });
                var detailsObj = { device: deviceType, browser: `${browserName} v${browserVersion}`, os: `${osName} ${osVersion}` };
                axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=dd09c5fe81bb40f09731ac62189a515c`).then(res => {
                    var location = { name: `${res.data.city}, ${res.data.country_code}`, coords: { lat: res.data.latitude, long: res.data.longitude } };
                    axios.post(`${DomainGetter('prodx')}api/dbop?changeUsername`, {
                        AT: localStorage.getItem('AT'),
                        CIP: localStorage.getItem('CIP'),
                        currentPassword: currentPasswordInput.toString(),
                        newUsername: newUsernameInput.toString(),
                        location: JSON.stringify(location),
                        details: JSON.stringify(detailsObj),
                    }).then(resx => {
                        usernameChangeResponse(resx);
                    }).catch(e => {
                        setEnterButtonProps({ label: 'Request Failed', color: '#FF002E' });
                    })
                }).catch(e => {
                    axios.post(`${DomainGetter('prodx')}api/dbop?changeUsername`, {
                        AT: localStorage.getItem('AT'),
                        CIP: localStorage.getItem('CIP'),
                        currentPassword: currentPasswordInput.toString(),
                        newUsername: newUsernameInput.toString(),
                        location: JSON.stringify({ name: 'Unknown', coords: { lat: 0, long: 0 } }),
                        details: JSON.stringify(detailsObj),
                    }).then(resx => {
                        usernameChangeResponse(resx);
                    }).catch(e => {
                        setEnterButtonProps({ label: 'Request Failed', color: '#FF002E' });
                    })
                });
            }
        }
    }

    if (props.show) {
        return (<div className="changeUsernameContainer">
            <Label text="Current Password" color="#9948FF" fontSize="2vh" style={{ top: '19.375%' }} className="changePasswordFieldLabel"></Label>
            <Label text="New Username" color="#9948FF" fontSize="2vh" style={{ top: '32.8125%' }} className="changePasswordFieldLabel"></Label>
            <Button onClick={onEnter} className="settingsMenuButton" style={{ top: '50.46875%', border: `${enterButtonProps.label == 'Enter' ? 'solid 1px #7100FF' : 'solid 0px #000'}` }} fontSize="2.3vh" color={enterButtonProps.color} bkg={enterButtonProps.color} label={enterButtonProps.label}></Button>
            <Button onClick={props.onCancel} className="settingsMenuButton" style={{ top: '59.0625%' }} fontSize="2.3vh" color="#929292" label="Cancel"></Button>
            <Label className='settingsLabel' style={{ top: '72.34375%', height: '6.3125%' }} fontSize="2vh" text="Your unique tag will stay the same " color="#6300E0" bkg="#6300E030"></Label>
            <form>
                <InputField autoComplete="current-password" color={currentPasswordInputFieldColor} type="password" style={{ top: '23.59375%' }} className="changePasswordInputField" onChange={(e) => setCurrentPasswordInput(e.target.value)} value={currentPasswordInput}></InputField>
                <InputField autoComplete="new-username" color={newUsernameInputFieldColor} type="text" style={{ top: '37.03125%' }} className="changePasswordInputField" onChange={(e) => setNewUsernameInput(e.target.value)} value={newUsernameInput}></InputField>
            </form>
        </div>)
    } else {
        return ''
    }
}

export default SettingsNewPassword;