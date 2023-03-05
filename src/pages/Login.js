
import { Link } from 'react-router-dom'
import WideLogo from '../components/WideLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react'
import DomainGetter from '../fn/DomainGetter.js'
import axios from 'axios';


function setItem(key, value) {
    window.localStorage.setItem(key, value);
}


function Login() {
    const [usernameFieldColor, setUsernameFieldColor] = useState("#6100DC");
    const [authStatusLabelObj, setAuthStatusLabelObj] = useState({ color: '#8F00FF', bkg: '#6100DC', text: '[Awaiting Credentials]' });
    const [locationHash, setLocationHash] = useState('#/login');
    const [passwordFieldColor, setPasswordFieldColor] = useState("#6100DC");
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        window.location.hash = locationHash;
    }, [locationHash])

    const fieldOnChange = (e, setFn) => {
        setFn(e.target.value);
        validateInput(true);
    }

    function auth(cip) {
        axios.post(`${DomainGetter('prodx')}api/auth`, {//https://ring-relay-api-prod.vercel.app/api/auth|http://localhost:3001/api/auth
            userid: userid,
            password: password,
            ip: cip
        }).then(res => {
            if (res.data['redirect']) {
                setItem('AT', res.data['AT'])
                setItem('CIP', cip)
                setAuthStatusLabelObj({ text: 'Auth Complete', color: '#00FF85', bkg: '#00FF85' });
                setTimeout(() => {
                    setLocationHash('#');
                }, 100);
            } else {
                setAuthStatusLabelObj({ text: 'Auth Failed [NSE]', color: '#D80027', bkg: '#D80027' });
                setTimeout(() => {
                    setAuthStatusLabelObj({ color: '#8F00FF', bkg: '#6100DC', text: '[Awaiting Credentials]' });
                }, 2000);
            }
        }).catch(e => {
            setAuthStatusLabelObj({ text: 'Auth Failed [SER]', color: '#D80027', bkg: '#D80027' });
            setTimeout(() => {
                setAuthStatusLabelObj({ color: '#8F00FF', bkg: '#6100DC', text: '[Awaiting Credentials]' });
            }, 2000);
        });
    }

    const validateInput = (continous) => {
        if (setUserid.length < 2) {
            setUsernameFieldColor("#FF002E");
            setTimeout(() => {
                if (!continous) {
                    setUsernameFieldColor("#6100DC");
                }
            }, 1000);
        } else {
            setUsernameFieldColor("#6100DC");
        }
        if (password.length < 6) {
            setPasswordFieldColor("#FF002E");
            setTimeout(() => {
                if (!continous) {
                    setPasswordFieldColor("#6100DC");
                }
            }, 1000);
        } else {
            setPasswordFieldColor("#6100DC");
        }
    }

    const submit = (e) => {
        validateInput(false);
        e.preventDefault();
        if (userid.length > 2 && password.length > 5) {
            setAuthStatusLabelObj({ text: '[Awaiting Response]', color: '#0057FF', bkg: '#0057FF' });
            axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=dd09c5fe81bb40f09731ac62189a515c`).then(res => {
                auth(res.data.ip_address);
            }).catch(e => {
                auth('Failed To Get');
            });
        }else{
            setAuthStatusLabelObj({ text: '[Invalid Input]', color: '#D80027', bkg: '#D80027' });
            setTimeout(() => {
                setAuthStatusLabelObj({ color: '#8F00FF', bkg: '#6100DC', text: '[Awaiting Credentials]' });
            }, 1000);
        }

    }
    return (
        <div>
            <WideLogo></WideLogo>
            <form onSubmit={submit}>
                <InputField color={usernameFieldColor} onChange={(e) => fieldOnChange(e, setUserid)} value={userid} id="loginUsernameField" type="text" placeholder="Username/Email" name="userid"></InputField>
                <InputField color={passwordFieldColor} onChange={(e) => fieldOnChange(e, setPassword)} value={password} id="loginPasswordField" type="password" placeholder="Password" name="password"></InputField>
                <button type='submit' style={{ backgroundColor: '#00000000', outline: 'none', border: 'none' }}>
                    <Button onClick={submit} id="createAccount" width="99.9%" height="6.46875%" color="#8F00FF" bkg="#6100DC" label="Log In"></Button>
                </button>
            </form>
            <Label id="AuthStatusLabel" className="newAccountLabel" text={authStatusLabelObj.text} color={authStatusLabelObj.color} bkg={`${authStatusLabelObj.bkg}20`} fontSize="2.2vh"></Label>
            <Label id="E2ELabel" className="newAccountLabel x0" text="End-to-end Encrypted" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <Label id="MsgAuthLabel" className="newAccountLabel x1" text="Message Origin Authentication" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <Label id="NoPlainLabel" className="newAccountLabel x2" text="Plaintext never hits the servers" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <HorizontalLine id="newAccountLn" color="#6100DC" left="10.277777778%" top="55%" width="79.444444444%"></HorizontalLine>
            <Button id="resetPasswordButton" width="79.444444444%" height="5.46875%" color="#6100DC" bkg="#6100DC" label="Reset Password"></Button>

            <LinkDeco id="linkDeco"></LinkDeco>
            <Link to={"/newAccount"}><Button id="createAccountButton" width="79.444444444%" height="5.46875%" color="#6000D9" bkg="#6000D9" label="Create Account"></Button></Link>
        </div>
    );
}

export default Login;