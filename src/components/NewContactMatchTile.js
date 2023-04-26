import Label from '../components/Label.js'
import NewContactMatchDeco from '../components/NewContactMatchDeco.js'
import MsgTXDeco from '../components/MsgTXDeco.js'
import MsgRXDeco from '../components/MsgRXDeco.js'


function NewContactMatchTile(props) {
    const RequestTypeController = () => {

    }
    if (props.qid != localStorage.getItem('PKGetter')) {
        return (
            <div onClick={props.onClick} className="newContactMatchTileContainer">
                <Label color="#FFF" className="newContactTileUsername" text={props.username}></Label>
                <Label className="newContactQID" color="#A055FF" text={props.qid}></Label>
                <NewContactMatchDeco></NewContactMatchDeco>
                {props.type == 'Pending.TX' ? <MsgTXDeco bkg="#6100DC" opacity="0.3" color="#A055FF"></MsgTXDeco> : ''}
                {props.type == 'Pending.RX' ? <MsgRXDeco bkg="#6100DC" opacity="0.3" color="#A055FF"></MsgRXDeco> : ''}
            </div>
        )
    }else{
        return '';
    }
}

export default NewContactMatchTile;