import Label from '../components/Label.js'
import NewContactMatchDeco from '../components/NewContactMatchDeco.js'


function NewContactMatchTile(props){
    return(
        <div className="newContactMatchTileContainer">
            <Label color="#FFF" className="newContactTileUsername" text={props.username}></Label>
            <Label className="newContactQID" color="#6300E0" text={props.qid}></Label>
            <NewContactMatchDeco></NewContactMatchDeco>
        </div>
    )
}

export default NewContactMatchTile;