
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import VerticalLine from '../components/VerticalLine.js'
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import Message from '../components/Message.js'
import { useEffect, useState } from 'react'
import axios from 'axios';

function Chat(props) {
    const [statusProps, setStatusProps] = useState({ color: '#FF002E' });
    const [scrollToY, setScrollToY] = useState(0);
    const [msgListscrollToY, setMsgListscrollToY] = useState(0);
    const [newMessageContents, setNewMessageContents] = useState('');
    const [msgArray, setMsgArray] = useState([{ liked: false, seen: false, content: 'MCRN Command is go for strike on Medina Station at 924:532:44 SSTO. Please relay orders to Ring Fleet Command and await further tactical details', secure: true, tx: Date.now(), type: 'rx' },
    { liked: false, seen: false, content: 'no not really', secure: false, tx: Date.now(), type: 'tx' }]);
    const [msgList, setMsgList] = useState(0);
    const [IH, setIH] = useState(window.innerHeight);


    const onInputFocus = () => {
        setScrollToY(30000);
    }

    const onSend = () => {
        if (newMessageContents.length > 0) {
            setMsgArray([...msgArray, { liked: false, seen: Math.random() < .5 ? false : true, content: newMessageContents, type: 'tx', tx: Date.now(), secure: Math.random() < .5 ? false : true }]);
            setMsgListscrollToY(30000);
            setNewMessageContents('');
        }
    }

    useEffect(() => {
        if (props.chatObj.status === 'Online') {
            setStatusProps({ color: '#00FF85' })
        } else {
            setStatusProps({ color: '#FF002E' })
        }
        setInterval(() => {
            setIH(window.innerHeight)
        }, 100);
        setMsgList(msgArray.map(x => <li key={x.tx + Math.random()}><Message msgObj={x}></Message></li>))

        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
        }, 50);

    }, [props, scrollToY, msgArray, msgListscrollToY])

    if (props.show) {
        return (
            <div className="chatContainer">
                <div className='chatHeader'>
                    <div className='chatHeaderBkg'></div>
                    <Button onClick={props.onBackButton} id="chatHeaderBackButton" bkg="#7000FF" width="9.428571429%" height="100%" child={<BackDeco color="#7000FF" />}></Button>
                    <Label className="chatHeaderName" color="#FFF" fontSize="1.9vh" text={props.chatObj.name}></Label>
                    <Label className="chatHeaderStatus" color={statusProps.color} fontSize="1.9vh" text={props.chatObj.status} bkg={`${statusProps.color}20`} style={{ borderLeft: 'solid 1px' + statusProps.color }}></Label>
                    <Label className="chatCardStatusLast" fontSize="1.2vh" color={statusProps.color} text={props.chatObj.since}></Label>
                </div>
                <div className='chatInput'>
                    <InputField value={newMessageContents} onChange={(e) => setNewMessageContents(e.target.value)} fieldID="msgInputActual" onFocus={onInputFocus} type="text" id="msgInput" color="#7000FF"></InputField>
                    <Button onClick={onSend} id="sendButton" bkg="#7000FF" width="20%" height="100%" color="#7000FF" label="Send"></Button>
                </div>
                <ul id="msgsList" className='msgsList'>
                    {msgList}
                </ul>
            </div>
        )
    } else {
        return '';
    }
}

export default Chat;