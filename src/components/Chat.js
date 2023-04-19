
import MinLogo from '../components/MinLogo.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import Button from '../components/Button.js'
import VerticalLine from '../components/VerticalLine.js'
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
import Signature from '../components/Signature.js'
import MessageTypeSelector from '../components/MessageTypeSelector.js'
import ColorMsgTypePreview from '../components/ColorMsgTypePreview.js'
import LocationMsgTypePreview from '../components/LocationMsgTypePreview.js'
import LocationPickerOverlay from '../components/LocationPickerOverlay.js'
import SignatureMismatchDialog from './SignatureMismatchDialog.js'
import imageCompression from 'browser-image-compression';
import ImageMsgTypePreview from './ImageMsgTypePreview.js';
import ImagePickerOverlay from './ImagePickerOverlay.js'
import ImageProcessingSendBtnDeco from './ImageProcessingSendBtnDeco.js'
import CommonSigMismatchDeco from './CommonSigMismatchDeco.js'
import { deflate, inflate } from 'react-zlib-js';
import * as buffer from 'buffer';
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


function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function Chat(props) {
    const [statusProps, setStatusProps] = useState({ color: '#FF002E' });
    const [newMessageContents, setNewMessageContents] = useState('');
    const [msgArray, setMsgArray] = useState({ ini: false, array: [] });
    const [msgList, setMsgList] = useState(0);
    const [msgCount, setMsgCount] = useState({ count: 30, last: Date.now() })
    const [MSUID, setMSUID] = useState('')
    const [PKSH, setPKSH] = useState('')
    const [SPKSH, setSPKSH] = useState('')
    const [chatLoadingLabel, setChatLoadingLabel] = useState({ label: '[Fetching Conversation]', opacity: 1 });
    const [failedMessageActionLabel, setFailedMessageActionLabel] = useState({ opacity: 0, label: 'Message Action Failed' })
    const [realtimeBuffer, setRealtimeBuffer] = useState([])
    const [realtimeBufferList, setRealtimeBufferList] = useState([])
    const [msgListScroll, setMsgListScroll] = useState(0)
    const [deletedMsgs, setDeletedMsgs] = useState([]);
    const [likedMsgs, setLikedMsgs] = useState({});
    const [seenMsgs, setSeenMsgs] = useState({});
    const [inputDynamicStyle, setInputDynamicStyle] = useState({ top: '92.1875%', height: '6.5625%' });
    const [msgsListHeight, setMsgsListHeight] = useState('74.21875%');
    const [msgInputTextareaHeight, setMsgInputTextareaHeight] = useState('47%');
    const [statusOverride, setStatusOverride] = useState(false);
    const [showChatDetails, setShowChatDetails] = useState(false)
    const [remoteSigningKeySig, setRemoteSigningKeySig] = useState({ ini: false, sig: '' });
    const [remoteEncryptionKeySig, setRemoteEncryptionKeySig] = useState({ ini: false, sig: '' });
    const [conversationSig, setConversationSig] = useState({ ini: false, sig: '' });
    const [ghostModeEnabled, setGhostModeEnabled] = useState(false);
    const [ghostModeEverBeenEnabled, setGhostModeEverBeenEnabled] = useState(false);
    const [msgInputHasFocus, setMsgInputHasFocus] = useState(false)
    const [msgInputBkgColor, setMsgInputBkgColor] = useState('#8c33ff30')
    const [scrolledToStart, setScrolledToStart] = useState(false);
    const [fetchingOlderMessages, setFetchingOlderMessages] = useState(false);
    const [showTextMsgPreview, setShowTextMsgPreview] = useState(true)
    const [showColorMsgPreview, setShowColorMsgPreview] = useState(false)
    const [selectedMsgType, setSelectedMsgType] = useState('text')
    const [selectedColor, setSelectedColor] = useState('#8100D0')
    const [selectedLocation, setSelectedLocation] = useState({ ini: false, locationObj: {} });
    const [selectedImage, setSelectedImage] = useState({ ini: false, imageObj: {}, compressionProgress: 0, isEncrypting: false, done: false });
    const [selectedImageBase64, setSelectedImageBase64] = useState({ ini: false, data: '' });
    const [messageTypeSelectorTop, setMessageTypeSelectorTop] = useState('86.79375%');
    const [showLocationMsgPreview, setShowLocationMsgPreview] = useState(false);
    const [showSignatureMismatchDialog, setShowSignatureMismatchDialog] = useState(false);
    const [conversationStartUnix, setConversationStartUnix] = useState(0);
    const [showImageMsgPreview, setShowImageMsgPreview] = useState(false);
    const [imageMessagePayload, setImageMessagePayload] = useState({ ini: false, signature: '', ownContent: '', remoteContent: '', localContent: '' });
    const [imageSending, setImageSending] = useState(false);
    const [decryptedImageData, setDecryptedImageData] = useState([]);
    const [imageDataChunksTransportStatus, setImageDataChunksTransportStatus] = useState(0)//# of image data packets that still have to be sent 
    const [imageDecryptors, setImageDecryptors] = useState([])//stores web workers for destruction after the decrypted image data has been passed to the msg obj 

    let privateKeyID = localStorage.getItem('PKGetter');
    let publicSigningKeyJWK = JSON.parse(localStorage.getItem(`PUBSK-${props.chatObj.remoteUID}`));

    useEffect(() => {

        if (!PKSH == '') {
            let rawRemoteEncryptionPukKey = localStorage.getItem(`PUBK-${props.chatObj.remoteUID}`);
            let rawOwnEncryptionPukKey = localStorage.getItem(`OWN-PUBK`);

            let rawRemoteSigningPukKey = localStorage.getItem(`PUBSK-${props.chatObj.remoteUID}`);
            let rawOwnSigningPukKey = localStorage.getItem(`OWN-PUBSK`);

            let remotePublicSigningKeyJWK = { x: 'xxxx', y: 'xxxx' };
            let ownPublicSigningKeyJWK = { x: 'xxxx', y: 'xxxx' };


            try {
                if (rawRemoteSigningPukKey != undefined) {
                    remotePublicSigningKeyJWK = JSON.parse(rawRemoteSigningPukKey)
                }
            } catch (e) { }

            try {
                if (rawOwnSigningPukKey != undefined) {
                    ownPublicSigningKeyJWK = JSON.parse(rawOwnSigningPukKey)
                }
            } catch (e) { }

            let lSPKSH0 = `${ownPublicSigningKeyJWK.x.toString().substring(0, 5)}.${remotePublicSigningKeyJWK.y.toString().substring(0, 5)}`;
            let lSPKSH1 = `${remotePublicSigningKeyJWK.x.toString().substring(0, 5)}.${ownPublicSigningKeyJWK.y.toString().substring(0, 5)}`;

            let remotePublicEncryptionKeyJWK = { n: 'xxxx' };
            if (rawRemoteEncryptionPukKey != undefined) {
                remotePublicEncryptionKeyJWK = JSON.parse(rawRemoteEncryptionPukKey);
            }
            let rawOwnEncryptionPukKeyJWK = { n: 'xxxx' };
            if (rawOwnEncryptionPukKey != undefined) {
                rawOwnEncryptionPukKeyJWK = JSON.parse(rawOwnEncryptionPukKey);
            }

            let lPKSH0 = `${rawOwnEncryptionPukKeyJWK?.n.toString().substring(0, 5)}.${remotePublicEncryptionKeyJWK?.n.toString().substring(0, 5)}`;
            let lPKSH1 = `${remotePublicEncryptionKeyJWK?.n.toString().substring(0, 5)}.${rawOwnEncryptionPukKeyJWK?.n.toString().substring(0, 5)}`;

            let signingKeysSIGMatch = false;

            if (SPKSH != null && SPKSH != undefined) {
                if (lSPKSH0 == SPKSH || lSPKSH1 == SPKSH) {
                    signingKeysSIGMatch = true;
                    setRemoteSigningKeySig({ valid: true, verified: true, ini: true, sig: `${SPKSH.substring(0, 4)}+${SPKSH.substring(SPKSH.length - 5, SPKSH.length - 1)}` })
                } else {
                    signingKeysSIGMatch = false;
                    setRemoteSigningKeySig({ valid: true, verified: false, ini: true, sig: `${SPKSH.substring(0, 4)}+${SPKSH.substring(SPKSH.length - 5, SPKSH.length - 1)}` })
                }
            } else {
                setRemoteSigningKeySig({ valid: false, verified: false, ini: true, sig: `${'xxxxx'}` })
                signingKeysSIGMatch = false;
            }


            if (lPKSH0 == PKSH || lPKSH1 == PKSH) {
                if (signingKeysSIGMatch) {
                    setShowSignatureMismatchDialog(false);
                    setConversationSig({ verified: true, ini: true, sig: `${PKSH.substring(0, 4)}+${PKSH.substring(PKSH.length - 5, PKSH.length - 1)}` })
                    setRemoteEncryptionKeySig({ verified: true, ini: true, sig: `${rawOwnEncryptionPukKeyJWK.n.toString().substring(0, 4)}+${remotePublicEncryptionKeyJWK.n.toString().substring(29, 33)}` })
                } else {
                    setShowSignatureMismatchDialog(true);
                    setConversationSig({ verified: false, ini: true, sig: `${PKSH.substring(0, 4)}+${PKSH.substring(PKSH.length - 5, PKSH.length - 1)}` })
                    setRemoteEncryptionKeySig({ verified: true, ini: true, sig: `${rawOwnEncryptionPukKeyJWK.n.toString().substring(0, 4)}+${remotePublicEncryptionKeyJWK.n.toString().substring(29, 33)}` })
                }
            } else {
                setShowSignatureMismatchDialog(true);
                setConversationSig({ verified: false, ini: true, sig: `${PKSH.substring(0, 4)}+${PKSH.substring(PKSH.length - 5, PKSH.length - 1)}` })
                setRemoteEncryptionKeySig({ verified: false, ini: true, sig: `${rawOwnEncryptionPukKeyJWK.n.toString().substring(0, 4)}+${remotePublicEncryptionKeyJWK.n.toString().substring(29, 33)}` })
            }

        }
    }, [PKSH, SPKSH])

    const scrollToBottom = () => {
        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
        }, 50);
    }

    const scrollToTop = () => {
        setTimeout(() => {
            try { document.getElementById('msgsList').scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { }
        }, 50);
    }


    useEffect(() => {
        decryptedImageData.forEach(msg => {
            let updatedMsgArray = [];
            for (let ix = 0; ix < msgArray.array.length; ix++) {
                if (msg.MID == msgArray.array[ix].MID && msgArray.array[ix].typeOverride == 'image.0') {
                    updatedMsgArray.push(msg);
                    let lworker = imageDecryptors.filter(worker => worker.MID == msgArray.array[ix].MID);
                    lworker.forEach(workerObj => {
                        workerObj.worker.terminate();
                    })
                } else {
                    updatedMsgArray.push(msgArray.array[ix]);
                }
            }
            setMsgArray({ ini: true, array: updatedMsgArray });
            setTimeout(() => {
                scrollToBottom();
            }, 150);
        })
    }, [decryptedImageData])


    const startImageDecrypt = (rawMsg, encryptedOwnImagaDataChunks, encryptedRemoteImagaDataChunks, pubSigningKey, privateKey, ownPUBSK) => {
        let imageDecryptorWorker = new Worker('./imageDecryptor.js');
        setImageDecryptors(prev => [...prev, { MID: rawMsg.MID, worker: imageDecryptorWorker }])

        imageDecryptorWorker.postMessage({
            eid: 'onDecryptStart',
            MID: rawMsg.MID,
            rawMsg: rawMsg,
            encryptedOwnImagaDataChunks: encryptedOwnImagaDataChunks,
            encryptedRemoteImagaDataChunks: encryptedRemoteImagaDataChunks,
            pubSigningKey: pubSigningKey,
            privateKey: privateKey,
            ownPUBSK: ownPUBSK,
        });

        imageDecryptorWorker.onmessage = (e) => {
            if (e.data.status == 'Success') {
                setDecryptedImageData((prev) => { return [...prev, { ...e.data.msg }] });
            }
            // imageDecryptorWorker.terminate();
        }
    }

    const atomicDecrypt = async (rawMsg, ownPUBSK, privateKey, pubSigningKey, rawMsgArr) => {
        if (rawMsg.typeOverride == 'none' || rawMsg.typeOverride == undefined) {
            if (rawMsg.type == 'tx') {
                return verify(ownPUBSK, rawMsg.remoteContent, rawMsg.signature).then(async (ownSigStatus) => {
                    return await decryptMessage(privateKey, rawMsg.ownContent, 'base64').then(plain => {
                        try {
                            let messageContentsObj = JSON.parse(plain);
                            if (messageContentsObj.content.length > 0 && messageContentsObj.contentType == 'text' || messageContentsObj.contentType == 'color' || messageContentsObj.contentType == 'location') {
                                return { ...rawMsg, content: messageContentsObj.content, contentType: messageContentsObj.contentType, signed: (ownSigStatus) ? 'self' : 'no_self' }
                            } else {
                                return { ...rawMsg, content: plain, signed: (ownSigStatus) ? 'self' : 'no_self' }
                            }
                        } catch (e) {
                            return { ...rawMsg, content: plain, signed: (ownSigStatus) ? 'self' : 'no_self' }
                        }
                    })
                });
            } else {
                return verify(pubSigningKey, rawMsg.remoteContent, rawMsg.signature).then(async (sigStatus) => {
                    return await decryptMessage(privateKey, rawMsg.remoteContent, 'base64').then(plain => {
                        try {
                            let messageContentsObj = JSON.parse(plain);
                            if (messageContentsObj.content.length > 0 && messageContentsObj.contentType == 'text' || messageContentsObj.contentType == 'color' || messageContentsObj.contentType == 'location') {
                                return { ...rawMsg, content: messageContentsObj.content, contentType: messageContentsObj.contentType, signed: sigStatus }
                            } else {
                                return { ...rawMsg, content: plain, signed: sigStatus }
                            }
                        } catch (e) {
                            return { ...rawMsg, content: plain, signed: sigStatus }
                        }
                    })
                })
            }
        } else if (rawMsg.typeOverride.split('.')[0] == 'image') {
            if (rawMsg.typeOverride.split('.')[1] == 0) {

                axios.post(`${DomainGetter('prodx')}api/dbop?getImageData`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MID: rawMsg.MID }).then(res => {
                    if (res.data.imageChunks != undefined && res.data.error == undefined) {
                        let encryptedImageChunks = [];

                        encryptedImageChunks.push({ ...rawMsg });


                        res.data.imageChunks.forEach(imageChunk => {
                            encryptedImageChunks.push({ ...imageChunk });
                        })

                        let encryptedOwnImagaDataChunks = '';
                        let encryptedRemoteImagaDataChunks = '';

                        encryptedImageChunks.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) })

                        encryptedImageChunks.forEach(chunk => {
                            encryptedOwnImagaDataChunks += chunk.ownContent;
                            encryptedRemoteImagaDataChunks += chunk.remoteContent;
                        });

                        startImageDecrypt(rawMsg, encryptedOwnImagaDataChunks, encryptedRemoteImagaDataChunks, pubSigningKey, privateKey, ownPUBSK);
                    }
                }).catch(e => {

                })

                return { ...rawMsg, content: '[Decrypting Image]', contentType: 'image', signed: (false) ? 'self' : 'no_self' }
            } else {
                return { ...rawMsg, content: '', contentType: 'image', signed: (false) ? 'self' : 'no_self', hide: true }
            }
        }
    }

    const initialFetch = (rawMsgArr) => {
        if (rawMsgArr.length > 0) {
            let lastTXMID = ''
            for (let ix = 0; ix < rawMsgArr.length; ix++) {
                if (rawMsgArr[ix].type == 'tx') {
                    lastTXMID = rawMsgArr[ix].MID;
                }
            }
            try {
                if (localStorage.getItem(`PUBSK-${props.chatObj.remoteUID}`) != undefined) {
                    pemToKey(localStorage.getItem(privateKeyID)).then(privateKey => {
                        JSONtoKey(JSON.parse(localStorage.getItem('OWN-PUBSK')), 'ECDSA').then(ownPUBSK => {
                            window.crypto.subtle.importKey('jwk', publicSigningKeyJWK, { name: 'ECDSA', namedCurve: 'P-521' }, true, ['verify']).then(pubSigningKey => {
                                let promiseArray = [];
                                for (let ix = 0; ix < rawMsgArr.length; ix++) {
                                    promiseArray.push(atomicDecrypt(rawMsgArr[ix], ownPUBSK, privateKey, pubSigningKey, rawMsgArr));
                                }
                                Promise.all(promiseArray).then(msgArr => {
                                    setMsgArray({ ini: true, array: [...msgArr] });
                                    filterDeletedMessages('91');
                                    setChatLoadingLabel({ opacity: 0, label: '[Done]' });
                                    scrollToBottom();
                                })
                            }).catch(e => {
                                setMsgArray({ ini: true, array: rawMsgArr });
                            })
                        })
                    })
                }
            } catch (e) { }
        } else {
            setChatLoadingLabel({ opacity: 1, label: '[No Messages]' })
        }
    }

    const bx = (bufstr) => {
        let buf = new buffer.Buffer(bufstr);
        return (buf)
    }

    const getMessagesAndUpdateChat = () => {
        setChatLoadingLabel({ opacity: 1, label: '[Fetching Conversation]' });
        axios.post(`${DomainGetter('prodx')}api/dbop?getMessages`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), targetUID: props.chatObj.remoteUID, count: msgCount.count }).then(res => {
            if (res.data['error'] == undefined) {
                setChatLoadingLabel({ opacity: 1, label: '[Decrypting Conversation]' });
                let rawMsgArr = res.data.messages;

                // inflate(bx(rawMsgArr), (jsx) => {
                // })
                rawMsgArr.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) })
                setMSUID(res.data.MSUID);
                setPKSH(res.data.PKSH);
                setSPKSH(res.data.SPKSH);
                setConversationStartUnix(res.data.lastTX);
                initialFetch(rawMsgArr);
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


    useEffect(() => {
        setFetchingOlderMessages(true);
        scrollToTop();
        axios.post(`${DomainGetter('prodx')}api/dbop?getMessages`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MSUID: MSUID, count: 30, offset: msgCount.count, targetUID: props.chatObj.remoteUID }).then(async (resx) => {
            if (resx.data.error == undefined) {
                let rawMsgPrependArr = resx.data.messages;
                rawMsgPrependArr.sort((a, b) => { return parseInt(a.tx) - parseInt(b.tx) });
                if (resx.data.start) {
                    setScrolledToStart(resx.data.start);
                }
                if (localStorage.getItem(`PUBSK-${props.chatObj.remoteUID}`) != undefined) {
                    pemToKey(localStorage.getItem(privateKeyID)).then((privateKey) => {
                        JSONtoKey(JSON.parse(localStorage.getItem('OWN-PUBSK')), 'ECDSA').then((ownPUBSK) => {
                            window.crypto.subtle.importKey('jwk', publicSigningKeyJWK, { name: 'ECDSA', namedCurve: 'P-521' }, true, ['verify']).then(async (pubSigningKey) => {
                                let promiseArray = [];
                                for (let ix = 0; ix < rawMsgPrependArr.length; ix++) {
                                    promiseArray.push(atomicDecrypt(rawMsgPrependArr[ix], ownPUBSK, privateKey, pubSigningKey));
                                }
                                Promise.all(promiseArray).then(oldMsgArr => {
                                    let firstMIDBeforeUpdate = msgArray.array[0]?.MID;
                                    setMsgArray({ ini: true, array: [...oldMsgArr, ...msgArray.array] })
                                    setTimeout(() => {
                                        if (document.getElementById(firstMIDBeforeUpdate)) {
                                            document.getElementById(firstMIDBeforeUpdate).scrollIntoView(true);
                                            let latestTop = document.getElementById('msgsList').scrollTop;
                                            document.getElementById('msgsList').scrollTo({ top: latestTop - 40 });
                                        }
                                    }, 50);
                                    setFetchingOlderMessages(false);
                                })
                            })
                        })
                    })
                }
            }
        }).catch(e => { })
    }, [msgCount])


    const atomicMsgSend = (nMsgObj, MID) => {
        set(ref(db, `messageBuffer/${props.chatObj.remoteUID}/messages/${MID}`), { ...nMsgObj, ghost: ghostModeEnabled });
        set(ref(db, `messageBuffer/${props.ownUID}/messages/${MID}`), { ...nMsgObj, ghost: ghostModeEnabled });
        if (!ghostModeEnabled) {
            console.log(MID)
            console.log(MSUID)
            return axios.post(`${DomainGetter('prodx')}api/dbop?messageSent`, {
                AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), ...nMsgObj, username: props.chatObj.name
            });
        }
    }

    const onSend = () => {
        setInputDynamicStyle({ top: '92.1875%', height: '6.5625%' })
        setMsgsListHeight('74.21875%')
        setMsgInputTextareaHeight('47%');
        scrollToBottom();
        setNewMessageContents('');
        let MID = `${v4()}-${v4()}`;
        let LocalMsgContent = 0;
        if (selectedMsgType == 'text') {
            LocalMsgContent = newMessageContents;
        }
        if (selectedMsgType == 'color') {
            LocalMsgContent = selectedColor;
            setNewMessageContents('');
            setSelectedMsgType('text');
        }
        if (selectedMsgType == 'location' && selectedLocation.ini) {
            LocalMsgContent = JSON.stringify(selectedLocation.locationObj);
            setNewMessageContents('');
            setSelectedMsgType('text');
        }
        if (selectedMsgType == 'image' && imageMessagePayload.ini) {
            LocalMsgContent = imageMessagePayload.localContent;
            setNewMessageContents('');
            setSelectedMsgType('text');
        }
        if (LocalMsgContent != 0) {
            let local_nMsgObj = { typeOverride: `${selectedMsgType == 'image' ? 'image' : 'none'}`, contentType: selectedMsgType, type: 'tx', signed: 'self', targetUID: props.chatObj.remoteUID, MID: MID, content: LocalMsgContent, tx: Date.now(), auth: true, seen: false, liked: false }
            //add messages sent to the local realtime buffer. this improves the ux significantly while also maintaining the end-to-end encryption since this plain text message objects never hits the network
            setRealtimeBuffer((prevBuf) => {
                return [...prevBuf, { ...local_nMsgObj, ghost: ghostModeEnabled }]
            })
        }
        setTimeout(() => {
            filterDeletedMessages('159');
        }, 50);
        if (selectedMsgType != 'image') {
            window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`PUBK-${props.chatObj.remoteUID}`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(remotePubkey => {
                window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`OWN-PUBK`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(ownPubkey => {
                    let messageContentsObj = { contentType: '', content: '' };
                    if (selectedMsgType == 'text') {
                        messageContentsObj = { contentType: 'text', content: newMessageContents };
                    }
                    if (selectedMsgType == 'color') {
                        messageContentsObj = { contentType: 'color', content: selectedColor.toString() };
                    }
                    if (selectedMsgType == 'location' && selectedLocation.ini) {
                        messageContentsObj = { contentType: 'location', content: JSON.stringify(selectedLocation.locationObj) };
                    }
                    if (messageContentsObj.contentType != '' && messageContentsObj.content != '') {
                        encryptMessage(remotePubkey, JSON.stringify(messageContentsObj)).then(remoteCipher => {
                            encryptMessage(ownPubkey, JSON.stringify(messageContentsObj)).then(ownCipher => {
                                pemToKey(localStorage.getItem(`SV-${localStorage.getItem('PKGetter')}`), 'ECDSA').then(signingPrivateKey => {
                                    sign(signingPrivateKey, remoteCipher.base64).then(cipherSig => {
                                        let nMsgObj = { typeOverride: 'none', originUID: props.ownUID, targetUID: props.chatObj.remoteUID, MID: MID, ownContent: ownCipher.base64, remoteContent: remoteCipher.base64, tx: Date.now(), auth: true, seen: false, liked: false, signature: cipherSig.base64 }
                                        atomicMsgSend(nMsgObj, MID).then(resx => { }).catch(e => console.log(e));
                                    })
                                })
                            })
                        })
                    } else {
                        // setFailedMessageActionLabel({ opacity: 1, label: 'Failed to send message [NTYX]' });
                        // setTimeout(() => {
                        //     setFailedMessageActionLabel({ opacity: 0, label: 'Failed to send message [NTYX]' });
                        // }, 2000);
                    }
                });
            });
        } else if (imageMessagePayload.ini) {
            let ownTransportArray = imageMessagePayload.ownContent.toString().match(/.{1,38000}/g);
            let remoteTransportArray = imageMessagePayload.remoteContent.toString().match(/.{1,38000}/g);

            setImageDataChunksTransportStatus({ val: ownTransportArray.length, ini: ownTransportArray.length });
            setImageSending(true);
            for (let ix = 0; ix < ownTransportArray.length; ix++) {
                let nMsgObj = { typeOverride: `image.${ix}`, originUID: props.ownUID, targetUID: props.chatObj.remoteUID, MID: MID, ownContent: ownTransportArray[ix], remoteContent: remoteTransportArray[ix], tx: Date.now(), auth: true, seen: false, liked: false, signature: imageMessagePayload.signature }
                atomicMsgSend(nMsgObj, MID).then(res => {
                    setImageDataChunksTransportStatus((prev) => { return { ...prev, val: prev.val - 1 } });
                }).catch(e => {
                    setImageDataChunksTransportStatus((prev) => { return { ...prev, val: prev.val - 1 } });
                });
            }
        }
    }

    useEffect(() => {
        if (imageDataChunksTransportStatus.val == 0) {
            setImageSending(false);
        }
    }, [imageDataChunksTransportStatus])

    const deleteMessage = (MID) => {
        set(ref(db, `messageBuffer/${props.ownUID}/deleted/${MID}`), { tx: Date.now() });
        set(ref(db, `messageBuffer/${props.chatObj.remoteUID}/deleted/${MID}`), { tx: Date.now() });
        setMsgList(msgArray.array.filter(elm => elm.MID != MID).map(x => <li style={{ display: `${x?.hide ? 'none' : 'block'}` }} id={x?.MID} key={x?.MID + Math.random()}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x?.content != undefined ? true : false} msgObj={x}></Message></li>))

        setRealtimeBufferList(realtimeBuffer.filter(elm => elm.MID != MID).map(x => <li id={x.MID} key={x.MID + Math.random()}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))

        axios.post(`${DomainGetter('prodx')}api/dbop?deleteMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), MID: MID, MSUID: MSUID }).then(resx => { }).catch(e => {
            setFailedMessageActionLabel({ opacity: 1, label: 'Failed to delete' }); setTimeout(() => {
                setFailedMessageActionLabel({ opacity: 0, label: 'Message Action Failed' })
            }, 2000);
        })
    }

    const likeMessageUpdate = (args) => {
        update(ref(db, `messageBuffer/${props.ownUID}/liked/${args.MID}`), { state: args.state })
        update(ref(db, `messageBuffer/${props.chatObj.remoteUID}/liked/${args.MID}`), { state: args.state })
        axios.post(`${DomainGetter('prodx')}api/dbop?likeMessage`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), state: args.state, MID: args.MID, MSUID: MSUID }).then(resx => {

        }).catch(e => {
            setFailedMessageActionLabel({ opacity: 1 })
            setTimeout(() => {
                setFailedMessageActionLabel({ opacity: 0 })
            }, 2000);
        });
    }


    const onChatScroll = (e) => {
        setMsgListScroll({ left: e.target.scrollLeft, top: e.target.scrollTop })
    }

    const onTouchEnd = (e) => {
        if (msgListScroll.left <= ((7.692307692 / 100) * document.documentElement.clientWidth)) {
            document.getElementById('msgsList').scrollLeft = 0
        } else {
            document.getElementById('msgsList').scrollLeft = ((15.384615385 / 100) * document.documentElement.clientWidth);
        }
    }


    useEffect(() => {
        if (msgListScroll.top < 100 && Date.now() - msgCount.last > 800 && !scrolledToStart && props.privateKeyStatus && !ghostModeEnabled) {
            setMsgCount((prev) => { return { count: prev.count + 30, last: Date.now() } })
        }
    }, [msgListScroll])

    useEffect(() => {
        if (realtimeBuffer.length > 0) {
            setChatLoadingLabel({ label: '[Done]', opacity: 0 });
            let lastRXMID = '';
            for (let ix = 0; ix < realtimeBuffer.length; ix++) {
                if (realtimeBuffer[ix].type == 'rx') {
                    lastRXMID = realtimeBuffer[ix].MID
                }
            }
            if (lastRXMID != '') {
                set(ref(db, `messageBuffer/${props.chatObj.remoteUID}/seen/${props.ownUID}`), { MID: lastRXMID, status: false });
            }

            setRealtimeBufferList(realtimeBuffer.map(x => <li id={x.MID} key={x.MID + Math.random()}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x.content != undefined ? true : false} msgObj={x}></Message></li>))
            scrollToBottom();
        }
    }, [realtimeBuffer])


    useEffect(() => {
        remove(ref(db, `messageBuffer/${props.ownUID}`));
        var interval = false
        if (!msgArray.ini && props.visible) {
            getMessagesAndUpdateChat();
            interval = setInterval(() => {
                get(ref(db, `activeUIDs/${props.chatObj.remoteUID}`)).then(snap => {
                    const lastTx = snap.val()
                    if (lastTx != null) {
                        if (Date.now() - lastTx.tx < 5000) {
                            setStatusOverride('Online')
                            setStatusProps({ color: '#00FF85' })
                        } else {
                            setStatusOverride('Offline')
                            remove(ref(db, `activeUIDs/${props.chatObj.remoteUID}`));
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
    }, [props])

    useEffect(() => {
        setMsgList(msgArray.array.map(x => <li style={{ display: `${x?.hide ? 'none' : 'block'}` }} id={x?.MID} key={x?.MID + Math.random()}><Message deleteMessage={deleteMessage} likeMessageUpdate={likeMessageUpdate} decrypted={x?.content != undefined ? true : false} msgObj={x}></Message></li>))
    }, [msgArray])

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
        set(ref(db, `messageBuffer/${props.chatObj.remoteUID}/typing`), { status: true, targetUID: props.chatObj.remoteUID, tx: Date.now(), ghost: ghostModeEnabled });
        setNewMessageContents(e.target.value);
        let inputActual = document.getElementById('msgInputActual');
        let overflowDelta = inputActual.scrollHeight - inputActual.clientHeight;
        if (overflowDelta / inputActual.clientHeight > 0.75) {
            setInputDynamicStyle({ top: '88.1875%', height: '10.5625%' })
            setMsgsListHeight('70.21875%')
            setMsgInputTextareaHeight('66%');
            setMessageTypeSelectorTop('82.9%');
        } else if (overflowDelta / inputActual.clientHeight < 0.1) {
            setInputDynamicStyle({ top: '92.1875%', height: '6.5625%' })
            setMsgsListHeight('74.21875%')
            setMsgInputTextareaHeight('47%');
            setMessageTypeSelectorTop('86.79375%');
        }
    }

    useEffect(() => {
        if (props.visible && props.ownMessageBuffer != 0) {
            let RXrealtimeBuffer = props.ownMessageBuffer;
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
                                    if (rawMsg.targetUID == props.ownUID && rawMsg?.originUID == props.chatObj.remoteUID) {
                                        verify(pubSigningKey, rawMsg.remoteContent, rawMsg.signature).then(sigStatus => {
                                            decryptMessage(privateKey, rawMsg.remoteContent, 'base64').then(plain => {
                                                setRealtimeBuffer((prevBuf) => {
                                                    if (prevBuf.find(elm => elm.MID == rawMsg.MID) == undefined) {
                                                        try {
                                                            let messageContentObj = JSON.parse(plain);
                                                            if (messageContentObj.content.length > 0 && messageContentObj.contentType == 'text' || messageContentObj.contentType == 'color' || messageContentObj.contentType == 'location') {
                                                                return [...prevBuf, { signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.targetUID == props.ownUID ? 'rx' : 'tx', content: messageContentObj.content, contentType: messageContentObj.contentType, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen, ghost: rawMsg.ghost }]

                                                            } else {
                                                                return [...prevBuf, { signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.targetUID == props.ownUID ? 'rx' : 'tx', content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen, ghost: rawMsg.ghost }]

                                                            }
                                                        } catch (e) {
                                                            return [...prevBuf, { signed: sigStatus, MID: rawMsg.MID, liked: rawMsg.liked, type: rawMsg.targetUID == props.ownUID ? 'rx' : 'tx', content: plain, tx: rawMsg.tx, auth: rawMsg.auth, seen: rawMsg.seen, ghost: rawMsg.ghost }]
                                                        }
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
                    if (RXrealtimeBuffer.seen[props.chatObj.remoteUID] != undefined) {
                        setSeenMsgs(RXrealtimeBuffer.seen[props.chatObj.remoteUID].MID)
                    }
                }
            }
        }
    }, [props.ownMessageBuffer])


    const msgListBorderColorController = () => {
        if (props.privateKeyStatus) {
            if (ghostModeEnabled) {
                return '#0500FF';
            } else {
                return '#7000FF';
            }
        } else {
            return '#FF002E';
        }
    }

    const ghostModeToggle = () => {
        setGhostModeEverBeenEnabled(true);
        setGhostModeEnabled(prev => { return !prev });
        setShowChatDetails(false);
        scrollToBottom();
    }

    useEffect(() => {
        msgInputBkgColorSetter();
        if (ghostModeEnabled) {
            document.documentElement.style.setProperty('--msgInputPlaceholderColor', "#0013BF")
        } else {
            document.documentElement.style.setProperty('--msgInputPlaceholderColor', "#5e00d1")
        }
        if (!ghostModeEnabled && ghostModeEverBeenEnabled) {
            props.onBackButton({ ghost: true, uid: props.chatObj.remoteUID });
        }
    }, [ghostModeEnabled])


    const msgInputBkgColorSetter = () => {
        if (msgInputHasFocus) {
            if (ghostModeEnabled) {
                setMsgInputBkgColor('#0500FF50');
            } else {
                setMsgInputBkgColor('#7000FF50');
            }
        } else {
            if (ghostModeEnabled) {
                setMsgInputBkgColor('#0500FF30');
            } else {
                setMsgInputBkgColor('#7000FF30');
            }
        }
    }

    useEffect(() => {
        msgInputBkgColorSetter();
    }, [msgInputHasFocus])


    const convoDetailsToggle = (e) => {
        if (e.target.id != 'chatHeaderBackButton') {
            setShowChatDetails((prev) => { return !prev });

        }
    }

    useEffect(() => {
        if (selectedMsgType == 'color') {
            setShowColorMsgPreview(true);
            setShowTextMsgPreview(false);
            setShowLocationMsgPreview(false);
            setShowImageMsgPreview(false);
        }
        if (selectedMsgType == 'text') {
            setShowColorMsgPreview(false);
            setShowLocationMsgPreview(false);
            setShowTextMsgPreview(true);
            setShowImageMsgPreview(false);
        }
        if (selectedMsgType == 'location') {
            setShowColorMsgPreview(false);
            setShowLocationMsgPreview(true);
            setShowTextMsgPreview(false);
            setShowImageMsgPreview(false);
        }
        if (selectedMsgType == 'image') {
            setShowColorMsgPreview(false);
            setShowLocationMsgPreview(false);
            setShowTextMsgPreview(false);
            setShowImageMsgPreview(true);
        }
    }, [selectedMsgType])

    const onColorInputChange = (e) => {
        setSelectedColor(e.target.value.toUpperCase())
    }

    useEffect(() => {
        if (!showChatDetails) {
            scrollToBottom();
        }
    }, [showChatDetails])

    const updateLocationInput = (e) => {
        if (e.viewState) {
            let u = { ini: true, locationObj: { long: e.viewState.longitude, lat: e.viewState.latitude, zoom: e.viewState.zoom } }
            setSelectedLocation(u)
        }
    }

    const refreshConversationWindow = () => {
        props.onBackButton({ ghost: true, uid: props.chatObj.remoteUID });
    }


    const updateSelectedMsgType = (typeID, e) => {
        if (typeID != 'image') {
            setSelectedMsgType(typeID);
        } else {
            const options = { fileType: 'image/webp', maxSizeMB: 0.5, onProgress: (e) => { setSelectedImage({ ini: true, fileSize: (file.size / 1024 / 1024).toFixed(2), fileName: file.name, compressionProgress: e, isEncrypting: false, done: false }) }, useWebWorker: true, preserveExif: false }

            const file = e.target.files[0]
            setSelectedImage({ ini: true, fileSize: (file.size / 1024 / 1024).toFixed(2), fileName: file.name, compressionProgress: 0, isEncrypting: false, done: false });

            let fileReader = new FileReader()
            fileReader.readAsDataURL(file)

            fileReader.onload = () => setSelectedImageBase64({ ini: true, data: fileReader.result })

            imageCompression(file, options).then(val => {
                let rawOwnEncryptionPukKey = JSON.parse(localStorage.getItem(`OWN-PUBK`));
                window.crypto.subtle.importKey('jwk', JSON.parse(localStorage.getItem(`PUBK-${props.chatObj.remoteUID}`)), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(remotePubkey => {
                    window.crypto.subtle.importKey('jwk', rawOwnEncryptionPukKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']).then(key => {
                        new Response(val).arrayBuffer().then(buf => {
                            setSelectedImage({ ini: true, fileSize: (file.size / 1024 / 1024).toFixed(2), compressionProgress: 100, fileName: file.name, chunkCount: Math.round(buf.byteLength / 446), isEncrypting: true, done: false });

                            let base64encodedBuf = _arrayBufferToBase64(buf);

                            let ownChunks = [];
                            let remoteChunks = [];
                            let chunkCount = Math.round(base64encodedBuf.length / 446);

                            for (let ix = 0; ix <= chunkCount; ix++) {
                                if (ix == 0) {
                                    ownChunks.push(encryptMessage(key, base64encodedBuf.substring(0, 446)));
                                    remoteChunks.push(encryptMessage(remotePubkey, base64encodedBuf.substring(0, 446)));
                                }
                                if (ix > 1 && ix < chunkCount) {
                                    ownChunks.push(encryptMessage(key, base64encodedBuf.substring((ix - 1) * 446, ix * 446)));
                                    remoteChunks.push(encryptMessage(remotePubkey, base64encodedBuf.substring((ix - 1) * 446, ix * 446)));
                                }
                                if (ix == chunkCount) {
                                    let len = base64encodedBuf.length;
                                    let modRes = len % 446;
                                    ownChunks.push(encryptMessage(key, base64encodedBuf.substring(len - modRes, len)));
                                    remoteChunks.push(encryptMessage(remotePubkey, base64encodedBuf.substring(len - modRes, len)));
                                }
                            }

                            Promise.all(ownChunks).then(encryptedOwnChunks => {
                                Promise.all(remoteChunks).then(encryptedRemoteChunks => {
                                    pemToKey(localStorage.getItem(`SV-${localStorage.getItem('PKGetter')}`), 'ECDSA').then(signingPrivateKey => {
                                        let base64EncodedOwnChunks = '';
                                        let base64EncodedRemoteChunks = '';
                                        for (let ix = 0; ix < encryptedOwnChunks.length; ix++) {
                                            base64EncodedOwnChunks += encryptedOwnChunks[ix].base64;
                                            base64EncodedOwnChunks += '<X>';
                                            base64EncodedRemoteChunks += encryptedRemoteChunks[ix].base64;
                                            base64EncodedRemoteChunks += '<X>';
                                        }
                                        sign(signingPrivateKey, base64EncodedRemoteChunks).then(cipherSig => {
                                            setImageMessagePayload({ localContent: base64encodedBuf, ini: true, signature: cipherSig.base64, ownContent: base64EncodedOwnChunks, remoteContent: base64EncodedRemoteChunks });
                                        });
                                    });
                                    setSelectedImage({ ini: true, fileSize: (file.size / 1024 / 1024).toFixed(2), fileName: file.name, chunkCount: Math.round(buf.byteLength / 446), isEncrypting: false, done: true });
                                })
                            })

                        })
                    });
                });
            }).catch(e => console.log(e));
            setSelectedMsgType(typeID);
        }
    }

    if (props.show) {
        return (
            <div className="chatContainer">
                {imageSending ?
                    <div className='imageSendingContainer'>
                        <Label id="imageSendingLabel" fontSize="1.9vh" style={{ top: '28.2%', left: '5%' }} color="#FFF" text={`[Sending Image] [${100 - Math.round((imageDataChunksTransportStatus.val / imageDataChunksTransportStatus.ini) * 100)}%]`}></Label>
                        <ImageProcessingSendBtnDeco style={{ position: 'absolute', left: '86.5%', top: '11.5%' }}></ImageProcessingSendBtnDeco>
                    </div> : ''}
                <div className='chatHeader' style={{ borderLeft: `solid 1px ${ghostModeEnabled ? '#0500FF' : '#7000FF'}` }}>
                    <div onClick={convoDetailsToggle} style={{ backgroundColor: `${ghostModeEnabled ? '#0500FF20' : '#6100DC20'}`, borderLeft: `solid 1px ${ghostModeEnabled ? '#0500FF' : "#7000FF"}` }} className='chatHeaderBkg'></div>
                    <Button onClick={!showChatDetails ? props.onBackButton : () => { setShowChatDetails(false); scrollToBottom(); }} id="chatHeaderBackButton" bkg={ghostModeEnabled ? '#0500FF' : "#7000FF"} width="9.428571429%" height="100%" child={<BackDeco color={ghostModeEnabled ? '#0500FF' : "#7000FF"} />}></Button>
                    <Label onClick={convoDetailsToggle} color={ghostModeEnabled ? "#0500FF" : "#5600C3"} style={{ left: `${showChatDetails ? '53%' : '58%'}` }} text={showChatDetails ? "Tap to hide details" : "Tap for details"} fontSize="1.5vh"></Label>
                    <Label onClick={convoDetailsToggle} className="chatHeaderName" color="#FFF" fontSize="1.9vh" text={props.chatObj.name}></Label>
                    <Label className="chatHeaderStatus" color={statusProps.color} fontSize="1.9vh" text={!statusOverride ? props.chatObj.status : statusOverride} bkg={`${statusProps.color}20`} style={{ borderLeft: 'solid 1px' + statusProps.color }}></Label>
                    <Label className="chatCardStatusLast" fontSize="1.2vh" color={statusProps.color} text={props.chatObj.since}></Label>
                </div>
                {!showChatDetails ? <>
                    <div className='chatInput' style={{ top: inputDynamicStyle.top, height: inputDynamicStyle.height }}>
                        <div id="msgInput" style={{ width: '78%' }} className={`inputFieldContainer`}>
                            <VerticalLine color={msgListBorderColorController()} top="0%" left="0%" height="100%"></VerticalLine>
                            {props.privateKeyStatus && showTextMsgPreview ? <textarea placeholder={ghostModeEnabled ? 'Ghostly Message...' : 'Message...'} id="msgInputActual" onBlur={() => setMsgInputHasFocus(false)} onFocus={() => setMsgInputHasFocus(true)} style={{ height: `${msgInputTextareaHeight}`, backgroundColor: `${msgInputBkgColor}`, borderLeft: `solid 1px ${msgListBorderColorController()}` }} maxLength="445" spellCheck="false" value={newMessageContents} onChange={onNewMessageContent}></textarea> : ''}
                            {props.privateKeyStatus ? <ColorMsgTypePreview onColorInputChange={onColorInputChange} onCancel={() => setSelectedMsgType('text')} color={selectedColor} show={showColorMsgPreview} bkg={ghostModeEnabled ? "#0500FF20" : "#6100DC20"}></ColorMsgTypePreview> : ""}
                            {props.privateKeyStatus ? <LocationMsgTypePreview ghost={ghostModeEnabled} selectedLocation={selectedLocation} show={showLocationMsgPreview} onCancel={() => setSelectedMsgType('text')} bkg={ghostModeEnabled ? "#0500FF20" : "#6100DC20"}></LocationMsgTypePreview> : ''}
                            {props.privateKeyStatus ? <ImageMsgTypePreview selectedImage={selectedImage} ghost={ghostModeEnabled} onCancel={() => setSelectedMsgType('text')} show={showImageMsgPreview} bkg={ghostModeEnabled ? "#0500FF20" : "#6100DC20"}></ImageMsgTypePreview> : ''}
                        </div>
                        {props.privateKeyStatus ? <Button child={!selectedImage.done && selectedMsgType == 'image' ? <ImageProcessingSendBtnDeco /> : <Label fontSize="2.4vh" color="#7000FF" text="Send"></Label>} onClick={onSend} id="sendButton" bkg={msgListBorderColorController()} width="20%" height="100%" color={ghostModeEnabled ? '#FFF' : '#7000FF'}></Button> : ''}
                    </div>
                    <ul onTouchEnd={onTouchEnd} onScroll={onChatScroll} id="msgsList" className='msgsList' style={{ height: msgsListHeight, borderLeft: `solid ${showSignatureMismatchDialog ? "0px" : '1px'} ${msgListBorderColorController()}` }}>
                        {fetchingOlderMessages && chatLoadingLabel.label == '[Done]' ? <li className='msgContainer' style={{ paddingBottom: '2%', paddingTop: '2%', borderLeftColor: '#001AFF' }}><Label fontSize="1.9vh" id="convoStartedLabel" text="[Fetching Older Messages]" color="#001AFF" bkg="#001AFF30"></Label></li> : ''}
                        {!fetchingOlderMessages && !ghostModeEnabled && scrolledToStart && chatLoadingLabel.label != '[No Messages]' ? <li className='msgContainer' style={{ paddingBottom: '2%', paddingTop: '2%' }}><Label fontSize="1.9vh" id="convoStartedLabel" text="[Conversation Started]" color="#9644FF" bkg="#7000FF30"></Label></li> : ''}
                        {ghostModeEnabled ? <li className='msgContainer' style={{ paddingBottom: '2%', paddingTop: '2%', borderLeftColor: '#0500FF' }}><Label fontSize="1.9vh" id="convoStartedLabel" text="[Ghostly Conversation Started]" color="#FFF" bkg="#0500FF30"></Label></li> : ''}
                        {(chatLoadingLabel.label == '[Done]' && !ghostModeEnabled) ? msgList : ''}
                        {(chatLoadingLabel.label == '[Done]' || chatLoadingLabel.label == '[No Messages]') ? realtimeBufferList : ''}
                        {props.showIsTyping ? <Label fontSize="1.9vh" id="typingLabel" style={{ left: `${props.isTypingLastUnix.ghost ? "56.6%" : "76%"}`, borderRight: `solid 1px ${props.isTypingLastUnix.ghost ? '#0500FF' : '#7000FF'}`, width: `${props.isTypingLastUnix.ghost ? '40%' : '20.545189504%'}` }} bkg={props.isTypingLastUnix.ghost ? '#0500FF30' : "#6100DC30"} text={props.isTypingLastUnix.ghost ? 'Ghostly Typing...' : "Typing..."} color={props.isTypingLastUnix.ghost ? '#0500FF' : "#A9A9A9"}></Label> : ''}
                    </ul>
                    <ImagePickerOverlay selectedImageBase64={selectedImageBase64} selectedImage={selectedImage} ghost={ghostModeEnabled} show={showImageMsgPreview}></ImagePickerOverlay>
                    <LocationPickerOverlay ghost={ghostModeEnabled} updateLocationInput={updateLocationInput} show={showLocationMsgPreview}></LocationPickerOverlay>
                    <MessageTypeSelector top={messageTypeSelectorTop} ghost={ghostModeEnabled} onTypeSelected={updateSelectedMsgType}></MessageTypeSelector>
                    {chatLoadingLabel.label == '[No Messages]' ?
                        <>
                            <Signature sigLabel="Conversation Signature" valid={conversationSig.ini && conversationSig.sig?.length == 9} verified={conversationSig.verified} sig={conversationSig.sig} top="52%"></Signature>
                            <Signature sigLabel="Remote SIG Verification Key" valid={remoteSigningKeySig.valid} verified={remoteSigningKeySig.verified} sig={remoteSigningKeySig.sig} top="62%"></Signature>
                            <Signature sigLabel="Remote Encryption Key" valid={remoteEncryptionKeySig.ini && remoteEncryptionKeySig.sig?.length == 9} verified={remoteEncryptionKeySig.verified} sig={remoteEncryptionKeySig.sig} top="72%"></Signature>
                        </> : ''}
                    <Label className="chatLoadingStatus" fontSize="2.1vh" bkg="#001AFF30" color="#001AFF" text={chatLoadingLabel.label} style={{ opacity: chatLoadingLabel.opacity }}></Label>
                    <Label className="failedMessageAction" fontSize="2.1vh" bkg="#FF002E30" color="#FF002E" text={failedMessageActionLabel.label} style={{ backdropFilter: 'blur(5px)', opacity: failedMessageActionLabel.opacity }}></Label>
                    <Label className="privateKeyMissingLabel" fontSize="2vh" bkg="#FF002E30" color="#FF002E" text="Plaintext message transport currently not supported" show={!props.privateKeyStatus}></Label>
                </>
                    :
                    <ChatDetails refreshConversationWindow={refreshConversationWindow} MSUID={MSUID} remoteUID={props.chatObj.remoteUID} conversationStartUnix={conversationStartUnix} ghost={ghostModeEnabled} ghostModeToggle={ghostModeToggle} tx={props.chatObj.tx} conversationSig={conversationSig} remoteSigningKeySig={remoteSigningKeySig} remoteEncryptionKeySig={remoteEncryptionKeySig}></ChatDetails>}
                <SignatureMismatchDialog updateLocalSigs={() => props.onBackButton({ ghost: true, uid: props.chatObj.remoteUID })} MSUID={MSUID} remoteUID={props.chatObj.remoteUID} onHideSigMismatchDialog={() => setShowSignatureMismatchDialog(false)} show={showSignatureMismatchDialog}></SignatureMismatchDialog>
            </div>
        )
    } else {
        return '';
    }
}

export default Chat;