
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import VerticalLine from '../components/VerticalLine.js'
import Button from '../components/Button.js'
import BackDeco from '../components/BackDeco.js'
import Message from '../components/Message.js'
import { useEffect, useState } from 'react'
import axios from 'axios';
import DomainGetter from '../fn/DomainGetter.js'
import { pemToBuffer, encryptMessage, decryptMessage } from '../fn/crypto.js'
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
    const [remotePublicKeyJSON, setRemotePublicKeyJSON] = useState(0);


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
        if (remotePublicKeyJSON == 0 && props.chatObj.uid != undefined) {
            axios.post(`${DomainGetter('prodx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: props.chatObj.uid }).then(res => {
                window.crypto.subtle.importKey('jwk', JSON.parse(res.data.publicKey), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(pubkey => {
                    let piupk = '-----BEGIN PRIVATE KEY-----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-----END PRIVATE KEY-----'
                    //the key above is for testing purposes only
                    window.crypto.subtle.importKey('pkcs8', pemToBuffer(piupk), {name: 'RSA-OAEP', hash: 'SHA-256'}, true, ['decrypt']).then(privateKey => {
                        encryptMessage(pubkey, 'MCRN Command').then(cipher => {
                            decryptMessage(privateKey, cipher.buffer, 'buffer').then(plain => {
                                console.log(plain)
                            })
                        })
                    })
                })
            })
        }
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