
import { Link } from 'react-router-dom'
import MinLogo from '../components/WideLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import NavBar from '../components/NavBar.js'
import Chats from '../components/Chats.js'
import { useEffect, useState } from 'react'
import axios from 'axios';


function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [windowId, setWindowId] = useState('chats');
  const [windowHash, setWindowHash] = useState('/');

  useEffect(() => {
    axios.post('https://ring-relay-api-prod.vercel.app/api/auth?val=0', { AT: sessionStorage.getItem('AT'), CIP: sessionStorage.getItem('CIP') }).then(res => {
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
    }, [windowHash]);
  })
  const logout = () => {
    sessionStorage.clear();
    setWindowHash('/login');
  }
  return (
    <div>
      <NavBar wid={windowId}></NavBar>
      <Button onClick={logout} id="logoutBtn" width="99.9%" height="6.46875%" color="#6100DD" bkg="#410094" label="Log Out"></Button>
      <Chats wid={windowId}></Chats>
    </div>
  );
}

export default Home;