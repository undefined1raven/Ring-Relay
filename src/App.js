import './App.scss';
import { Route, Routes } from 'react-router-dom'
import NewAccount from './pages/NewAccount'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
        <Route exact path="newAccount" element={<NewAccount/>}></Route>
        <Route exact path="/" element={<Home/>}></Route>
    </Routes>
  );
}

export default App;
