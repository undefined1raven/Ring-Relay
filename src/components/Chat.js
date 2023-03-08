
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
import { pemToKey, encryptMessage, decryptMessage, getKeyPair, keyToPem, JSONtoKey } from '../fn/crypto.js'
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
    const [msgArray, setMsgArray] = useState({ ini: false, array: [] });
    const [msgList, setMsgList] = useState(0);
    const [IH, setIH] = useState(window.innerHeight);
    const [remotePublicKeyJSON, setRemotePublicKeyJSON] = useState(0);
    const [msgCount, setMsgCount] = useState(100)

    const onInputFocus = () => {
        setScrollToY(30000);
    }


    const onSend = () => {
        if (newMessageContents.length > 0) {
            setMsgListscrollToY(30000);
            setNewMessageContents('');
            window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`PUBK-${props.chatObj.uid}`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(remotePubkey => {
                window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`OWN-PUBK`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(ownPubkey => {
                    console.log(remotePubkey)
                    encryptMessage(remotePubkey, newMessageContents).then(remoteCipher => {
                        encryptMessage(ownPubkey, newMessageContents).then(ownCipher => {
                            axios.post(`${DomainGetter('prodx')}api/dbop?messageSent`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), targetUID: props.chatObj.uid, ownContent: ownCipher.base64, remoteContent: remoteCipher.base64, type: 'tx', tx: Date.now(), auth: true, seen: false, liked: false }).then(res => { })
                        })
                    })
                });
            });
        }
    }

    let msgArrBatch = [];
    const addMsgToMsgArr = (msgObj => {
        setMsgArray({ ini: true, array: [...msgArray.array, msgObj] });
        msgArrBatch.push(msgObj);
        console.log(msgArrBatch)
        if (msgArrBatch[msgArrBatch.length - 1]['end']) {
            msgArrBatch.pop();
            setMsgArray({ ini: true, array: [...msgArray.array, ...msgArrBatch] })
        }
    });

    useEffect(() => {
        if (!msgArray.ini && props.visible) {
            axios.post(`${DomainGetter('prodx')}api/dbop?getMessages`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), targetUID: props.chatObj.uid, count: msgCount }).then(res => {
                if (res.data.error == undefined) {
                    let privateKeyID = localStorage.getItem('PKGetter');
                    let rawMsgArr = res.data.messages;
                    pemToKey(localStorage.getItem(privateKeyID)).then(privateKey => {
                        for (let ix = 0; ix < rawMsgArr.length; ix++) {
                            let rawMsg = res.data.messages[ix];
                            if (rawMsgArr[ix].type == 'tx') {
                                decryptMessage(privateKey, rawMsgArr[ix].ownContent, 'base64').then(plain => {
                                    addMsgToMsgArr({ liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen })
                                    if (ix == rawMsgArr.length - 1) {
                                        addMsgToMsgArr({ end: true });
                                    }
                                });
                            } else {
                                decryptMessage(privateKey, rawMsgArr[ix].remoteContent, 'base64').then(plain => {
                                    addMsgToMsgArr({ liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen });
                                    if (ix == rawMsgArr.length - 1) {
                                        addMsgToMsgArr({ end: true });
                                    }
                                });
                            }
                        }
                    }).catch(e => {
                        setMsgArray({ ini: true, array: res.data.messages });
                    })
                }

            });
            if (remotePublicKeyJSON == 0 && props.chatObj.uid != undefined) {
                axios.post(`${DomainGetter('prodx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: props.chatObj.uid }).then(res => {
                    localStorage.setItem(`PUBK-${props.chatObj.uid}`, res.data.publicKey);
                });
                axios.post(`${DomainGetter('prodx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: 'self' }).then(res => {
                    localStorage.setItem(`OWN-PUBK`, res.data.publicKey);
                });
            }
        }
        if (props.chatObj.status === 'Online') {
            setStatusProps({ color: '#00FF85' })
        } else {
            setStatusProps({ color: '#FF002E' })
        }
        setInterval(() => {
            setIH(window.innerHeight)
        }, 100);
        setMsgList(msgArray.array.map(x => <li key={x.tx + Math.random()}><Message msgObj={x}></Message></li>))

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