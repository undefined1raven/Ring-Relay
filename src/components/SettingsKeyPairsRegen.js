import Label from './Label';
import Button from '../components/Button.js'
import Signature from '../components/Signature.js'
import KeysRegenDeco from '../components/KeysRegenDeco.js'



function SettingsKeyPairsRegen(props) {
    if (props.show) {
        return (
            <div>
                <Label text="Key Pairs Regeneration" fontSize="2vh" style={{ left: '5%', top: '18.625%' }} color="#FFF" bkg="#7000FF00"></Label>
                <Label text="If you suspect a device you authenticated has been compromised, regenerate your key pairs" fontSize="1.8vh" className="keysRegenLabel" style={{ width: '90%', top: '22.125%' }} color="#7000FF" bkg="#7000FF20"></Label>
                <Label text="Regenerating your key pair will make all current conversations unreadable and your contacts will not be able to verify your identity until they would accept the new key signatures" fontSize="1.8vh" className="keysRegenLabel" style={{ width: '90%', top: '32.65625%', height: '12.5%' }} color="#FF002E" bkg="#FF002E20"></Label>
                <div onClick={() => { }} id='exportIDButton' className='mainButton' style={{ border: 'solid 1px #FF001F', top: '47.0625%' }}>
                    <Label className="mainButtonLabel" text="Regenerate Key Pairs" color="#FF001F"></Label>
                    <KeysRegenDeco style={{ position: 'absolute', top: '-25%' }}></KeysRegenDeco>
                </div>
                <Signature top="80%"></Signature>
                <Signature top="70%"></Signature>
                <Button onClick={props.onBack} className="settingsMenuButton" style={{ top: '91.875%' }} fontSize="2.3vh" color="#929292" label="Back"></Button>
            </div>)
    } else {
        return '';
    }
}

export default SettingsKeyPairsRegen;