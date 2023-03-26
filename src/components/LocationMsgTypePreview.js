import Label from '../components/Label.js'
import Button from '../components/Button.js'
import MsgTypeLocationDeco from '../components/MsgTypeLocationDeco.js'


function LocationMsgTypePreview(props) {
    if (props.show) {
        return (
            <div className="locationMsgTypePreviewContainer" style={{ backgroundColor: props.bkg }}>
                <Label style={{ top: '55%', left: '23%' }} fontSize="1.9vh" text="Long" color={props.ghost ? "#0013BA" : "#6300E0"}></Label>
                <Label style={{ top: '55%', left: '50%' }} fontSize="1.9vh" text="Lat" color={props.ghost ? "#0013BA" : "#6300E0"}></Label>
                <Label style={{ top: '15%', left: '23%' }} fontSize="2.1vh" text={props.selectedLocation.ini ? parseFloat(props.selectedLocation.locationObj.long).toFixed(3).toString().substring(0, 7) : '[UNK]'} color="#FFF"></Label>
                <Label style={{ top: '15%', left: '50%' }} fontSize="2.1vh" text={props.selectedLocation.ini ? parseFloat(props.selectedLocation.locationObj.lat).toFixed(3).toString().substring(0, 7) : '[UNK]'} color="#FFF"></Label>
                <MsgTypeLocationDeco color={props.ghost ? "#0500FF" : "#8627FF"} style={{ width: '15vh', height: '10vh', left: '-10.8%', marginTop: '2.5%' }}></MsgTypeLocationDeco>
                <Button onClick={props.onCancel} fontSize="3.4vh" color="#929292" bkg="#929292" width="4.8vh" height="4.8vh" style={{ left: '83%', borderRadius: '5px', backgroundColor: '#00000000' }} label="×"></Button>
            </div>
        )
    } else {
        return '';
    }
}

export default LocationMsgTypePreview;