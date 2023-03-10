
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
import NewContact from '../components/NewContact.js'
import DomainGetter from '../fn/DomainGetter.js'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { pemToKey, encryptMessage, decryptMessage, getKeyPair, keyToPem, JSONtoKey } from '../fn/crypto.js'

import { initializeApp } from "firebase/app";
import { getDatabase, get, remove, set, ref, onValue } from "firebase/database";
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

const db = getDatabase(app)

function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [windowId, setWindowId] = useState('chats');
  const [windowHash, setWindowHash] = useState('/');
  const [refs, setRefs] = useState({ ini: false, arr: [] });
  const [chatObj, setChatObj] = useState({ uid: '', name: '', status: '', since: '' });
  const [currentUsername, setCurrentUsername] = useState(0);
  const [ownUID, setOwnUID] = useState(0);
  const [privateKeyStatus, setPrivateKeyStatus] = useState({ found: false, valid: false, ini: false });


  const onNavButtonClick = (btnId) => {
    setWindowId(btnId);
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
    setWindowId('chats');
  }

  useEffect(() => {
    if (chatObj.uid != '' && windowId != 'newContact') {
      setWindowId('chat');
    }
  });

  useEffect(() => {
    window.location.hash = windowHash;
    if (!authorized) {
      axios.post(`${DomainGetter('prodx')}api/auth?val=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
        if (!res.data.flag) {
          if (res.data.redirect)
            window.location.hash = `#${res.data.redirect}`;
          setAuthorized(false)
        } else {
          setAuthorized(true)
          setOwnUID(res.data.ownUID);
          setCurrentUsername(res.data.username);
          if (localStorage.getItem('-PK') != undefined) {
            localStorage.setItem(res.data.PKGetter, localStorage.getItem('-PK'));
            localStorage.removeItem('-PK');
          }
          localStorage.setItem('PKGetter', res.data.PKGetter);
          if (localStorage.getItem(res.data.PKGetter) != undefined) {
            pemToKey(localStorage.getItem(res.data.PKGetter)).then(pk => {
              if (pk.algorithm.name == 'RSA-OAEP') {
                setPrivateKeyStatus({ valid: true, found: true, ini: true });
              } else {
                setPrivateKeyStatus({ valid: false, found: true, ini: true });
              }
            });
          } else {
            setPrivateKeyStatus({ valid: false, found: false, ini: true });
          }
          if (!refs.ini) {
            axios.post(`${DomainGetter('prodx')}api/dbop?getRefs=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
              setRefs({ ini: true, arr: res.data.refs });
            })
          }
        }
        if (authorized) {
          window.location.hash = windowHash;
        }
      });
    }
  }, [windowHash, refs])
  const logout = () => {
    localStorage.removeItem('AT');
    localStorage.removeItem('CIP');
    setWindowHash('#/login');
  }
  return (
    <div>
      <NavBar onNavButtonClick={onNavButtonClick} wid={windowId}></NavBar>
      {windowId == 'settings' ? <Button show={windowId != 'chat' && refs.ini} onClick={logout} id="logoutBtn" width="90%" fontSize="2.3vh" height="6.46875%" color="#878787" bkg="#410093" label="Log Out"></Button> : ''}
      <Chats switchToNewContactSection={switchToNewContacts} keyStatus={privateKeyStatus} refs={refs} onChatSelected={(uid) => onChatSelected(uid)} show={windowId == 'chats'} wid={windowId}></Chats>
      {windowId == 'chat' ? <Chat ownUID={ownUID} visible={windowId == 'chat'} onBackButton={onBackButton} show={windowId == 'chat'} chatObj={chatObj}></Chat> : ''}
      <NewContact show={windowId == 'newContact'}></NewContact>
      {windowId == 'settings' ? <Settings user={{username: currentUsername, ownUID: ownUID}} show={windowId == 'settings'}></Settings> : ''}
    </div>
  );
}

export default Home;