
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import VerticalLine from '../components/VerticalLine.js'
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import Message from '../components/Message.js'
import { useEffect, useState } from 'react'
import axios from 'axios';
// import { initializeApp } from "firebase/app";
// import { getDatabase, get, ref, onValue } from "firebase/database";
// import { getAuth, signInWithCustomToken } from "firebase/auth";


// const firebaseConfig = {};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// // Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// const auth = getAuth();
// signInWithCustomToken(auth, '')
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ...
//   });

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
            // axios.post('https://ring-relay-api-prod.vercel.app/api/dbop?demo=0', {msgObj: {uid: localStorage.getItem('uid'), content: newMessageContents, type: 'tx', tx: Date.now(), secure: true, seen: false, liked: false}}).then(res => {console.log(res)})
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

        // onValue(ref(database, `messageBuffer/${uid}`), (snap) => {
        //     let data = snap.val();
        //     let newMsgArr = []
        //     for(let key in data){
        //         newMsgArr.push({...data[key]})
        //     }
        //     if(msgArray.length != newMsgArr.length){
        //         setMsgArray(newMsgArr);
        //     }
        // })

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
                    <InputField autoComplete="off" value={newMessageContents} onChange={(e) => setNewMessageContents(e.target.value)} fieldID="msgInputActual" onFocus={onInputFocus} type="text" id="msgInput" color="#7000FF"></InputField>
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