
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import VerticalLine from '../components/VerticalLine.js'
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import { useEffect, useState } from 'react'
import NotAuthedMsgDeco from '../components/NotAuthedMsgDeco.js'
import MsgTXDeco from '../components/MsgTXDeco.js'
import MsgRXDeco from '../components/MsgRXDeco.js'
import AuthedMsgDeco from '../components/AuthedMsgDeco.js'
import MsgLikedDeco from '../components/MsgLikedDeco.js'




function Message(props) {
    const [liked, setLiked] = useState(props.msgObj.liked);


    function useSingleAndDoubleClick(actionSimpleClick, actionDoubleClick, delay = 250) {//thx stackoverflow
        const [click, setClick] = useState(0);
    
        useEffect(() => {
            const timer = setTimeout(() => {
                // simple click
                if (click === 1) actionSimpleClick();
                setClick(0);
            }, delay);
    
            // the duration between this click and the previous one
            // is less than the value of delay = double-click
            if (click === 2) actionDoubleClick();
    
            return () => clearTimeout(timer);
            
        }, [click]);
    
        return () => setClick(prev => prev + 1);
    }

    const onDoubleClick = () => {
        setLiked(!liked)
    }

    const onMsgClick = useSingleAndDoubleClick(() => {}, onDoubleClick)

    return (
        <div>
            <Label onClick={(e) => onMsgClick(e)} className="msgContainer" color={props.msgObj.type == 'rx' ? '#FFF' : '#863DFF'} text={props.msgObj.content} fontSize="4.5vw" bkg="#6100DC20" child={
                <div>
                    <Label className="msgTime" bkg="#55007340" color="#8300B0" text={`${new Date(props.msgObj.tx).getHours().toString().padStart(2, '0')}:${new Date(props.msgObj.tx).getMinutes().toString().padStart(2, '0')}`} fontSize="2.5vw"></Label>
                    {props.msgObj.secure ? <AuthedMsgDeco /> : <NotAuthedMsgDeco />}
                    {props.msgObj.type == 'rx' ? <MsgRXDeco /> : <MsgTXDeco />}
                    {props.msgObj.seen ? <Label fontSize="2.5vw" className="msgSeen" color="#8300B0" bkg="#55007340" text="Seen" /> : ''}
                    {liked ? <MsgLikedDeco /> : ''}
                </div>
            }></Label>
        </div>
    )
}

export default Message;