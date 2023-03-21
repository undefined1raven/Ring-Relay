import Barcode from 'react-barcode';
import Label from '../components/Label.js'
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Signature from '../components/Signature.js'


function ChatDetails(props) {

    const txDate = new Date(props.tx);

    return (<>
        <Label color="#FFF" bkg="#6100DC30" fontSize="2vh" className="convoDetailsLabel" style={{ top: '17.5%', height: '6.71875%' }} text={`Conversation started on ${txDate.getDate().toString().padStart(2, '0')}.${(parseInt(txDate.getMonth()) + 1).toString().padStart(2, '0')}.${txDate.getFullYear().toString().padEnd(2, '0')}`}></Label>
        <Button style={{ top: '26.5625%' }} label="Backup Conversation [Coming Soon]" className="convoDetailsButton" color="#7100FF" bkg="#6100DC"></Button>
        <Button style={{ top: '35.625%' }} label="Delete Conversation" className="convoDetailsButton" color="#FF002E" bkg="#FF002E"></Button>
        <HorizontalLine className="convoDetailsLn" top="45.3125%" width="90%" color="#7100FF"></HorizontalLine>
        <Button onClick={props.ghostModeToggle} style={{ top: '48.4375%' }} label={props.ghost ? 'Disable Ghost Mode' : 'Enable Ghost Mode'} className="convoDetailsButton" color="#7100FF" bkg="#6100DC"></Button>
        <Label color="#FFF" bkg="#6100DC30" fontSize="1.8vh" className="convoDetailsLabel" style={{ top: '56.71875%', height: '9.0625%' }} text="Use the real-time buffer to send/receive messages without them being permanently stored. Messages in this mode will appear ghosty."></Label>
        <HorizontalLine className="convoDetailsLn" top="68.75%" width="97.5%" color="#7100FF"></HorizontalLine>

        <Signature sigLabel="Conversation Signature" valid={props.conversationSig.ini && props.conversationSig.sig?.length == 9} verified={props.conversationSig.verified} sig={props.conversationSig.sig} top="71.875%"></Signature>
        <Signature sigLabel="Remote SIG Verification Key" valid={props.remoteSigningKeySig.ini & props.remoteSigningKeySig.sig?.length == 9} verified={true} sig={props.remoteSigningKeySig.sig} top="81.40625%"></Signature>
        <Signature sigLabel="Remote Encryption Key" valid={props.remoteEncryptionKeySig.ini & props.remoteEncryptionKeySig.sig?.length == 9} verified={true} sig={props.remoteEncryptionKeySig.sig} top="90.9375%"></Signature>
    </>)
}
export default ChatDetails;