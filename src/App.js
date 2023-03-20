import './App.scss';
import { Route, Routes } from 'react-router-dom'
import NewAccount from './pages/NewAccount'
import Login from './pages/Login'
import Home from './pages/Home'
import { useEffect, useState } from 'react';

function App() {

  useEffect(() => {
    document.title = 'Ring Relay'
    window['realtimeBufferIni'] = false;
  }, [])

  return (
    <Routes>
      <Route exact path="newAccount" element={<NewAccount />}></Route>
      <Route exact path="/login" element={<Login />}></Route>
      <Route exact path="/" element={<Home />}></Route>
    </Routes>
  );
}

export default App;
