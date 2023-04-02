
import { Link } from 'react-router-dom'
import MinLogo from '../components/WideLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import NavBar from '../components/NavBar.js'
import Chats from '../components/Chats.js'
import Chat from '../components/Chat.js'
import Settings from '../components/Settings.js'
import NotificationsDialog from '../components/NotificationsDialog.js'
import LogsDialog from '../components/LogsDialog.js'
import NewContact from '../components/NewContact.js'
import DomainGetter from '../fn/DomainGetter.js'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { pemToKey, encryptMessage, decryptMessage, getKeyPair, keyToPem, JSONtoKey } from '../fn/crypto.js'
import { initializeApp } from "firebase/app";
import { getDatabase, get, remove, set, ref, onValue, off } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl';

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

const db = getDatabase(app)

let oneSig = window.OneSignal;

function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [windowId, setWindowId] = useState('chats');
  const [windowHash, setWindowHash] = useState('/');
  const [refs, setRefs] = useState({ ini: false, arr: [] });
  const [chatObj, setChatObj] = useState({ uid: '', name: '', status: '', since: '' });
  const [currentUsername, setCurrentUsername] = useState(0);
  const [ownUID, setOwnUID] = useState(0);
  const [privateKeyStatus, setPrivateKeyStatus] = useState({ found: false, valid: false, ini: false });
  const [refreshingRefs, setRefreshingRefs] = useState(false)
  const [notificationsDialogShow, setNotificationsDialogShow] = useState(false)
  const [logsDialogShow, setLogsDialogShow] = useState(false)
  const [showErr, setShowErr] = useState(false)
  const [netErr, setNetErr] = useState({ status: false, error: '' });
  const [hasPubKeys, setHasPubKeys] = useState({ ini: false, last: 0 });
  const refsCache = localStorage.getItem(`refs-${localStorage.getItem('ownUID')}`);
  const [messageCountHash, setmessageCountHash] = useState({ ini: false, hash: {}, last: 0 });
  const [contactStatusIntervalEnabled, setContactStatusIntervalEnabled] = useState(false);
  const [newMessageCountsIntervalEnabled, setNewMessageCountsIntervalEnabled] = useState(false);
  const [ownMessageBuffer, setOwnMessageBuffer] = useState(0);
  const [isTypingLastUnix, setIsTypingLastUnix] = useState(0);
  const [showIsTyping, setShowIsTyping] = useState(false)
  const [typingTruncatedBuffer, setTypingTruncatedBuffer] = useState({});
  const onNavButtonClick = (btnId) => {
    if (windowId == 'chat') {
      onBackButton();
      setWindowId(btnId);
    } else {
      setWindowId(btnId);
    }
    refreshRefs();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      try { document.getElementById('msgsList').scrollTo({ top: document.getElementById('msgsList').scrollHeight, behavior: 'instant' }); } catch (e) { }
    }, 50);
  }

  const onChatSelected = (uid) => {
    for (let ix = 0; ix < refs.arr.length; ix++) {
      if (refs.arr[ix].uid == uid) {
        remove(ref(db, `messageBuffer/${ownUID}`));
        setChatObj({ uid: uid, name: refs.arr[ix].name, status: refs.arr[ix].status, since: refs.arr[ix].since, tx: refs.arr[ix].tx })
      }
    }
  }
  const switchToNewContacts = () => {
    setWindowId('newContact')
  }
  const onBackButton = (args) => {
    remove(ref(db, `messageBuffer/${ownUID}`));
    refreshRefs();
    setWindowId('chats');

    if (args?.ghost) {
      setTimeout(() => {
        setWindowId('chat')
      }, 50)
    } else {
      setChatObj({ uid: '', name: '', status: '', since: '', tx: '' })
    }
  }

  useEffect(() => {
    if (chatObj.uid != '' && windowId != 'newContact') {
      setWindowId('chat');
    }
  });

  useEffect(() => {
    if (sessionStorage.getItem('showLogsConfig') != null) {
      if (sessionStorage.getItem('showLogsConfig')) {
        setLogsDialogShow(true);
      }
    }
  }, [])

  let rtdbListnerIni = false;

  useEffect(() => {
    var rtdbl = false;
    if (!rtdbListnerIni && authorized && ownUID != 0 && window.realtimeBufferIni == false) {
      window['realtimeBufferIni'] = true;
      rtdbListnerIni = true;
      rtdbl = onValue(ref(db, `messageBuffer/${ownUID}`), (snap) => {
        const buffer = snap.val();
        setTypingTruncatedBuffer({ messages: buffer?.messages, deleted: buffer?.deleted, liked: buffer?.liked, seen: buffer?.seen })
        let RXrealtimeBuffer = snap.val();
        if (RXrealtimeBuffer != null) {
          if (RXrealtimeBuffer.typing != null) {
            if (RXrealtimeBuffer.typing.targetUID == ownUID) {
              setIsTypingLastUnix({ tx: RXrealtimeBuffer.typing.tx, ghost: RXrealtimeBuffer.typing.ghost })
            }
          }
        }
      });
    }
    // return () => rtdbl ? off(`messageBuffer/${ownUID}`) : 0;//not like it was doing anything anyway
  }, [authorized])


  useEffect(() => {
    if (Date.now() - isTypingLastUnix.tx > 500) {
      setOwnMessageBuffer({ ...typingTruncatedBuffer })
    }
  }, [typingTruncatedBuffer])

  useEffect(() => {
    let interval = setInterval(() => {
      if (isTypingLastUnix.tx) {
        if (Date.now() - isTypingLastUnix.tx > 500) {
          setShowIsTyping(false)
          remove(ref(db, `messageBuffer/${chatObj.uid}/typing`));
        } else {
          setShowIsTyping(true)
          scrollToBottom();
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isTypingLastUnix])


  const checkContactsStatus = (msgCountHash) => {
    if (refs.arr.length > 0) {
      let updatedRefsWithStatus = [];
      for (let ix = 0; ix < refs.arr.length; ix++) {
        get(ref(db, `activeUIDs/${refs.arr[ix].uid}`)).then(snap => {
          const lastTx = snap.val()
          var lstat = ''
          if (lastTx) {
            if (Date.now() - lastTx.tx < 7000) {

              lstat = 'Online';
            } else {
              lstat = 'Offline';
              remove(ref(db, `activeUIDs/${refs.arr[ix].uid}`));
            }
          } else {
            lstat = 'Offline';
          }
          if (msgCountHash) {
            updatedRefsWithStatus.push({ ...refs.arr[ix], status: lstat, msg: msgCountHash[refs.arr[ix].uid]?.msg });
          } else {
            updatedRefsWithStatus.push({ ...refs.arr[ix], status: lstat });
          }
        })
      }
      setTimeout(() => {
        if (refs.arr.length == updatedRefsWithStatus.length) {
          setRefs({ ini: true, arr: updatedRefsWithStatus })
        }
      }, 200);
    }
  }


  const getNewMessageCounts = (res) => {
    if (res.data.refs.length > 0) {
      axios.post(`${DomainGetter('devx')}api/dbop?getNewMessagesCount`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), refs: res.data.refs }).then(resx => {
        if (!resx.data.error) {
          let lmessageCountsHash = resx.data.messageCountsHash;
          for (let ix = 0; ix < res.data.refs.length; ix++) {
            if (resx.data.messageCountsHash[res.data.refs[ix].uid] == undefined) {
              lmessageCountsHash[res.data.refs[ix].uid] = { msg: -1 };
            }
          }
          setmessageCountHash({ ini: true, hash: resx.data.messageCountsHash, last: Date.now() });
          setRefreshingRefs(false);
          setTimeout(() => {
            checkContactsStatus(resx.data.messageCountsHash)
          }, 200);
        }
      }).catch(e => { })
    }
  }

  useEffect(() => {
    var contactStatusInterval = false;
    var newMessageCountsInterval = false;
    // contactStatusInterval = setInterval(() => {
    //   if (messageCountHash.ini) {
    //     checkContactsStatus(messageCountHash.hash);
    //   }
    //   setContactStatusIntervalEnabled(true)
    // }, 5000)
    // setNewMessageCountsIntervalEnabled(true);
    // newMessageCountsInterval = setInterval(() => {
    //   if (Date.now() - messageCountHash.last > 20000) {
    //     getNewMessageCounts({ data: { refs: refs.arr } });
    //   }
    // }, 7000)
    return () => { clearInterval(contactStatusInterval); clearInterval(newMessageCountsInterval); }
  }, [messageCountHash])

  useEffect(() => {
    var heartbeatInterval = false
    if (authorized && ownUID != 0) {
      heartbeatInterval = setInterval(() => {
        set(ref(db, `activeUIDs/${ownUID}`), { tx: Date.now() });
      }, 5000);
    }
    return () => clearInterval(heartbeatInterval)
  }, [ownUID, messageCountHash])

  useEffect(() => {
    window.location.hash = windowHash;
    if (!authorized) {
      axios.post(`${DomainGetter('devx')}api/auth?val=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
        if (!res.data.flag) {
          window.location.hash = `#${res.data.redirect}`;
          setAuthorized(false)
          localStorage.removeItem('refs')
        } else {
          setAuthorized(true);
          try {
            if (window.Notification) {
              if (window.Notification.permission == 'granted') {
                oneSig.registerForPushNotifications();
              } else if (window.Notification.permission == 'default' || window.Notification.permission == 'denied') {
                setNotificationsDialogShow(true);
              }
            }

          } catch (e) {
            setShowErr(true)
          }
          oneSig.push(() => {
            oneSig.setExternalUserId(res.data.ownUID);
          })
          setOwnUID(res.data.ownUID);
          setCurrentUsername(res.data.username);
          if (localStorage.getItem('-PK') != undefined) {
            localStorage.setItem(res.data.PKGetter, localStorage.getItem('-PK'));
            localStorage.removeItem('-PK');
          }
          if (localStorage.getItem('-SPK') != undefined) {
            localStorage.setItem(`SV-${res.data.PKGetter}`, localStorage.getItem('-SPK'));
            localStorage.removeItem('-SPK');
          }
          localStorage.setItem('PKGetter', res.data.PKGetter);
          let PKGetter = res.data.PKGetter;
          if (PKGetter != undefined && localStorage.getItem(PKGetter) != undefined && localStorage.getItem(`SV-${PKGetter}`) != undefined) {
            pemToKey(localStorage.getItem(PKGetter)).then(pk => {
              pemToKey(localStorage.getItem(`SV-${PKGetter}`), 'ECDSA').then(signPK => {
                if (pk.algorithm.name == 'RSA-OAEP' && signPK.algorithm.name == 'ECDSA') {
                  setPrivateKeyStatus({ valid: true, found: true, ini: true });
                } else {
                  setPrivateKeyStatus({ valid: false, found: true, ini: true });
                }
              })
            });
          } else {
            setPrivateKeyStatus({ valid: false, found: false, ini: true });
          }
        }
        if (authorized) {
          window.location.hash = windowHash;
        }
        if (!refs.ini) {
          if (refsCache == null) {
            refreshRefs();
          } else {
            setRefs({ ini: true, arr: JSON.parse(localStorage.getItem(`refs-${localStorage.getItem('ownUID')}`)).array });
            refreshRefs();
          }

        }

      }).catch(e => {
        console.log(e)
        setNetErr({ status: true, error: e })
        setTimeout(() => {
          window.location.reload()
        }, 5000);
      });
    }
  }, [windowHash, refs])

  useEffect(() => {
    if (refs.ini && refs.arr.length > 0) {
      if (!hasPubKeys.ini || (hasPubKeys.ini && Date.now() - hasPubKeys.last > 600000 && hasPubKeys.last != 0)) {
        setHasPubKeys({ ini: true, last: Date.now() });
        let uidArr = [];
        for (let ix = 0; ix < refs.arr.length; ix++) {
          uidArr.push(refs.arr[ix].uid);
        }
        axios.post(`${DomainGetter('devx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uidArray: uidArr }).then(res => {
          if (!res.data.error) {
            for (let key in res.data.pubkeyHash) {
              localStorage.setItem(`PUBK-${key}`, res.data.pubkeyHash[key].publicKey);
              localStorage.setItem(`PUBSK-${key}`, res.data.pubkeyHash[key].publicSigningKey);
            }
          }
        });
        axios.post(`${DomainGetter('devx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: 'self' }).then(res => {
          if (!res.data.error) {
            localStorage.setItem(`OWN-PUBK`, res.data.publicKey);
            localStorage.setItem(`OWN-PUBSK`, res.data.publicSigningKey);
          }
        });
      }
    }
  }, [refs])


  const refreshRefs = () => {
    setRefreshingRefs(true);
    let updateUIRefs = [];
    for (let ix = 0; ix < refs.arr.length; ix++) {
      updateUIRefs.push({ ...refs.arr[ix], status: '▣' });
    }
    if (updateUIRefs.length == refs.arr.length) {
      setRefs({ arr: updateUIRefs, ini: true });
    }
    axios.post(`${DomainGetter('devx')}api/dbop?getRefs=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
      if (res.data.refs) {
        if (res.data.refs.length == 0) {
          setRefreshingRefs(false);
        }
        setRefs({ ini: true, arr: res.data.refs });
        localStorage.setItem(`refs-${res.data.ownUID}`, JSON.stringify({ array: res.data.refs }));
        getNewMessageCounts(res);
        checkContactsStatus(messageCountHash.hash);
      }
      localStorage.setItem(`refs-${localStorage.getItem('ownUID')}`, JSON.stringify({ array: res.data.refs }))
    })
  }

  const onHideNotificationsDialog = () => {
    setNotificationsDialogShow(false)
  }


  return (
    <div>
      {/* <Label fontSize="2vh" color="#FF002E" bkg="#150000CC" id="noter" show={showErr} text="Failed to get notification object"></Label> */}
      {/* <Label fontSize="2vh" color="#FF002E" bkg="#150000CC" id="noter2" show={netErr.status} text={`Network Erorr [${netErr.error}]`}></Label> */}
      <NotificationsDialog onHide={onHideNotificationsDialog} show={notificationsDialogShow}></NotificationsDialog>
      <LogsDialog onHide={() => setLogsDialogShow(false)} show={logsDialogShow}></LogsDialog>
      <NavBar onNavButtonClick={onNavButtonClick} wid={windowId}></NavBar>
      <Chats refreshing={refreshingRefs} onRefresh={refreshRefs} switchToNewContactSection={switchToNewContacts} keyStatus={privateKeyStatus} refs={refs} onChatSelected={(uid) => onChatSelected(uid)} show={windowId == 'chats'} wid={windowId}></Chats>
      {windowId == 'chat' ? <Chat isTypingLastUnix={isTypingLastUnix} showIsTyping={showIsTyping} ownMessageBuffer={ownMessageBuffer} privateKeyStatus={privateKeyStatus.found && privateKeyStatus.valid} ownUID={ownUID} visible={windowId == 'chat'} onBackButton={onBackButton} show={windowId == 'chat'} chatObj={chatObj}></Chat> : ''}
      {windowId == 'newContact' ? <NewContact refreshRefs={refreshRefs} show={windowId == 'newContact'}></NewContact> : ''}
      {windowId == 'settings' ? <Settings privateKeyStatus={privateKeyStatus.found && privateKeyStatus.valid} user={{ username: currentUsername, ownUID: ownUID }} show={windowId == 'settings'}></Settings> : ''}
    </div>
  );
}

export default Home;