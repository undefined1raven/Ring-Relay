
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
import CommonSigMismatchDeco from '../components/CommonSigMismatchDeco.js'
import SignatureVerificationFailedDeco from '../components/SignatureVerificationFailedDeco.js'
import SignatureVerificatioSuccessDeco from '../components/SignatureVerificationSuccessDeco.js'



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
        props.likeMessageUpdate({ state: !liked, MID: props.msgObj.MID });
    }

    const onMsgClick = useSingleAndDoubleClick(() => { }, onDoubleClick)

    const messageContentColorController = () => {
        if (props.decrypted) {
            return props.msgObj.type == 'rx' ? '#FFF' : '#9B5EFF';
        } else {
            return '#CA0024';
        }
    }

    return (
        <div>
            <Label onClick={(e) => onMsgClick(e)} className="msgContainer" color={messageContentColorController()} text={props.decrypted ? props.msgObj.content : '[Failed to decrypt]'} fontSize="4.5vw" bkg={props.decrypted ? "#6100DC20" : '#88001830'} style={{ borderLeft: `solid 1px ${props.decrypted ? '#7000FF' : '#E20028'}` }} child={
                props.decrypted ?
                    <div>
                        <Label className="msgTime" bkg="#55007340" color="#8300B0" text={`${new Date(parseInt(props.msgObj.tx)).getHours().toString().padStart(2, '0')}:${new Date(parseInt(props.msgObj.tx)).getMinutes().toString().padStart(2, '0')}`} fontSize="2.5vw"></Label>
                        {props.msgObj.auth ? <AuthedMsgDeco /> : <NotAuthedMsgDeco />}
                        {props.msgObj.type == 'rx' ? <MsgRXDeco /> : <MsgTXDeco />}
                        {props.msgObj.seen ? <Label fontSize="2.5vw" className="msgSeen" color="#8300B0" bkg="#55007340" text="Seen" /> : ''}
                        {liked ? <MsgLikedDeco /> : ''}
                        <div className='chashContainer'>
                            <CommonSigMismatchDeco className="chashIndi"></CommonSigMismatchDeco>
                            <Label fontSize="2.5vw" className="chashLabel" color="#FF002E" text="inad2" />
                        </div>
                        <div className='signatureContainer'>
                            {props.msgObj.signed ? <SignatureVerificatioSuccessDeco className="sigIndi" /> : <SignatureVerificationFailedDeco className="sigIndi" />}
                            <Label fontSize="2.5vw" className="sigLabel" color={props.msgObj.signed ? "#00FFD1" : "#FF002E"} text={props.msgObj.signed ? 'Signed' : 'SIG Fail'} />
                        </div>
                    </div> : ''
            }></Label>
        </div>
    )
}

export default Message;