
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
import { v4 } from 'uuid'

import { initializeApp } from "firebase/app";
import { getDatabase, remove, get, set, ref, onValue } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDgMwrGAEogcyudFXMuLRrC96xNQ8B9dI4",
    authDomain: "ring-relay.firebaseapp.com",
    databaseURL: "https://ring-relay-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ring-relay",
    storageBucket: "ring-relay.appspot.com",
    messagingSenderId: "931166613472",
    appId: "1:931166613472:web:a7ab26055d59cc2535c585"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

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
    const [MSUID, setMSUID] = useState('')
    const [chatLoadingLabel, setChatLoadingLabel] = useState({ label: '[Fetching Conversation]', opacity: 1 });
    const [failedMessageActionLabel, setFailedMessageActionLabel] = useState({ opacity: 0, label: 'Message Action Failed' })
    const [realtimeBuffer, setRealtimeBuffer] = useState([])
    const [realtimeBufferList, setRealtimeBufferList] = useState([])
    const [showRealtimeBuffer, setShowRealtimeBuffer] = useState(true)
    const onInputFocus = () => {
        setScrollToY(30000);
    }


    const decryptMessages = (rawMsgArr) => {
        let privateKeyID = localStorage.getItem('PKGetter');
        pemToKey(localStorage.getItem(privateKeyID)).then(privateKey => {
            for (let ix = 0; ix < rawMsgArr.length; ix++) {
                let rawMsg = rawMsgArr[ix];
                if (rawMsgArr[ix].type == 'tx') {
                    decryptMessage(privateKey, rawMsgArr[ix].ownContent, 'base64').then(plain => {
                        addMsgToMsgArr({ MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen })
                        if (ix == rawMsgArr.length - 1) {
                            addMsgToMsgArr({ end: true });
                        }
                    });
                } else {
                    decryptMessage(privateKey, rawMsgArr[ix].remoteContent, 'base64').then(plain => {
                        addMsgToMsgArr({ MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen });
                        if (ix == rawMsgArr.length - 1) {
                            addMsgToMsgArr({ end: true });
                        }
                    });
                }
            }
            setChatLoadingLabel({ opacity: 0, label: '[Decrypting Conversation]' });
        }).catch(e => {
            setMsgArray({ ini: true, array: rawMsgArr });
        })
    }

    const getMessagesAndUpdateChat = () => {
        setChatLoadingLabel({ opacity: 1, label: '[Fetching Conversation]' });
        axios.post(`${DomainGetter('prodx')}api/dbop?getMessages`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), targetUID: props.chatObj.uid, count: msgCount }).then(res => {
            if (res.data.error == undefined) {
                setChatLoadingLabel({ opacity: 1, label: '[Decrypting Conversation]' });
                let rawMsgArr = res.data.messages;
                setMSUID(res.data.MSUID);
                decryptMessages(rawMsgArr);
            }

        });
    }

    const onSend = () => {
        if (newMessageContents.length > 0) {
            setMsgListscrollToY(30000);
            setNewMessageContents('');
            window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`PUBK-${props.chatObj.uid}`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(remotePubkey => {
                window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`OWN-PUBK`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(ownPubkey => {
                    encryptMessage(remotePubkey, newMessageContents).then(remoteCipher => {
                        encryptMessage(ownPubkey, newMessageContents).then(ownCipher => {
                            let MID = `${v4()}-${v4()}`;
                            let nMsgObj = { targetUID: props.chatObj.uid, MID: MID, ownContent: ownCipher.base64, remoteContent: remoteCipher.base64, tx: Date.now(), auth: true, seen: false, liked: false }
                            set(ref(db, `messageBuffer/${props.chatObj.uid}/${MID}`), { ...nMsgObj });
                            set(ref(db, `messageBuffer/${props.ownUID}/${MID}`), { ...nMsgObj });
                            axios.post(`${DomainGetter('prodx')}api/dbop?messageSent`, {
                                AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), ...nMsgObj
                            }).then(res => { }).catch(e => {
                                setFailedMessageActionLabel({ opacity: 1, label: 'Failed to send message' });
                                setTimeout(() => {
                                    setFailedMessageActionLabel({ opacity: 0, label: 'Failed to send message' });
                                }, 2000);
                            })
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
        if (msgArrBatch[msgArrBatch.length - 1]['end']) {
            msgArrBatch.pop();
            setMsgArray({ ini: true, array: [...msgArray.array, ...msgArrBatch] })
            msgArrBatch = [];
        }
    });


    let RTmsgArrBatch = [];

    const RTaddMsgToMsgArr = (msgObj => {
        setRealtimeBuffer([...realtimeBuffer, msgObj]);
        RTmsgArrBatch.push(msgObj);
        if (RTmsgArrBatch[RTmsgArrBatch.length - 1]['end']) {
            RTmsgArrBatch.pop();
            setRealtimeBuffer([...realtimeBuffer, ...RTmsgArrBatch])
            RTmsgArrBatch = [];
        }
    });

    const likeMessageUpdate = (args) => {
        axios.post(`${DomainGetter('prodx')}api/dbop?likeMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), state: args.state, MID: args.MID, MSUID: MSUID }).then(resx => {

        }).catch(e => {
            setFailedMessageActionLabel({ opacity: 1 })
            setTimeout(() => {
                setFailedMessageActionLabel({ opacity: 0 })
            }, 2000);
        });
    }


    useEffect(() => {
        if (realtimeBuffer.length > 0) {
            setRealtimeBufferList(realtimeBuffer.map(x => <li key={x.tx + Math.random()}><Message likeMessageUpdate={likeMessageUpdate} msgObj={x}></Message></li>))
            setTimeout(() => {
                try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
            }, 50);
        }
    }, [realtimeBuffer])

    useEffect(() => {
        if (!msgArray.ini && props.visible) {
            msgArrBatch = [];
            remove(ref(db, `messageBuffer/${props.ownUID}`));
            getMessagesAndUpdateChat();
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
        setMsgList(msgArray.array.map(x => <li key={x.tx + Math.random()}><Message likeMessageUpdate={likeMessageUpdate} msgObj={x}></Message></li>))

        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
        }, 50);

        onValue(ref(db, `messageBuffer/${props.ownUID}`), (snap) => {
            let RXrealtimeBuffer = snap.val();
            setRealtimeBuffer([]);
            setRealtimeBufferList([]);
            RTmsgArrBatch = [];
            let RTrawMessagesArray = []
            for (let MID in RXrealtimeBuffer) {
                RTrawMessagesArray.push({ ...RXrealtimeBuffer[MID] });
            }
            RTrawMessagesArray.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) })
            for (let ix = 0; ix < RTrawMessagesArray.length; ix++) {
                if (RTrawMessagesArray[ix].targetUID == props.chatObj.uid || RTrawMessagesArray[ix].targetUID == props.ownUID) {
                    let privateKeyID = localStorage.getItem('PKGetter');
                    pemToKey(localStorage.getItem(privateKeyID)).then(privateKey => {
                        let rawMsg = RTrawMessagesArray[ix];
                        if (RTrawMessagesArray[ix].targetUID != props.ownUID) {
                            decryptMessage(privateKey, rawMsg.ownContent, 'base64').then(plain => {
                                setRealtimeBuffer((prevBuf) => {
                                    if (prevBuf.find(elm => elm.MID == rawMsg.MID) == undefined) {
                                        return [...prevBuf, { MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen }]
                                    } else {
                                        return [...prevBuf]
                                    }
                                })
                            })
                        } else {
                            decryptMessage(privateKey, rawMsg.remoteContent, 'base64').then(plain => {
                                setRealtimeBuffer((prevBuf) => {
                                    if (prevBuf.find(elm => elm.MID == rawMsg.MID) == undefined) {
                                        return [...prevBuf, { MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen }]
                                    } else {
                                        return [...prevBuf]
                                    }
                                })
                            });
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            }
        })
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
                    {realtimeBufferList}
                </ul>
                <Label className="chatLoadingStatus" fontSize="2.1vh" bkg="#001AFF30" color="#001AFF" text={chatLoadingLabel.label} style={{ opacity: chatLoadingLabel.opacity }}></Label>
                <Label className="failedMessageAction" fontSize="2.1vh" bkg="#FF002E30" color="#FF002E" text={failedMessageActionLabel.label} style={{ opacity: failedMessageActionLabel.opacity }}></Label>
            </div>
        )
    } else {
        return '';
    }
}

export default Chat;