
import Button from '../components/Button.js'
import Label from '../components/Label.js'
import MsgTypeImgDeco from '../components/MsgTypeImgDeco.js'
import MsgTypeLocationDeco from '../components/MsgTypeLocationDeco.js'
import MsgTypeColorDeco from '../components/MsgTypeColorDeco.js'
import { useState } from 'react'


function MessageTypeSelector(props) {
    const [extended, setExtended] = useState(false);

    return (
        <div className="msgTypeSelector" style={{ left: extended ? '1.388888889%' : '-73.111111111%' }}>
            <Button onClick={() => setExtended(prev => !prev)} className="msgTypeSelectorExpand" fontSize="3.2vh" width="13.548387097%" height="100%" style={{ left: '86.451612903%', border: 'none', backdropFilter: 'blur(5px)', borderRadius: extended ? '5px 5px 5px 5px' : '0px 5px 5px 0px' }} label={extended ? '×' : "+"} bkg={props.ghost ? "#0500FF" : "#6100DC"} color={props.ghost ? "#FFF" : "#A055FF"}></Button>
            <Button child={<><Label style={{ left: '8.641975309%' }} fontSize="1.7vh" color="#BDBDBD" text="Image"></Label><MsgTypeImgDeco left="65%" /></>} className="msgType" fontSize="1.8vh" width="26.129032258%" height="100%" style={{ left: '2.258064516%', border: 'none', backdropFilter: 'blur(5px)' }} label="Image" bkg={props.ghost ? "#0500FF" : "#6100DC"} color="#BDBDBD"></Button>
            <Button child={<><Label style={{ left: '8.641975309%' }} fontSize="1.7vh" color="#BDBDBD" text="Location"></Label><MsgTypeLocationDeco left="65%" /></>} className="msgType" fontSize="1.8vh" width="26.129032258%" height="100%" style={{ left: '30.322580645%', border: 'none', backdropFilter: 'blur(5px)' }} label="Location" bkg={props.ghost ? "#0500FF" : "#6100DC"} color={props.ghost ? "#FFF" : "#A055FF"}></Button>
            <Button onClick={() => {props.onTypeSelected('color'); setExtended(prev => !prev);}} child={<><Label style={{ left: '8.641975309%' }} fontSize="1.7vh" color="#BDBDBD" text="Color"></Label><MsgTypeColorDeco left="61%" /></>} className="msgType" fontSize="1.8vh" width="26.129032258%" height="100%" style={{ left: '58.387096774%', border: 'none', backdropFilter: 'blur(5px)' }} label="Color" bkg={props.ghost ? "#0500FF" : "#6100DC"} color="#BDBDBD"></Button>
        </div>
    )
}


export default MessageTypeSelector;