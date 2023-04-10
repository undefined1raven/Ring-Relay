import './App.scss';
import { Route, Routes } from 'react-router-dom'
import NewAccount from './pages/NewAccount'
import Login from './pages/Login'
import Home from './pages/Home'
import { useEffect, useState } from 'react';
import { deviceType } from 'react-device-detect';

function App() {

  useEffect(() => {
    document.title = 'Ring Relay'
    window['realtimeBufferIni'] = false;
  }, [])

  return (
    <Routes>
      {deviceType == 'mobile' || deviceType == 'tablet' ?
        <>
          <Route exact path="newAccount" element={<NewAccount />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/" element={<Home />}></Route>
        </> :
        <>
          <Route exact path="/" element={
            <>
              <div style={{ whiteSpace: 'nowrap', transform: 'translate(-50%, -50%)', position: 'absolute', top: '50%', left: '50%', color: '#FFF', fontSize: "2vh" }}>The Ring Relay is currently available for mobile devices only</div>
            </>
          }></Route>
        </>}
    </Routes>
  );
}

export default App;
