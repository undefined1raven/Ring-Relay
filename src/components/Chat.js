
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
import { pemToKey, encryptMessage, decryptMessage, getKeyPair, keyToPem, JSONtoKey, sign, verify } from '../fn/crypto.js'
import { v4 } from 'uuid'

import { initializeApp } from "firebase/app";
import { getDatabase, remove, get, set, ref, onValue, update } from "firebase/database";
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


function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

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
    const [msgCount, setMsgCount] = useState(30)
    const [MSUID, setMSUID] = useState('')
    const [chatLoadingLabel, setChatLoadingLabel] = useState({ label: '[Fetching Conversation]', opacity: 1 });
    const [failedMessageActionLabel, setFailedMessageActionLabel] = useState({ opacity: 0, label: 'Message Action Failed' })
    const [realtimeBuffer, setRealtimeBuffer] = useState([])
    const [realtimeBufferList, setRealtimeBufferList] = useState([])
    const [msgListScrollLeft, setMsgListScrollLeft] = useState(0)
    const onInputFocus = () => {
        setScrollToY(30000);
    }

    let privateKeyID = localStorage.getItem('PKGetter');
    let publicSigningKeyJWK = JSON.parse(localStorage.getItem(`PUBSK-${props.chatObj.uid}`));

    const decryptMessages = (rawMsgArr) => {
        if (rawMsgArr.length > 0) {
            try {
                if (localStorage.getItem(`PUBSK-${props.chatObj.uid}`) != undefined) {
                    pemToKey(localStorage.getItem(privateKeyID)).then(privateKey => {
                        JSONtoKey(JSON.parse(localStorage.getItem('OWN-PUBSK')), 'ECDSA').then(ownPUBSK => {
                            window.crypto.subtle.importKey('jwk', publicSigningKeyJWK, { name: 'ECDSA', namedCurve: 'P-521' }, true, ['verify']).then(pubSigningKey => {
                                for (let ix = 0; ix < rawMsgArr.length; ix++) {
                                    let rawMsg = rawMsgArr[ix];
                                    if (rawMsgArr[ix].type == 'tx') {
                                        verify(ownPUBSK, rawMsg.remoteContent, rawMsg.signature).then(ownSigStatus => {
                                            decryptMessage(privateKey, rawMsgArr[ix].ownContent, 'base64').then(plain => {
                                                addMsgToMsgArr({ signed: (ownSigStatus) ? 'self' : 'no_self', MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen })
                                                if (ix == rawMsgArr.length - 1) {
                                                    addMsgToMsgArr({ end: true });
                                                }
                                            })
                                        });
                                    } else {
                                        verify(pubSigningKey, rawMsg.remoteContent, rawMsg.signature).then(sigStatus => {
                                            decryptMessage(privateKey, rawMsgArr[ix].remoteContent, 'base64').then(plain => {
                                                addMsgToMsgArr({ signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen });
                                                if (ix == rawMsgArr.length - 1) {
                                                    addMsgToMsgArr({ end: true });
                                                }
                                            });
                                        })
                                    }
                                }
                            }).catch(e => {
                                setMsgArray({ ini: true, array: rawMsgArr });
                            })
                        })
                    })
                }
            } catch (e) {
                for (let ix = 0; ix < rawMsgArr.length; ix++) {
                    let rawMsg = rawMsgArr[ix];
                    if (rawMsgArr[ix].type == 'tx') {
                        addMsgToMsgArr({ signed: 'UNK', MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: undefined, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen })
                        if (ix == rawMsgArr.length - 1) {
                            addMsgToMsgArr({ end: true });
                        }
                    } else {
                        addMsgToMsgArr({ signed: 'UNK', MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: undefined, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen });
                        if (ix == rawMsgArr.length - 1) {
                            addMsgToMsgArr({ end: true });
                        }
                    }
                }
            }

        } else {
            setChatLoadingLabel({ opacity: 1, label: '[No Messages]' })
        }
    }

    const getMessagesAndUpdateChat = () => {
        setChatLoadingLabel({ opacity: 1, label: '[Fetching Conversation]' });
        axios.post(`${DomainGetter('prodx')}api/dbop?getMessages`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), targetUID: props.chatObj.uid, count: msgCount }).then(res => {
            if (res.data['error'] == undefined) {
                setChatLoadingLabel({ opacity: 1, label: '[Decrypting Conversation]' });
                let rawMsgArr = res.data.messages;
                rawMsgArr.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) })
                setMSUID(res.data.MSUID);
                decryptMessages(rawMsgArr);
            }

        });
    }

    const onSend = () => {
        if (newMessageContents.length > 0) {
            setMsgListscrollToY(30000);
            setNewMessageContents('');
            let MID = `${v4()}-${v4()}`;
            let local_nMsgObj = { type: 'tx', signed: 'local', targetUID: props.chatObj.uid, MID: MID, content: newMessageContents, tx: Date.now(), auth: true, seen: false, liked: false }
            //add messages sent to the local realtime buffer. this improves the ux significantly while also maintaining the end-to-end encryption since this plain text message objects never hits the network
            setRealtimeBuffer((prevBuf) => {
                return [...prevBuf, { ...local_nMsgObj }]
            })

            window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`PUBK-${props.chatObj.uid}`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(remotePubkey => {
                window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`OWN-PUBK`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(ownPubkey => {
                    encryptMessage(remotePubkey, newMessageContents).then(remoteCipher => {
                        encryptMessage(ownPubkey, newMessageContents).then(ownCipher => {
                            pemToKey(localStorage.getItem(`SV-${localStorage.getItem('PKGetter')}`), 'ECDSA').then(signingPrivateKey => {
                                sign(signingPrivateKey, remoteCipher.base64).then(cipherSig => {
                                    let nMsgObj = { targetUID: props.chatObj.uid, MID: MID, ownContent: ownCipher.base64, remoteContent: remoteCipher.base64, tx: Date.now(), auth: true, seen: false, liked: false, signature: cipherSig.base64 }
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
            setChatLoadingLabel({ opacity: 0, label: '[Done]' })
        }
    });


    const deleteMessage = (MID) => {
        remove(ref(db, `messageBuffer/${props.ownUID}/${MID}`))
        remove(ref(db, `messageBuffer/${props.chatObj.uid}/${MID}`))
        setMsgList(msgArray.array.filter(elm => elm.MID != MID).map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))
        setRealtimeBufferList(realtimeBuffer.filter(elm => elm.MID != MID).map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))
        axios.post(`${DomainGetter('prodx')}api/dbop?deleteMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MID: MID, MSUID: MSUID }).then(resx => { }).catch(e => {
            setFailedMessageActionLabel({ opacity: 1, label: 'Failed to delete' }); setTimeout(() => {
                setFailedMessageActionLabel({ opacity: 0, label: 'Message Action Failed' })
            }, 2000);
        })
    }

    const likeMessageUpdate = (args) => {
        update(ref(db, `messageBuffer/${props.ownUID}/${args.MID}`), { liked: args.state })
        update(ref(db, `messageBuffer/${props.chatObj.uid}/${args.MID}`), { liked: args.state })
        axios.post(`${DomainGetter('prodx')}api/dbop?likeMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), state: args.state, MID: args.MID, MSUID: MSUID }).then(resx => {

        }).catch(e => {
            setFailedMessageActionLabel({ opacity: 1 })
            setTimeout(() => {
                setFailedMessageActionLabel({ opacity: 0 })
            }, 2000);
        });
    }


    const onChatScroll = (e) => {
        // if (e.target.scrollTop < 100) {
        //     setMsgCount(prev => (prev + 50))
        //     setMsgArray({ array: [], ini: true })
        //     setTimeout(() => {
        //         getMessagesAndUpdateChat();
        //     }, 50);
        // }
        setMsgListScrollLeft(e.target.scrollLeft)
    }

    const onTouchEnd = (e) => {
        if (msgListScrollLeft < ((7.692307692 / 100) * document.documentElement.clientWidth)) {
            document.getElementById('msgsList').scrollLeft = 0
        } else {
            document.getElementById('msgsList').scrollLeft = ((15.384615385 / 100) * document.documentElement.clientWidth);
        }
    }

    useEffect(() => {
        if (realtimeBuffer.length > 0) {
            setRealtimeBufferList(realtimeBuffer.map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))
            setTimeout(() => {
                try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
            }, 100);
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
                    localStorage.setItem(`PUBSK-${props.chatObj.uid}`, res.data.publicSigningKey);
                });
                axios.post(`${DomainGetter('prodx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: 'self' }).then(res => {
                    localStorage.setItem(`OWN-PUBK`, res.data.publicKey);
                    localStorage.setItem(`OWN-PUBSK`, res.data.publicSigningKey);
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
        setMsgList(msgArray.array.map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))

        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
        }, 50);

        onValue(ref(db, `messageBuffer/${props.ownUID}`), (snap) => {
            let RXrealtimeBuffer = snap.val();
            let RTrawMessagesArray = []
            for (let MID in RXrealtimeBuffer) {
                RTrawMessagesArray.push({ ...RXrealtimeBuffer[MID] });
            }
            RTrawMessagesArray.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) })
            let privateKeyID = localStorage.getItem('PKGetter');
            if (RTrawMessagesArray.length > 3) {
                remove(ref(db, `messageBuffer/${props.ownUID}`));//resetting the firebase buffer wont delete messages in chat since we dont reset state 
            }

            try {
                pemToKey(localStorage.getItem(privateKeyID), 'RSA').then(privateKey => {
                    window.crypto.subtle.importKey('jwk', publicSigningKeyJWK, { name: 'ECDSA', namedCurve: 'P-521' }, true, ['verify']).then(pubSigningKey => {
                        for (let ix = 0; ix < RTrawMessagesArray.length; ix++) {//looping over 3 messages everytime we have an update from the realtime buffer is way simpler than tracking what we're displaying by the Message ID (MID)
                            if (RTrawMessagesArray[ix].targetUID == props.ownUID) {
                                let rawMsg = RTrawMessagesArray[ix];
                                verify(pubSigningKey, rawMsg.remoteContent, rawMsg.signature).then(sigStatus => {
                                    decryptMessage(privateKey, rawMsg.remoteContent, 'base64').then(plain => {
                                        setRealtimeBuffer((prevBuf) => {
                                            if (prevBuf.find(elm => elm.MID == rawMsg.MID) == undefined) {
                                                return [...prevBuf, { signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.targetUID == props.ownUID ? 'rx' : 'tx', content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen }]
                                            } else {
                                                return [...prevBuf]
                                            }
                                        })
                                    });
                                })
                            }
                        }
                    })
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                for (let ix = 0; ix < RTrawMessagesArray.length; ix++) {//looping over 3 messages everytime we have an update from the realtime buffer is way simpler than tracking what we're displaying by the Message ID (MID)
                    if (RTrawMessagesArray[ix].targetUID == props.ownUID) {
                        let rawMsg = RTrawMessagesArray[ix];
                        setRealtimeBuffer((prevBuf) => {
                            if (prevBuf.find(elm => elm.MID == rawMsg.MID) == undefined) {
                                return [...prevBuf, { MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.targetUID == props.ownUID ? 'rx' : 'tx', content: undefined, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen }]
                            } else {
                                return [...prevBuf]
                            }
                        })
                    }
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
                <ul onTouchEnd={onTouchEnd} onScroll={onChatScroll} id="msgsList" className='msgsList'>
                    {chatLoadingLabel.label == '[Done]' ? msgList : ''}
                    {chatLoadingLabel.label == '[Done]' ? realtimeBufferList : ''}
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