import Label from '../components/Label.js'
import NewContactMatchDeco from '../components/NewContactMatchDeco.js'
import MsgTXDeco from '../components/MsgTXDeco.js'
import MsgRXDeco from '../components/MsgRXDeco.js'


function NewContactMatchTile(props) {
    const RequestTypeController = () => {
        if (props.type != undefined) {
            if (props.type == 'Pending.TX') {
                return <MsgTXDeco></MsgTXDeco>
            } else {
                return <MsgRXDeco></MsgRXDeco>
            }
        }
    }
    if (props.qid != localStorage.getItem('PKGetter')) {
        return (
            <div onClick={props.onClick} className="newContactMatchTileContainer">
                <Label color="#FFF" className="newContactTileUsername" text={props.username}></Label>
                <Label className="newContactQID" color="#6300E0" text={props.qid}></Label>
                <NewContactMatchDeco></NewContactMatchDeco>
                {RequestTypeController()}
            </div>
        )
    }else{
        return '';
    }
}

export default NewContactMatchTile;