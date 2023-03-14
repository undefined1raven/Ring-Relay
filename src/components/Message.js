
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
    const [deleted, setDeleted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);


    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (e.target.innerText != 'Delete') {
                setShowMenu(false)
            }
        })
    }, [])

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
            if (click === 2 && !showMenu) actionDoubleClick();

            return () => clearTimeout(timer);

        }, [click]);

        return () => setClick(prev => prev + 1);
    }

    const onDoubleClick = () => {
        setLiked(!liked)
        props.likeMessageUpdate({ state: !liked, MID: props.msgObj.MID });
    }

    const onContextMenu = (e) => {
        e.preventDefault();
        if (!deleted) {
            setShowMenu(true)
        }
    }

    const msgContentController = () => {
        if (showMenu) {
            return '|';
        } else {
            if (deleted) {
                return '[Deleted]';
            } else if (props.decrypted) {
                return props.msgObj.content;
            } else {
                return '[Failed to decrypt]';
            }
        }
    }

    const onCopy = () => {
        navigator.clipboard.writeText(props.msgObj.content).then(r => { })
    }

    const onDelete = () => {
        if (props.msgObj.type == 'tx') {
            setDeleted(true)
            setShowMenu(false)
            props.deleteMessage(props.msgObj.MID);
        }
    }

    const onMsgClick = useSingleAndDoubleClick(() => { }, onDoubleClick)

    const menuController = () => {
        if (showMenu) {
            return (
                <>
                    <Button onClick={onDelete} color={props.msgObj.type == 'tx' ? "#FF002E" : '#999'} className="msgDeleteButton" bkg={props.msgObj.type == 'tx' ? "#FF002E" : ''} label="Delete"></Button>
                    <Button onClick={onCopy} color="#7100FF" className="msgCopyButton" bkg="#7100FF" label="Copy"></Button>
                    {/* <VerticalLine height="2.3vh" color="#6100DC40" left="50%" top="7vh" /> */}
                </>
            )
        } else {
            return (
                <>
                    <Label className="msgTime" bkg="#55007340" color="#8300B0" text={`${new Date(parseInt(props.msgObj.tx)).getHours().toString().padStart(2, '0')}:${new Date(parseInt(props.msgObj.tx)).getMinutes().toString().padStart(2, '0')}`} fontSize="2.5vw"></Label>
                    {props.msgObj.auth ? <AuthedMsgDeco /> : <NotAuthedMsgDeco />}
                    {props.msgObj.type == 'rx' ? <MsgRXDeco /> : <MsgTXDeco />}
                    {props.msgObj.seen ? <Label fontSize="2.5vw" className="msgSeen" color="#8300B0" bkg="#55007340" text="Seen" /> : ''}
                    {(liked && !deleted) ? <MsgLikedDeco /> : ''}
                    <div className='chashContainer'>
                        <CommonSigMismatchDeco className="chashIndi"></CommonSigMismatchDeco>
                        <Label fontSize="2.5vw" className="chashLabel" color="#FF002E" text="inad2" />
                    </div>
                    <div className='signatureContainer'>
                        {(props.msgObj.signed == true || props.msgObj.signed == 'self' || props.msgObj.signed == 'local') ? <SignatureVerificatioSuccessDeco color={SignatureSuccessDecoColorHash[props.msgObj.signed]} className="sigIndi" /> : <SignatureVerificationFailedDeco className="sigIndi" />}
                        <Label fontSize="2.5vw" className="sigLabel" color={sigLabelHash[props.msgObj.signed]?.color} text={sigLabelHash[props.msgObj.signed]?.label} />
                    </div>
                    {/* <VerticalLine height="2.3vh" color="#6100DC40" left="50%" top="7vh" /> */}
                </>
            )
        }
    }

    const messageContentColorController = () => {
        if (props.decrypted) {
            return props.msgObj.type == 'rx' ? '#FFF' : '#9B5EFF';
        } else {
            return '#CA0024';
        }
    }


    const sigLabelHash = {
        local: { label: 'Local', color: '#7000FF' }, 'self': { label: 'OSIG', color: '#00FFD1' }, 'no_self': { label: 'OSIG_F', color: '#f39e00' }, true: { label: 'Signed', color: '#00FFD1' }, false: { label: 'SIG Fail', color: '#FF002E' }
    };
    const SignatureSuccessDecoColorHash = { 'self': '#00FFD1', true: '#00FFD1', 'local': '#7000FF' }

    return (
        <div>
            <Label onContextMenu={onContextMenu} onClick={(e) => onMsgClick(e)} className={`msgContainer ${props.className}`} color={messageContentColorController()} text={msgContentController()} fontSize="4.5vw" bkg={props.decrypted ? "#6100DC20" : '#88001830'} style={{ borderLeft: `solid 1px ${props.decrypted ? '#7000FF' : '#E20028'}` }} child={
                props.decrypted ?
                    <div>
                        {menuController()}
                    </div> : ''}
            ></Label>
        </div >
    )
}

export default Message;