import Barcode from 'react-barcode';
import Label from '../components/Label.js'


function ChatDetails(props) {
    return (<>
        <div style={{top: '71.875%'}} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text="Conversation Signature" className="sigIDLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text="Verified" className="sigStatusLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize="0" width="1" height="30%"  marginTop="18%" text="" lineColor="#00FF85" background='#29005C00' value='chsgd-vd3xj'></Barcode>
            </div>
        </div>
        <div style={{top: '81.40625%'}} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text="Remote Signing PubKey" className="sigIDLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text="Verified" className="sigStatusLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize="0" width="1" height="30%"  marginTop="18%" text="" lineColor="#00FF85" background='#29005C00' value='xqg4h-jt6d3'></Barcode>
            </div>
        </div>
        <div style={{top: '90.9375%'}} className='signature'>
            <Label color="#FFF" fontSize="1.9vh" text="Remote Encryption PubKey" className="sigIDLabel"></Label>
            <Label color="#00FF85" bkg="#00FF8530" fontSize="1.8vh" text="Verified" className="sigStatusLabel"></Label>
            <div className='sigcode'>
                <Barcode format='CODE128' fontSize="0" width="1" height="30%"  marginTop="18%" text="" lineColor="#00FF85" background='#29005C00' value='bafc4-61f42'></Barcode>
            </div>
        </div>
    </>)
}
export default ChatDetails;