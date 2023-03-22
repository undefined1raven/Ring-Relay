import Label from '../components/Label.js'
import VerticalLine from '../components/VerticalLine.js'
import NewMsgsDeco from '../components/NewMsgsDeco.js'
import { useEffect, useState } from 'react'

function ChatCard(props) {
    const [msgCountLabelProps, setMsgCountLabelProps] = useState({ top: 'auto', text: 'No New Messages', color: '#6600E8' });
    const [msgCountDecoColor, setMsgCountDecoColor] = useState('#8D33FF');
    const [statusProps, setStatusProps] = useState({ color: '#FF002E' });

    const setUIState = () => {
        if (props.obj.msg != -1) {
            if (props.obj.msg > 0) {
                setMsgCountLabelProps({ top: '10%', text: `${props.obj.msg}${props.obj.msg >= 10 ? '+' : ''} new messages`, color: '#A966FF' })
            } else {
                setMsgCountLabelProps({ top: 'auto', text: 'No New Messages', color: '#6600E8' });
            }
        } else {
            setMsgCountLabelProps({ top: 'auto', text: `Checking ▣`, color: '#001AFF' })
        }
        if (props.obj.status === 'Online') {
            setStatusProps({ color: '#00FF85' })
        } else if (props.obj.status == 'Offline') {
            setStatusProps({ color: '#FF002E' })
        } else if (props.obj.status == '▣') {
            setStatusProps({ color: '#001AFF' })
        }
    }

    useEffect(() => {
        var interval = false;
        setUIState()
        if (props.obj.msg > 0) {
            interval = setInterval(() => {
                setMsgCountLabelProps({ top: '10%', text: `${props.obj.msg}${props.obj.msg >= 10 ? '+' : ''} new messages`, color: '#A966FF' })
                setMsgCountDecoColor('#8D33FF');
                setTimeout(() => {
                    setMsgCountLabelProps({ top: '10%', text: `${props.obj.msg}${props.obj.msg >= 10 ? '+' : ''} new messages`, color: '#D4B2FF' })
                    setMsgCountDecoColor('#D4B2FF');
                }, 750);
            }, 1500);
        }
        return () => interval ? clearInterval(interval) : 0;
    }, [props.obj.msg])

    return (
        <div className="chatCard">
            <VerticalLine top="0%" left="0%" height="100%" color={props.obj.msg == -1 ? '#001AFF' : '#7000FF'}></VerticalLine>
            <div style={{ position: 'absolute', left: '2.285714286%', borderLeft: `solid 1px ${props.obj.msg == -1 ? '#001AFF' : '#7000FF'}`, width: '83.428571429%', height: "100%", backgroundColor: `${props.obj.msg == -1 ? '#001AFF20' : '#6100DC40'}` }}></div>
            <Label color="#FFF" fontSize="2.1vh" className="chatCardName" text={props.obj.name}></Label>
            <div className='msgCountContainer'>
                <Label style={{ top: msgCountLabelProps.top }} className="chatCardMsgCount" color={msgCountLabelProps.color} fontSize="1.6vh" text={msgCountLabelProps.text}></Label>
                <NewMsgsDeco show={props.obj.msg > 0} color={msgCountDecoColor}></NewMsgsDeco>
            </div>
            <Label className="chatCardStatus" fontSize="1.8vh" color={statusProps.color} text={props.obj.status} bkg={`${statusProps.color}20`} style={{ borderLeft: `solid 1px ${statusProps.color}` }}></Label>
            <Label className="chatCardStatusLast" fontSize="1.2vh" color={statusProps.color} text={props.obj.since}></Label>
        </div>
    )
}

export default ChatCard;