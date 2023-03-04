
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

function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [windowId, setWindowId] = useState('chats');
  const [windowHash, setWindowHash] = useState('/');
  const [refs, setRefs] = useState([]);

  const onNavButtonClick = (btnId) => {
    setWindowId(btnId);
  };
  const onChatSelected = () => {
    setWindowId('chat');
  }
  const onBackButton = () => {
    setWindowId('chats');
  }
  useEffect(() => {
    // onValue(ref(database, '/authTokens'), (snap) => {console.log(`${JSON.stringify((snap.val()))} | tx:${Date.now()}`)})
    if(!authorized){
      axios.post('https://ring-relay-api-prod.vercel.app/api/auth?val=0', { AT: localStorage.getItem('AT'), CIP: localStorage.getItem('CIP') }).then(res => {
        if (!res.data.flag) {
          if (res.data.redirect)
            window.location.hash = `#${res.data.redirect}`;
          setAuthorized(false)
        } else {
          setAuthorized(true)
        }
        if (authorized) {
          window.location.hash = windowHash;
        }
      });
    }
  }, [windowHash])
  const logout = () => {
    localStorage.clear();
    setWindowHash('/login');
  }
  return (
    <div>
      <NavBar onNavButtonClick={onNavButtonClick} wid={windowId}></NavBar>
      <Button show={windowId != 'chat'} onClick={logout} id="logoutBtn" width="99.9%" height="6.46875%" color="#6100DD" bkg="#410094" label="Log Out"></Button>
      <Chats onChatSelected={onChatSelected} show={windowId == 'chats'} wid={windowId}></Chats>
      <Chat onBackButton={onBackButton} show={windowId == 'chat'} chatObj={{ name: 'MCRN 3rd Jupi Fleet', status: 'Online', since: '' }}></Chat>
    </div>
  );
}

export default Home;