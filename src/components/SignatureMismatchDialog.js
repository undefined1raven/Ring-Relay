import Label from '../components/Label.js'
import Button from '../components/Button.js'
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter.js'
import { useState } from 'react';


function SignatureMismatchDialog(props) {
    const [updating, setUpdating] = useState(false);

    const updateSigs = () => {
        if (!updating) {
            setUpdating(true);
            axios.post(`${DomainGetter('prodx')}api/dbop?updateConvoSig`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), remoteUID: props.remoteUID, MSUID: props.MSUID }).then(res => {
                props.updateLocalSigs();
                setUpdating(false);
            }).catch(e => {
                props.onHideSigMismatchDialog();
                setUpdating(false);
            })
        }
    }

    if (props.show) {
        return (
            <div className='sigMismatchDialogContainer'>
                <Label text="Conversation Signature Mismatch" fontSize="2.2vh" className="labelFlexCenter" style={{ top: "0%", width: "100%", height: '9.315589354%' }} color="#FF002E" bkg="#FF002E20"></Label>
                <Label text="What is this" fontSize="2vh" className="convoSigMismatchDialogHeader" color="#FF002E" bkg="#FF002E20"></Label>
                <Label style={{ top: '20.342205323%' }} text="The conversation signature ensures the person you’re talking with has the same key pairs as the ones used when you started the conversation." fontSize="1.9vh" className="convoSigMismatchDialogLabel" color="#FF002E" bkg="#FF002E00"></Label>
                <Label style={{ top: '30.798479087%' }} text="A mismatch in this signature could mean the account has been compromised and that a bad actor regenerated the key pairs for that account in order to impersonate the real person behind it." fontSize="1.9vh" className="convoSigMismatchDialogLabel" color="#FF002E" bkg="#FF002E00"></Label>
                <Label text="What can I do" style={{ top: '48.098859316%' }} fontSize="2vh" className="convoSigMismatchDialogHeader" color="#FF002E" bkg="#FF002E20"></Label>
                <Label style={{ top: '54.752851711%' }} text="Ask the person you’re trying to talk with whether they regenerated their key pairs. If they were the ones to make this action, tap the button below to trust the new signature." fontSize="1.9vh" className="convoSigMismatchDialogLabel" color="#FF002E" bkg="#FF002E00"></Label>
                <Button onClick={updateSigs} style={{ top: '76.425855513%' }} className="settingsMenuButton" fontSize="2vh" bkg="#FF002E" color="#FF002E" label={updating ? "[Attempting To Update Signatures]" : "Trust New Signature"}></Button>
                <Button onClick={props.onHideSigMismatchDialog} style={{ top: '86.882129278%', backgroundColor: '#00000000' }} className="settingsMenuButton" fontSize="2vh" color="#929292" label="Dismiss"></Button>
            </div>
        )
    } else {
        return '';
    }
}

export default SignatureMismatchDialog;