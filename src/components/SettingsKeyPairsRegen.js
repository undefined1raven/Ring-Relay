import Label from './Label';
import Button from '../components/Button.js'
import Signature from '../components/Signature.js'
import KeysRegenDeco from '../components/KeysRegenDeco.js'
import InputField from '../components/InputField.js'
import { getKeyPair, keyToPem, getSigningKeyPair } from '../fn/crypto.js';
import { useEffect, useState } from 'react';


function SettingsKeyPairsRegen(props) {
    const [input, setInput] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState('');
    const [hasNewKeys, setHasNewKeys] = useState({ ini: false, verificationSig: '', encryptionSig: '' });


    useEffect(() => {

        getKeyPair().then(keys => {
            getSigningKeyPair().then(signingKeys => {
                window.crypto.subtle.exportKey('jwk', signingKeys.publicKey).then(signingJWK => {
                    window.crypto.subtle.exportKey('jwk', keys.publicKey).then(encryptionJWK => {
                        setHasNewKeys({
                            ini: true,
                            verificationSig: `${signingJWK.x.substring(0, 4)}.${signingJWK.y.substring(signingJWK.y.length - 4, signingJWK.y.length)}`,
                            encryptionSig: `${encryptionJWK.n.substring(0, 4)}.${encryptionJWK.n.substring(encryptionJWK.n.length - 4, encryptionJWK.n.length)}`
                        })
                    })
                })
            })
        });
    }, [])

    if (props.show) {
        return (
            <>
                <div>
                    <Label text="Key Pairs Regeneration" fontSize="2vh" style={{ left: '5%', top: '18.625%' }} color="#FFF" bkg="#7000FF00"></Label>
                    <Label text="If you suspect a device you authenticated has been compromised or if you lost your private keys, regenerate your key pairs" fontSize="1.8vh" className="keysRegenLabel" style={{ width: '90%', top: '22.125%' }} color="#7000FF" bkg="#7000FF20"></Label>
                    {/* <Label text="Regenerating your key pairs will make all current conversations unreadable and your contacts will not be able to verify your identity until they would accept the new key signatures" fontSize="1.8vh" className="keysRegenLabel" style={{ width: '90%', top: '32.65625%', height: '12.5%' }} color="#FF002E" bkg="#FF002E20"></Label> */}
                    <div onClick={() => { setShowPasswordPrompt(true) }} id='exportIDButton' className='mainButton' style={{ border: 'solid 1px #FF001F', top: '40.0625%' }}>
                        <Label className="mainButtonLabel" text="Regenerate Key Pairs" color="#FF001F"></Label>
                        <KeysRegenDeco style={{ position: 'absolute', top: '-25%' }}></KeysRegenDeco>
                    </div>
                    <Signature sigLabel="Own Encryption Key" verified={'self'} valid={true} sig="xxsq.svg2" top="80%"></Signature>
                    <Signature sigLabel="Own SIG Verification Key" verified={'self'} valid={true} sig="xxsq.svg2" top="70%"></Signature>
                    <Button onClick={props.onBack} className="settingsMenuButton" style={{ top: '91.875%' }} fontSize="2.3vh" color="#929292" label="Back"></Button>
                </div>
                {showPasswordPrompt ?
                    <div className='keyPairsRegenPasswordConfirmation'>
                        <Label text="Regenerating your key pairs will make all current conversations unreadable and your contacts will not be able to verify your identity until they would accept the new key signatures" fontSize="1.8vh" className="keysRegenLabel" style={{ width: '90%', top: '14.0625%', height: '12.5%' }} color="#FF002E" bkg="#FF002E20"></Label>
                        <Signature sig2={hasNewKeys.encryptionSig} doubleSig={true} height="15%" sigLabel="Own Encryption Key" verified={'self'} valid={true} sig={props.ownKeySigs.encryptionSig} top="80%"></Signature>
                        <Button onClick={props.onBack} className="settingsMenuButton" style={{ top: '50.625%' }} fontSize="2.3vh" color="#FF002E" bkg="#FF002E20" label="Regen Key Pairs"></Button>
                        <Signature sig2={hasNewKeys.verificationSig} doubleSig={true} height="15%" sigLabel="Own SIG Verification Key" verified={'self'} valid={true} sig={props.ownKeySigs.verificationSig} top="70%"></Signature>
                        <Label className="passPromptLabel" text="Password" color="#9948FF" style={{ top: '32.34375%' }}></Label>
                        <InputField type="password" id="passInput" style={{ top: '36.5625%' }} color="#6300E0" onChange={(e) => setInput(e.target.value)} value={input}></InputField>
                        <Button onClick={() => { setShowPasswordPrompt(false) }} className="settingsMenuButton" style={{ top: '91.875%' }} fontSize="2.3vh" color="#929292" label="Cancel"></Button>
                    </div>
                    : ''}
            </>)
    } else {
        return '';
    }
}

export default SettingsKeyPairsRegen;