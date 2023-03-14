import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import axios from 'axios';
import { useState } from 'react';
import DomainGetter from '../fn/DomainGetter';
import { sha256 } from 'crypto-hash';

function PasswordPrompt(props) {
    const [input, setInput] = useState('');
    const [failedLabel, setFailedLabel] = useState(false);
    const enter = () => {
        if (input.length > 5) {
            axios.post(`${DomainGetter('devx')}api/dbop?verifyPassword`, { rtdbPayload: props.rtdbPayload, password: input, authShareType: props.authShareType, AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
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
            })
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