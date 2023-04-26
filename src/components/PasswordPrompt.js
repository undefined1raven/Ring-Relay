import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import axios from 'axios';
import { useState } from 'react';
import DomainGetter from '../fn/DomainGetter';
import { sha256 } from 'crypto-hash';
import { deviceType, browserName, osName, osVersion, browserVersion } from 'react-device-detect';

function PasswordPrompt(props) {
    const [input, setInput] = useState('');
    const [failedLabel, setFailedLabel] = useState(false);

    const passwordVerificationHandle = (res) => {
        if (res.data.flag) {
            props.onValid();
            props.setExportPassword(sha256(input))
        } else {
            setInput('');
            if (props.onFailed) {
                props.onFailed();
            }
            setFailedLabel(true);
            setTimeout(() => {
                setFailedLabel(false)
            }, 2000);
        }
    }

    const enter = () => {
        if (input.length > 5) {
            var detailsObj = { device: deviceType, browser: `${browserName} v${browserVersion}`, os: `${osName} ${osVersion}`, PKShareType: { method: props.authShareType.toString().split('.')[0], type: props.authShareType.toString().split('.')[1] } };
            axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=dd09c5fe81bb40f09731ac62189a515c`).then(res => {
                var location = { name: `${res.data.city}, ${res.data.country_code}`, coords: { lat: res.data.latitude, long: res.data.longitude } };
                axios.post(`${DomainGetter('devx')}api/dbop?verifyPassword`, {
                    rtdbPayload: props.rtdbPayload,
                    password: input,
                    authShareType: props.authShareType,
                    AT: localStorage.getItem('AT'),
                    CIP: localStorage.getItem('CIP'),
                    location: JSON.stringify(location),
                    details: JSON.stringify(detailsObj),
                }).then(res => {
                    passwordVerificationHandle(res);
                }).catch(e => { })
            }).catch(e => {
                axios.post(`${DomainGetter('devx')}api/dbop?verifyPassword`, {
                    rtdbPayload: props.rtdbPayload,
                    password: input,
                    authShareType: props.authShareType,
                    AT: localStorage.getItem('AT'),
                    CIP: localStorage.getItem('CIP'),
                    location: false,
                    details: JSON.stringify(detailsObj),
                }).then(res => {
                    passwordVerificationHandle(res);
                }).catch(e => { })
            });
        }
    }
    if (props.show) {
        return (
            <div className="passPromptContainer">
                <Label className="passPromptLabel" text="Password" color="#9948FF"></Label>
                <InputField type="password" id="passInput" color="#6300E0" onChange={(e) => setInput(e.target.value)} value={input}></InputField>
                <Button onClick={props.onBack} style={{ top: '55.3125%' }} className="settingsMenuButton" fontSize="2.3vh" color="#929292" label="Back"></Button>
                <Button onClick={enter} style={{ top: '46.71875%' }} className="settingsMenuButton" fontSize="2.3vh" bkg="#7100FF" color="#7100FF" label="Enter"></Button>
                <Label show={failedLabel} bkg="#FF002E30" className="passwordPromptFailedLabel" text="Auth Failed" color="#FF002E"></Label>
            </div>
        )
    } else {
        return ''
    }
}

export default PasswordPrompt;