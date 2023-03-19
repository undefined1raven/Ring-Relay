import Label from './Label';
import InputField from '../components/InputField.js'
import Button from '../components/Button.js'
import PasswordValidator from '../components/PasswordValidator.js'
import { useState } from 'react';


function SettingsNewPassword(props) {
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [newPasswordInput, setNewPasswordInput] = useState('');

    if (props.show) {
        return (<div className="resetPasswordContainer">
            <Label text="Current Password" color="#9948FF" fontSize="2vh" style={{ top: '19.375%' }} className="changePasswordFieldLabel"></Label>
            <InputField color="#6300E0" type="password" style={{ top: '23.59375%' }} className="changePasswordInputField" onChange={(e) => setCurrentPasswordInput(e.target.value)} value={currentPasswordInput}></InputField>
            <Label text="New Password" color="#9948FF" fontSize="2vh" style={{ top: '32.8125%' }} className="changePasswordFieldLabel"></Label>
            <InputField color="#6300E0" type="password" style={{ top: '37.03125%' }} className="changePasswordInputField" onChange={(e) => setNewPasswordInput(e.target.value)} value={newPasswordInput}></InputField>
            <Button onClick={() => { }} className="settingsMenuButton" style={{ top: '50.46875%' }} fontSize="2.3vh" color="#7100FF" bkg="#7100FF" label="Enter"></Button>
            <Button onClick={props.onCancel} className="settingsMenuButton" style={{ top: '59.0625%' }} fontSize="2.3vh" color="#929292" label="Cancel"></Button>
            <Label className='settingsLabel' style={{top: '70%', height: '10.3125%'}} fontSize="2vh" text="Changing your password will invalidate all existing private key backups since they are encrypted with your account’s password" color="#FF002E" bkg="#FF002E30"></Label>
            <Label className='settingsLabel' style={{top: '82.34375%', height: '11.3125%'}} fontSize="2vh" text="Making a new backup of your private keys is highly recommended so you wouldn’t lose access to your conversations in the event of losing your device" color="#6300E0" bkg="#6300E030"></Label>
            <PasswordValidator password={newPasswordInput} top="45%"></PasswordValidator>
        </div>)
    } else {
        return ''
    }
}

export default SettingsNewPassword;