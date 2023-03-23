
import { useState } from 'react';
import Button from '../components/Button.js'
import Label from '../components/Label.js'
import MsgTypeImgDeco from '../components/MsgTypeImgDeco.js'
import MsgTypeLocationDeco from '../components/MsgTypeLocationDeco.js'
import MsgTypeColorDeco from '../components/MsgTypeColorDeco.js'


function MessageTypeSelector(props) {
    const [extended, setExtended] = useState(false);

    return (
        <div className="msgTypeSelector" style={{ left: extended ? '1.388888889%' : '-73.111111111%' }}>
            <Button onClick={() => setExtended(prev => { return !prev })} className="msgTypeSelectorExpand" fontSize="3.2vh" width="13.548387097%" height="100%" style={{ left: '86.451612903%', border: 'none', backdropFilter: 'blur(15px)' }} label={extended ? '×' : "+"} bkg="#6100DC" color="#A055FF"></Button>
            <Button child={<><Label style={{left: '8.641975309%'}} fontSize="1.7vh" color="#BDBDBD" text="Image"></Label><MsgTypeImgDeco left="65%"/></>} className="msgType" fontSize="1.8vh" width="26.129032258%" height="100%" style={{ left: '2.258064516%', border: 'none', backdropFilter: 'blur(15px)' }} label="Image" bkg="#6100DC" color="#BDBDBD"></Button>
            <Button child={<><Label style={{left: '8.641975309%'}} fontSize="1.7vh" color="#BDBDBD" text="Location"></Label><MsgTypeLocationDeco left="65%"/></>} className="msgType" fontSize="1.8vh" width="26.129032258%" height="100%" style={{ left: '30.322580645%', border: 'none', backdropFilter: 'blur(15px)' }} label="Location" bkg="#6100DC" color="#BDBDBD"></Button>
            <Button child={<><Label style={{left: '8.641975309%'}} fontSize="1.7vh" color="#BDBDBD" text="Color"></Label><MsgTypeColorDeco left="65%"/></>} className="msgType" fontSize="1.8vh" width="26.129032258%" height="100%" style={{ left: '58.387096774%', border: 'none', backdropFilter: 'blur(15px)' }} label="Color" bkg="#6100DC" color="#BDBDBD"></Button>
        </div>
    )
}


export default MessageTypeSelector;