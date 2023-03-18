
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
import NewContact from '../components/NewContact.js'
import DomainGetter from '../fn/DomainGetter.js'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { pemToKey, encryptMessage, decryptMessage, getKeyPair, keyToPem, JSONtoKey } from '../fn/crypto.js'

import { initializeApp } from "firebase/app";
import { getDatabase, get, remove, set, ref, onValue } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";
const vapidKey = 'BFSoRotMDxZgPJtMb8J_GeyNb-rbx_vtDjotbA2W7PRYw10Z13UR6uACNbF-CELRZhtzY1z0_Z-CmncHKvNvIG8'

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

  const refsCache = localStorage.getItem(`refs-${localStorage.getItem('ownUID')}`);

  const onNavButtonClick = (btnId) => {
    if (windowId == 'chat') {
      onBackButton();
      setWindowId(btnId);
    } else {
      setWindowId(btnId);
    }
    refreshRefs();
  };
  const onChatSelected = (uid) => {
    for (let ix = 0; ix < refs.arr.length; ix++) {
      if (refs.arr[ix].uid == uid) {
        setChatObj({ uid: uid, name: refs.arr[ix].name, status: refs.arr[ix].status, since: refs.arr[ix].since })
      }
    }
  }
  const switchToNewContacts = () => {
    setWindowId('newContact')
  }
  const onBackButton = () => {
    remove(ref(db, `messageBuffer/${ownUID}`));
    setChatObj({ uid: '', name: '', status: '', since: '' })
    refreshRefs();
    setWindowId('chats');
  }

  useEffect(() => {
    if (chatObj.uid != '' && windowId != 'newContact') {
      setWindowId('chat');
    }
  });

  useEffect(() => {
    if (Notification.permission == 'granted') {
      oneSig.registerForPushNotifications();
    } else if (Notification.permission == 'default' || Notification.permission == 'denied') {
      setNotificationsDialogShow(true);
    }
  }, [])

  useEffect(() => {
    window.location.hash = windowHash;
    if (!authorized) {
      axios.post(`${DomainGetter('prodx')}api/auth?val=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
        if (!res.data.flag) {
          window.location.hash = `#${res.data.redirect}`;
          setAuthorized(false)
          localStorage.removeItem('refs')
        } else {
          setAuthorized(true)
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
            axios.post(`${DomainGetter('prodx')}api/dbop?getRefs=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
              if (res.data.refs) {
                setRefs({ ini: true, arr: res.data.refs });
                localStorage.setItem(`refs-${res.data.ownUID}`, JSON.stringify({ array: res.data.refs }));
              }
            })
          } else {
            setRefs({ ini: true, arr: JSON.parse(localStorage.getItem(`refs-${localStorage.getItem('ownUID')}`)).array });
          }

        }

      }).catch(e => {
        console.log(e)
        setTimeout(() => {
          window.location.reload()
        }, 5000);
      });
    }
  }, [windowHash, refs])

  useEffect(() => {
    if (refs.ini && refs.arr.length > 0) {
      for (let ix = 0; ix < refs.arr.length; ix++) {
        axios.post(`${DomainGetter('prodx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: refs.arr[ix].uid }).then(res => {
          if (!res.data.error) {
            localStorage.setItem(`PUBK-${refs.arr[ix].uid}`, res.data.publicKey);
            localStorage.setItem(`PUBSK-${refs.arr[ix].uid}`, res.data.publicSigningKey);
          }
        });
      }
      axios.post(`${DomainGetter('prodx')}api/dbop?getPubilcKey`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP'), uid: 'self' }).then(res => {
        if (!res.data.error) {
          localStorage.setItem(`OWN-PUBK`, res.data.publicKey);
          localStorage.setItem(`OWN-PUBSK`, res.data.publicSigningKey);
        }
      });
    }
  }, [refs])


  const refreshRefs = () => {
    setRefreshingRefs(true);
    axios.post(`${DomainGetter('prodx')}api/dbop?getRefs=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
      setRefreshingRefs(false);
      setRefs({ ini: true, arr: res.data.refs });
      localStorage.setItem(`refs-${localStorage.getItem('ownUID')}`, JSON.stringify({ array: res.data.refs }))
    })
  }

  const onHideNotificationsDialog = () => {
    setNotificationsDialogShow(false)
  }

  return (
    <div>
      <NotificationsDialog onHide={onHideNotificationsDialog} show={notificationsDialogShow}></NotificationsDialog>
      <NavBar onNavButtonClick={onNavButtonClick} wid={windowId}></NavBar>
      <Chats refreshing={refreshingRefs} onRefresh={refreshRefs} switchToNewContactSection={switchToNewContacts} keyStatus={privateKeyStatus} refs={refs} onChatSelected={(uid) => onChatSelected(uid)} show={windowId == 'chats'} wid={windowId}></Chats>
      {windowId == 'chat' ? <Chat ownUID={ownUID} visible={windowId == 'chat'} onBackButton={onBackButton} show={windowId == 'chat'} chatObj={chatObj}></Chat> : ''}
      {windowId == 'newContact' ? <NewContact refreshRefs={refreshRefs} show={windowId == 'newContact'}></NewContact> : ''}
      {windowId == 'settings' ? <Settings privateKeyStatus={privateKeyStatus.found && privateKeyStatus.valid} user={{ username: currentUsername, ownUID: ownUID }} show={windowId == 'settings'}></Settings> : ''}
    </div>
  );
}

export default Home;