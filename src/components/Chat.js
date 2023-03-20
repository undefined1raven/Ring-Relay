
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
import ChatDetails from '../components/ChatDetails.js'
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
    const [msgCount, setMsgCount] = useState(30)
    const [MSUID, setMSUID] = useState('')
    const [chatLoadingLabel, setChatLoadingLabel] = useState({ label: '[Fetching Conversation]', opacity: 1 });
    const [failedMessageActionLabel, setFailedMessageActionLabel] = useState({ opacity: 0, label: 'Message Action Failed' })
    const [realtimeBuffer, setRealtimeBuffer] = useState([])
    const [realtimeBufferList, setRealtimeBufferList] = useState([])
    const [msgListScrollLeft, setMsgListScrollLeft] = useState(0)
    const [deletedMsgs, setDeletedMsgs] = useState([]);
    const [likedMsgs, setLikedMsgs] = useState({});
    const [seenMsgs, setSeenMsgs] = useState({});
    const [inputDynamicStyle, setInputDynamicStyle] = useState({ top: '92.1875%', height: '6.5625%' });
    const [msgsListHeight, setMsgsListHeight] = useState('74.21875%');
    const [msgInputTextareaHeight, setMsgInputTextareaHeight] = useState('47%');
    const [statusOverride, setStatusOverride] = useState(false);
    const [showIsTyping, setShowIsTyping] = useState(false)
    const [isTypingLastUnix, setIsTypingLastUnix] = useState(0);
    const [showChatDetails, setShowChatDetails] = useState(false)
    const [remoteSigningKeySig, setRemoteSigningKeySig] = useState({ ini: false, sig: '' });
    const [remoteEncryptionKeySig, setRemoteEncryptionKeySig] = useState({ ini: false, sig: '' });
    const onInputFocus = () => {
        setScrollToY(30000);
    }

    let privateKeyID = localStorage.getItem('PKGetter');
    let publicSigningKeyJWK = JSON.parse(localStorage.getItem(`PUBSK-${props.chatObj.uid}`));

    useEffect(() => {
        let rawRemoteEncryptionPukKey = localStorage.getItem(`PUBK-${props.chatObj.uid}`);
        if (rawRemoteEncryptionPukKey != undefined) {
            let remotePublicEncryptionKeyJWK = JSON.parse(rawRemoteEncryptionPukKey);
            setRemoteEncryptionKeySig({ ini: true, sig: `${remotePublicEncryptionKeyJWK.n.toString().substring(0, 4)}+${remotePublicEncryptionKeyJWK.n.toString().substring(29, 33)}` })
        }
        setRemoteSigningKeySig({ ini: true, sig: `${publicSigningKeyJWK.x.toString().substring(0, 4)}+${publicSigningKeyJWK.y.toString().substring(0, 4)}` })
    }, [])

    const scrollToBottom = () => {
        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
        }, 50);
    }

    const decryptMessages = (rawMsgArr) => {
        if (rawMsgArr.length > 0) {
            let lastTXMID = ''
            for (let ix = 0; ix < rawMsgArr.length; ix++) {
                if (rawMsgArr[ix].type == 'tx') {
                    lastTXMID = rawMsgArr[ix].MID;
                }
            }
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
                                                addMsgToMsgArr({ signed: (ownSigStatus) ? 'self' : 'no_self', MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: (rawMsg.seen && rawMsg.MID == lastTXMID) })
                                                if (ix == rawMsgArr.length - 1) {
                                                    addMsgToMsgArr({ end: true });
                                                    scrollToBottom();
                                                }
                                                filterDeletedMessages('91');
                                            })
                                        });
                                    } else {
                                        verify(pubSigningKey, rawMsg.remoteContent, rawMsg.signature).then(sigStatus => {
                                            decryptMessage(privateKey, rawMsgArr[ix].remoteContent, 'base64').then(plain => {
                                                addMsgToMsgArr({ signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.type, content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen });
                                                if (ix == rawMsgArr.length - 1) {
                                                    addMsgToMsgArr({ end: true });
                                                    scrollToBottom();
                                                }
                                                filterDeletedMessages('101');
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
                let lastRXMID = ''
                for (let ix = 0; ix < rawMsgArr.length; ix++) {
                    if (rawMsgArr[ix].type == 'rx') {
                        lastRXMID = rawMsgArr[ix].MID;
                    }
                }
                if (lastRXMID != '') {
                    axios.post(`${DomainGetter('prodx')}api/dbop?setLastSeenMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MID: lastRXMID, MSUID: res.data.MSUID });
                }
            }

        });
    }

    const onSend = () => {
        if (newMessageContents.length > 0) {
            setInputDynamicStyle({ top: '92.1875%', height: '6.5625%' })
            setMsgsListHeight('74.21875%')
            setMsgInputTextareaHeight('47%');
            setMsgListscrollToY(30000);
            setNewMessageContents('');
            let MID = `${v4()}-${v4()}`;
            let local_nMsgObj = { type: 'tx', signed: 'self', targetUID: props.chatObj.uid, MID: MID, content: newMessageContents, tx: Date.now(), auth: true, seen: false, liked: false }
            //add messages sent to the local realtime buffer. this improves the ux significantly while also maintaining the end-to-end encryption since this plain text message objects never hits the network
            setRealtimeBuffer((prevBuf) => {
                return [...prevBuf, { ...local_nMsgObj }]
            })
            setTimeout(() => {
                filterDeletedMessages('159');
            }, 50);
            window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`PUBK-${props.chatObj.uid}`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(remotePubkey => {
                window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`OWN-PUBK`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(ownPubkey => {
                    encryptMessage(remotePubkey, newMessageContents).then(remoteCipher => {
                        encryptMessage(ownPubkey, newMessageContents).then(ownCipher => {
                            pemToKey(localStorage.getItem(`SV-${localStorage.getItem('PKGetter')}`), 'ECDSA').then(signingPrivateKey => {
                                sign(signingPrivateKey, remoteCipher.base64).then(cipherSig => {
                                    let nMsgObj = { originUID: props.ownUID, targetUID: props.chatObj.uid, MID: MID, ownContent: ownCipher.base64, remoteContent: remoteCipher.base64, tx: Date.now(), auth: true, seen: false, liked: false, signature: cipherSig.base64 }
                                    set(ref(db, `messageBuffer/${props.chatObj.uid}/messages/${MID}`), { ...nMsgObj });
                                    set(ref(db, `messageBuffer/${props.ownUID}/messages/${MID}`), { ...nMsgObj });
                                    axios.post(`${DomainGetter('prodx')}api/dbop?messageSent`, {
                                        AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), ...nMsgObj, username: props.chatObj.name
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
        filterDeletedMessages('198');
    });


    const deleteMessage = (MID) => {
        set(ref(db, `messageBuffer/${props.ownUID}/deleted/${MID}`), { tx: Date.now() });
        set(ref(db, `messageBuffer/${props.chatObj.uid}/deleted/${MID}`), { tx: Date.now() });

        setMsgList(msgArray.array.filter(elm => elm.MID != MID).map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))

        setRealtimeBufferList(realtimeBuffer.filter(elm => elm.MID != MID).map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))
        axios.post(`${DomainGetter('prodx')}api/dbop?deleteMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MID: MID, MSUID: MSUID }).then(resx => { }).catch(e => {
            setFailedMessageActionLabel({ opacity: 1, label: 'Failed to delete' }); setTimeout(() => {
                setFailedMessageActionLabel({ opacity: 0, label: 'Message Action Failed' })
            }, 2000);
        })
    }

    const likeMessageUpdate = (args) => {
        update(ref(db, `messageBuffer/${props.ownUID}/liked/${args.MID}`), { state: args.state })
        update(ref(db, `messageBuffer/${props.chatObj.uid}/liked/${args.MID}`), { state: args.state })
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
        if (msgListScrollLeft <= ((7.692307692 / 100) * document.documentElement.clientWidth)) {
            document.getElementById('msgsList').scrollLeft = 0
        } else {
            document.getElementById('msgsList').scrollLeft = ((15.384615385 / 100) * document.documentElement.clientWidth);
        }
    }

    useEffect(() => {
        if (realtimeBuffer.length > 0) {
            let lastRXMID = '';
            for (let ix = 0; ix < realtimeBuffer.length; ix++) {
                if (realtimeBuffer[ix].type == 'rx') {
                    lastRXMID = realtimeBuffer[ix].MID
                }
            }
            if (lastRXMID != '') {
                set(ref(db, `messageBuffer/${props.chatObj.uid}/seen/${props.ownUID}`), { MID: lastRXMID, status: false });
            }
            setRealtimeBufferList(realtimeBuffer.map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))
            setTimeout(() => {
                try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
            }, 100);
        }
    }, [realtimeBuffer])


    useEffect(() => {
        remove(ref(db, `messageBuffer/${props.ownUID}`));
        var interval = false
        if (!msgArray.ini && props.visible) {
            msgArrBatch = [];
            getMessagesAndUpdateChat();
            interval = setInterval(() => {
                get(ref(db, `activeUIDs/${props.chatObj.uid}`)).then(snap => {
                    const lastTx = snap.val()
                    if (lastTx != null) {
                        if (Date.now() - lastTx.tx < 5000) {
                            setStatusOverride('Online')
                            setStatusProps({ color: '#00FF85' })
                        } else {
                            setStatusOverride('Offline')
                            remove(ref(db, `activeUIDs/${props.chatObj.uid}`));
                            setStatusProps({ color: '#FF002E' })
                        }
                    } else {
                        setStatusOverride('Offline')
                        setStatusProps({ color: '#FF002E' })
                    }
                })
            }, 1500)
        }
        return () => interval ? clearInterval(interval) : 0
    }, [])

    useEffect(() => {
        if (!statusOverride) {
            if (props.chatObj.status === 'Online') {
                setStatusProps({ color: '#00FF85' })
            } else {
                setStatusProps({ color: '#FF002E' })
            }
        }

        setMsgList(msgArray.array.map(x => <li key={x.MID}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))


    }, [props, scrollToY, msgArray])

    useEffect(() => {
        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
        }, 50);
    }, [msgListscrollToY])

    const filterDeletedMessages = (id) => {
        setTimeout(() => {
            let originalMsgArrLen = msgArray.array.length;
            let originalBufferMsgArrLen = realtimeBuffer.length;
            if (deletedMsgs.length > 0) {
                for (let ix = 0; ix < deletedMsgs.length; ix++) {
                    let filteredArray = msgArray.array.filter(elm => elm.MID != deletedMsgs[ix].MID)
                    let filteredBufferArray = realtimeBuffer.filter(elm => elm.MID != deletedMsgs[ix].MID)
                    if (filteredArray.length < originalMsgArrLen) {
                        setMsgArray({ ini: true, array: filteredArray });
                    }
                    if (filteredBufferArray.length < originalBufferMsgArrLen) {
                        setRealtimeBuffer(filteredBufferArray);
                    }
                }
            }
        }, 100);
    }


    useEffect(() => {
        if (realtimeBuffer.length > 0) {
            let lastRTBufMID = realtimeBuffer[realtimeBuffer.length - 1].MID
            if (lastRTBufMID == seenMsgs) {
                let updatedRTBuf = [];
                for (let ix = 0; ix < realtimeBuffer.length; ix++) {
                    if (realtimeBuffer[ix].MID == lastRTBufMID) {
                        updatedRTBuf.push({ ...realtimeBuffer[ix], seen: true });
                        axios.post(`${DomainGetter('prodx')}api/dbop?setLastSeenMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MID: lastRTBufMID, MSUID: MSUID });
                    } else {
                        updatedRTBuf.push({ ...realtimeBuffer[ix] });
                    }
                }
                setRealtimeBuffer(updatedRTBuf)
                filterDeletedMessages();
            }
        }
    }, [seenMsgs])

    useEffect(() => {
        let lmsgArr = [];
        for (let ix = 0; ix < msgArray.array.length; ix++) {
            if (likedMsgs[msgArray.array[ix].MID] != undefined) {
                lmsgArr.push({ ...msgArray.array[ix], liked: likedMsgs[msgArray.array[ix].MID].state });
            } else {
                lmsgArr.push({ ...msgArray.array[ix] });
            }
        }
        setMsgArray({ ini: true, array: lmsgArr });//msgArray

        let lBufferMsgArr = [];
        for (let ix = 0; ix < realtimeBuffer.length; ix++) {
            if (likedMsgs[realtimeBuffer[ix].MID] != undefined) {
                lBufferMsgArr.push({ ...realtimeBuffer[ix], liked: likedMsgs[realtimeBuffer[ix].MID].state });
            } else {
                lBufferMsgArr.push({ ...realtimeBuffer[ix] });
            }
        }
        setRealtimeBuffer(lBufferMsgArr);//realtimeBuffermsgArray
    }, [likedMsgs]);

    useEffect(() => {
        filterDeletedMessages('297');
    }, [deletedMsgs])


    const onNewMessageContent = (e) => {
        set(ref(db, `messageBuffer/${props.chatObj.uid}/typing`), { status: true, targetUID: props.chatObj.uid, tx: Date.now() });
        setNewMessageContents(e.target.value);
        let inputActual = document.getElementById('msgInputActual');
        let overflowDelta = inputActual.scrollHeight - inputActual.clientHeight;
        if (overflowDelta / inputActual.clientHeight > 0.75) {
            setInputDynamicStyle({ top: '88.1875%', height: '10.5625%' })
            setMsgsListHeight('70.21875%')
            setMsgInputTextareaHeight('66%');
        } else if (overflowDelta / inputActual.clientHeight < 0.1) {
            setInputDynamicStyle({ top: '92.1875%', height: '6.5625%' })
            setMsgsListHeight('74.21875%')
            setMsgInputTextareaHeight('47%');
        }
    }

    useEffect(() => {
        let interval = setInterval(() => {
            if (isTypingLastUnix) {
                if (Date.now() - isTypingLastUnix > 500) {
                    setShowIsTyping(false)
                    remove(ref(db, `messageBuffer/${props.chatObj.uid}/typing`));
                } else {
                    setShowIsTyping(true)
                    scrollToBottom();
                }
            }
        }, 100)

        return () => clearInterval(interval)
    }, [isTypingLastUnix])

    useEffect(() => {
        if (props.visible && props.ownMessageBuffer != 0) {

            let RXrealtimeBuffer = props.ownMessageBuffer.val();
            if (RXrealtimeBuffer != null) {
                if (RXrealtimeBuffer.messages != null) {
                    let RTrawMessagesArray = []
                    for (let MID in RXrealtimeBuffer.messages) {
                        RTrawMessagesArray.push({ ...RXrealtimeBuffer.messages[MID] });
                    }
                    RTrawMessagesArray.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) })
                    let privateKeyID = localStorage.getItem('PKGetter');
                    if (RTrawMessagesArray.length > 3) {
                        remove(ref(db, `messageBuffer/${props.ownUID}`));//resetting the firebase buffer wont delete messages in chat since we dont reset state 
                    }
                    if (RTrawMessagesArray.length > 0) {
                        setChatLoadingLabel({ opacity: '0', label: '[Done]' });
                    }
                    try {
                        pemToKey(localStorage.getItem(privateKeyID), 'RSA').then(privateKey => {
                            window.crypto.subtle.importKey('jwk', publicSigningKeyJWK, { name: 'ECDSA', namedCurve: 'P-521' }, true, ['verify']).then(pubSigningKey => {
                                for (let ix = 0; ix < RTrawMessagesArray.length; ix++) {//looping over 3 messages everytime we have an update from the realtime buffer is way simpler than tracking what we're displaying by the Message ID (MID)
                                    let rawMsg = RTrawMessagesArray[ix];
                                    if (rawMsg.targetUID == props.ownUID && rawMsg?.originUID == props.chatObj.uid) {
                                        verify(pubSigningKey, rawMsg.remoteContent, rawMsg.signature).then(sigStatus => {
                                            decryptMessage(privateKey, rawMsg.remoteContent, 'base64').then(plain => {
                                                setRealtimeBuffer((prevBuf) => {
                                                    if (prevBuf.find(elm => elm.MID == rawMsg.MID) == undefined) {
                                                        return [...prevBuf, { signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.targetUID == props.ownUID ? 'rx' : 'tx', content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen }]
                                                    } else {
                                                        return [...prevBuf]
                                                    }
                                                })
                                                filterDeletedMessages('332');
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
                                filterDeletedMessages('352');
                            }
                        }
                    }
                }
                if (RXrealtimeBuffer.deleted != null) {
                    let ldelMsgs = [];
                    for (let MID in RXrealtimeBuffer.deleted) {
                        ldelMsgs.push({ MID: MID });
                    }
                    setDeletedMsgs(ldelMsgs);
                }
                if (RXrealtimeBuffer.liked != null) {
                    let llikedMsgs = {};
                    for (let MID in RXrealtimeBuffer.liked) {
                        llikedMsgs[MID] = { state: RXrealtimeBuffer.liked[MID].state };
                    }
                    setLikedMsgs(llikedMsgs);
                }
                if (RXrealtimeBuffer.seen != null) {
                    if (RXrealtimeBuffer.seen[props.chatObj.uid] != undefined) {
                        setSeenMsgs(RXrealtimeBuffer.seen[props.chatObj.uid].MID)
                    }
                }
                if (RXrealtimeBuffer.typing != null) {
                    if (RXrealtimeBuffer.typing.targetUID == props.ownUID) {
                        setIsTypingLastUnix(RXrealtimeBuffer.typing.tx)
                    }
                }

            }
        }
    }, [props.ownMessageBuffer])

    if (props.show) {
        return (
            <div className="chatContainer">
                <div className='chatHeader'>
                    <div onClick={(e) => e.target.id != 'chatHeaderBackButton' ? setShowChatDetails(true) : ''} className='chatHeaderBkg'></div>
                    <Button onClick={!showChatDetails ? props.onBackButton : () => {setShowChatDetails(false); scrollToBottom();}} id="chatHeaderBackButton" bkg="#7000FF" width="9.428571429%" height="100%" child={<BackDeco color="#7000FF" />}></Button>
                    <Label onClick={(e) => e.target.id != 'chatHeaderBackButton' ? setShowChatDetails(true) : ''} className="chatHeaderName" color="#FFF" fontSize="1.9vh" text={props.chatObj.name}></Label>
                    <Label className="chatHeaderStatus" color={statusProps.color} fontSize="1.9vh" text={!statusOverride ? props.chatObj.status : statusOverride} bkg={`${statusProps.color}20`} style={{ borderLeft: 'solid 1px' + statusProps.color }}></Label>
                    <Label className="chatCardStatusLast" fontSize="1.2vh" color={statusProps.color} text={props.chatObj.since}></Label>
                </div>
                {!showChatDetails ? <>
                    <div className='chatInput' style={{ top: inputDynamicStyle.top, height: inputDynamicStyle.height }}>
                        <div id="msgInput" style={{ width: '78%' }} className={`inputFieldContainer`}>
                            <VerticalLine color={props.privateKeyStatus ? "#7000FF" : '#FF002E'} top="0%" left="0%" height="100%"></VerticalLine>
                            {props.privateKeyStatus ? <textarea style={{ height: `${msgInputTextareaHeight}` }} maxLength="445" spellCheck="false" className='inputField' value={newMessageContents} onChange={onNewMessageContent} onFocus={onInputFocus} id='msgInputActual'></textarea> : ''}
                        </div>
                        {props.privateKeyStatus ? <Button onClick={onSend} id="sendButton" bkg="#7000FF" width="20%" height="100%" color="#7000FF" label="Send"></Button> : ''}
                    </div>
                    <ul onTouchEnd={onTouchEnd} onScroll={onChatScroll} id="msgsList" className='msgsList' style={{ height: msgsListHeight, borderLeft: `solid 1px ${props.privateKeyStatus ? '#7000FF' : '#FF002E'}` }}>
                        {(chatLoadingLabel.label == '[Done]') ? msgList : ''}
                        {(chatLoadingLabel.label == '[Done]' || chatLoadingLabel.label == '[No Messages]') ? realtimeBufferList : ''}
                        {showIsTyping ? <Label fontSize="1.9vh" id="typingLabel" bkg="#6100DC30" text="Typing..." color="#A9A9A9"></Label> : ''}
                    </ul>
                    <Label className="chatLoadingStatus" fontSize="2.1vh" bkg="#001AFF30" color="#001AFF" text={chatLoadingLabel.label} style={{ opacity: chatLoadingLabel.opacity }}></Label>
                    <Label className="failedMessageAction" fontSize="2.1vh" bkg="#FF002E30" color="#FF002E" text={failedMessageActionLabel.label} style={{ opacity: failedMessageActionLabel.opacity }}></Label>
                    <Label className="privateKeyMissingLabel" fontSize="2vh" bkg="#FF002E30" color="#FF002E" text="Plaintext message transport currently not supported" show={!props.privateKeyStatus}></Label>
                </>
                    :
                    <ChatDetails tx={props.chatObj.tx} remoteSigningKeySig={remoteSigningKeySig} remoteEncryptionKeySig={remoteEncryptionKeySig}></ChatDetails>}
            </div>
        )
    } else {
        return '';
    }
}

export default Chat;