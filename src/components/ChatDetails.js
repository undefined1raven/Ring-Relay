import Barcode from 'react-barcode';
import Label from '../components/Label.js'
import Button from '../components/Button.js'
import HorizontalLine from '../components/HorizontalLine.js'


function ChatDetails(props) {

    const txDate = new Date(props.tx);

    return (<>
        <Label color="#FFF" bkg="#6100DC30" fontSize="2vh" className="convoDetailsLabel" style={{ top: '17.5%', height: '6.71875%' }} text={`Conversation started on ${txDate.getDate().toString().padStart(2, '0')}.${(parseInt(txDate.getMonth()) + 1).toString().padStart(2, '0')}.${txDate.getFullYear().toString().padEnd(2, '0')}`}></Label>
        <Button style={{ top: '26.5625%' }} label="Backup Conversation [Coming Soon]" className="convoDetailsButton" color="#7100FF" bkg="#6100DC"></Button>
        <Button style={{ top: '35.625%' }} label="Delete Conversation" className="convoDetailsButton" color="#FF002E" bkg="#FF002E"></Button>
        <HorizontalLine className="convoDetailsLn" top="45.3125%" width="90%" color="#7100FF"></HorizontalLine>
        <Button style={{ top: '48.4375%' }} label="Enter Ghost Mode [Coming Soon]" className="convoDetailsButton" color="#7100FF" bkg="#6100DC"></Button>
        <Label color="#FFF" bkg="#6100DC30" fontSize="1.6vh" className="convoDetailsLabel" style={{ top: '56.71875%', height: '9.0625%' }} text="Use the real-time buffer to send/receive messages without them ever being permanently stored. Exiting the chat or quitting the app resets the buffer"></Label>
        <HorizontalLine className="convoDetailsLn" top="68.75%" width="97.5%" color="#7100FF"></HorizontalLine>
        <div style={{ top: '71.875%', backgroundColor: '#FF002E10' }} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text="Conversation Signature" className="sigIDLabel"></Label>
            <Label color="#FF002E" bkg="#FF002E30" fontSize="1.8vh" text="Invalid SIG" className="sigStatusLabel"></Label>
            <Label color="#FF002E" bkg="#FF002E30" fontSize="1.8vh" text="UNKNOWN" className="sigActualLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize="0" width={1} height="30%" marginTop="18%" text="" lineColor="#FF002EDD" background='#29005C00' value='-UNKNOWN-'></Barcode>
            </div>
        </div>
        <div style={{ top: '81.40625%', backgroundColor: '#00FF8510' }} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text="Remote Signing PubKey" className="sigIDLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text="Verified" className="sigStatusLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text={props.remoteSigningKeySig.ini ? props.remoteSigningKeySig.sig : 'UNKNWON'} className="sigActualLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize="0" width={1} height="30%" marginTop="18%" text="" lineColor="#00FF85DD" background='#29005C00' value={props.remoteSigningKeySig.ini ? props.remoteSigningKeySig.sig : 'UNKNWON'}></Barcode>
            </div>
        </div>
        <div style={{ top: '90.9375%', backgroundColor: '#00FF8510' }} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text="Remote Encryption PubKey" className="sigIDLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text="Verified" className="sigStatusLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text={props.remoteEncryptionKeySig.ini ? props.remoteEncryptionKeySig.sig : 'UNKNWON'} className="sigActualLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize="0" width={1} height="30%" marginTop="18%" text="" lineColor="#00FF85DD" background='#29005C00' value={props.remoteEncryptionKeySig.ini ? props.remoteEncryptionKeySig.sig : 'UNKNWON'}></Barcode>
            </div>
        </div>
    </>)
}
export default ChatDetails;