import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom'


function Home() {
  useEffect(() => {
    axios.post('https://ring-relay-api-prod.vercel.app/api/auth?val=0', {AT: sessionStorage.getItem('AT'), CIP: sessionStorage.getItem('CIP')}).then(res => {
      if(!res.data.flag){
        if(res.data.redirect)
        window.location.hash = `#${res.data.redirect}`;
      }
    });
  })
  return (
    <div>
      <h1 style={{ color: "#FFF" }}>{`Logged in as ${sessionStorage.getItem('AT')}`}</h1>
      <Link to={"newAccount"} style={{ color: "#FFF" }}>New Account</Link>
    </div>
  );
}

export default Home;