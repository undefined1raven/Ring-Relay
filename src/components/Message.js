
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
import MsgGhost from '../components/MsgGhost.js'


function Message(props) {
    const [liked, setLiked] = useState(props.msgObj.liked);
    const [deleted, setDeleted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [ghost, setGhost] = useState(false);

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (e.target.innerText != 'Delete') {
                setShowMenu(false)
            }
        })
        if (props.msgObj.ghost != undefined) {
            setGhost(props.msgObj.ghost)
        }
    }, [])


    useEffect(() => {
        setLiked(props.msgObj.liked)
    }, [props.msgObj])

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
        // setLiked(!liked)
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
    const msgDateUnix = new Date(parseInt(props.msgObj.tx)).toLocaleString();
    const msgDateLocal = new Date(msgDateUnix);
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
                    <Label className="msgTime" bkg={ghost ? '#0500FF50' : "#55007340"} color={ghost ? '#FFF' : "#8300B0"} text={`${msgDateLocal.getHours().toString().padStart(2, '0')}:${msgDateLocal.getMinutes().toString().padStart(2, '0')}`} fontSize="2.5vw"></Label>
                    {props.msgObj.auth ? <AuthedMsgDeco ghost={ghost} /> : <NotAuthedMsgDeco />}
                    {props.msgObj.type == 'rx' ? <MsgRXDeco ghost={ghost} /> : <MsgTXDeco ghost={ghost} />}
                    {ghost ? <MsgGhost /> : ''}
                    {(props.msgObj.seen && props.msgObj.type == 'tx') ? <Label fontSize="2.5vw" className="msgSeen" color={ghost ? '#0500FF' : "#8300B0"} bkg={ghost ? '#0500FF20' : "#55007340"} text="Seen" /> : ''}
                    {(liked && !deleted) ? <MsgLikedDeco /> : ''}
                    <div className='chashContainer'>
                        <CommonSigMismatchDeco className="chashIndi"></CommonSigMismatchDeco>
                        <Label fontSize="2.5vw" className="chashLabel" color="#FF002E" text="inad2" />
                    </div>
                    <div className='signatureContainer'>
                        {(props.msgObj.signed == true || props.msgObj.signed == 'self' || props.msgObj.signed == 'local') ? <SignatureVerificatioSuccessDeco color={SignatureSuccessDecoColorHash[props.msgObj.signed]} className="sigIndi" /> : <SignatureVerificationFailedDeco className="sigIndi" />}
                        <Label fontSize="2.5vw" className="sigLabel" color={sigLabelHash[props.msgObj.signed]?.color} text={sigLabelHash[props.msgObj.signed]?.label} />
                    </div>
                    <Label className="msgDate" bkg={ghost ? '#0500FF50' : "#55007350"} color={ghost ? '#FFF' : "#8300B0"} text={`${msgDateLocal.getDate().toString().padStart(2, '0')}.${(parseInt(msgDateLocal.getMonth()) + 1).toString().padStart(2, '0')} [${msgDateLocal.getFullYear().toString().substring(2, 4)}]`} fontSize="2.5vw"></Label>
                    {/* <VerticalLine height="2.3vh" color="#6100DC40" left="50%" top="7vh" /> */}
                </>
            )
        }
    }

    const messageContentColorController = () => {
        if (props.decrypted) {
            if(ghost){
                return props.msgObj.type == 'rx' ? '#FFF' : '#4B47FF';
            }else{
                return props.msgObj.type == 'rx' ? '#FFF' : '#C09AFF';
            }
        } else {
            return '#CA0024';
        }
    }

    const messageBkgController = () => {
        if (props.decrypted) {
            if (ghost) {
                return '#0500FF20';
            } else {
                return '#6100DC20';
            }
        } else {
            return '#88001830';
        }
    }

    const messageBorderColorController = () => {
        if (props.decrypted) {
            if (ghost) {
                return '#0500FF';
            } else {
                return '#7000FF';
            }
        } else {
            return '#E20028';
        }
    }

    const sigLabelHash = {
        local: { label: 'Local', color: '#7000FF' }, 'self': { label: 'OSIG', color: '#00FFD1' }, 'no_self': { label: 'OSIG_F', color: '#f39e00' }, true: { label: 'Signed', color: '#00FFD1' }, false: { label: 'SIG Fail', color: '#FF002E' }
    };
    const SignatureSuccessDecoColorHash = { 'self': '#00FFD1', true: '#00FFD1', 'local': '#7000FF' }

    return (
        <div>
            <Label onContextMenu={onContextMenu} onClick={(e) => onMsgClick(e)} className={`msgContainer ${props.className}`} color={messageContentColorController()} text={msgContentController()} fontSize="4.5vw" bkg={messageBkgController()} style={{ borderLeft: `solid 1px ${messageBorderColorController()}` }} child={
                props.decrypted ?
                    <div>
                        {menuController()}
                    </div> : ''}
            ></Label>
        </div >
    )
}

export default Message;