import './App.scss';
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
        <Route exact path="login" element={<Login/>}></Route>
        <Route exact path="/" element={<Home/>}></Route>
    </Routes>
  );
}

export default App;
