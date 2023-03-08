
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
import NewContact from '../components/NewContact.js'
import DomainGetter from '../fn/DomainGetter.js'
import { pemToBuffer } from '../fn/crypto.js';
import { useEffect, useState } from 'react'
import axios from 'axios';
// import { initializeApp } from "firebase/app";
// import { getDatabase, get, ref, onValue } from "firebase/database";
// import { getAuth, signInWithCustomToken } from "firebase/auth";



// const firebaseConfig = {

// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// // Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [windowId, setWindowId] = useState('chats');
  const [windowHash, setWindowHash] = useState('/');
  const [refs, setRefs] = useState({ ini: false, arr: [] });
  const [chatObj, setChatObj] = useState({});
  const [currentUsername, setCurrentUsername] = useState(0);
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
    setWindowId('chat');
  }
  const switchToNewContacts = () => {
    setWindowId('newContact')
  }
  const onBackButton = () => {
    setWindowId('chats');
  }
  useEffect(() => {
    window.location.hash = windowHash;
    // onValue(ref(database, '/authTokens'), (snap) => {console.log(`${JSON.stringify((snap.val()))} | tx:${Date.now()}`)})
    if (!authorized) {
      axios.post(`${DomainGetter('prodx')}api/auth?val=0`, { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
        if (!res.data.flag) {
          if (res.data.redirect)
            window.location.hash = `#${res.data.redirect}`;
          setAuthorized(false)
        } else {
          setAuthorized(true)
          setCurrentUsername(res.data.username);
          if (localStorage.getItem('-PK') != undefined) {
            localStorage.setItem(res.data.PKGetter, localStorage.getItem('-PK'));
            localStorage.removeItem('-PK');
          }
          if (localStorage.getItem(res.data.PKGetter) != undefined) {
            const pkBuf = pemToBuffer(localStorage.getItem(res.data.PKGetter));
            window.crypto.subtle.importKey('pkcs8', pkBuf, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']).then(pk => {
              if (pk.algorithm.name == 'RSA-OAEP') {
                setPrivateKeyStatus({ valid: true, found: true, ini: true });
              } else {
                setPrivateKeyStatus({ valid: false, found: true, ini: true });
              }
            }).catch(e => { setPrivateKeyStatus({ valid: false, found: true, ini: true }); })
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
      <Button show={windowId != 'chat' && refs.ini} onClick={logout} id="logoutBtn" width="99.9%" height="6.46875%" color="#6100DD" bkg="#410094" label="Log Out"></Button>
      <Label show={currentUsername != 0} color="#6100DC" fontSize="1.3vh" bkg="#00000000" id="loggedInAsLabel" text={`Logged in as ${currentUsername}`}></Label>
      <Chats switchToNewContactSection={switchToNewContacts} keyStatus={privateKeyStatus} refs={refs} onChatSelected={(uid) => onChatSelected(uid)} show={windowId == 'chats'} wid={windowId}></Chats>
      <Chat onBackButton={onBackButton} show={windowId == 'chat'} chatObj={chatObj}></Chat>
      <NewContact show={windowId == 'newContact'}></NewContact>
    </div>
  );
}

export default Home;