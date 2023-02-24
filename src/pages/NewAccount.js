import { Link } from 'react-router-dom'
import WideLogo from '../components/WideLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import { useState } from 'react'
import * as EmailValidator from 'email-validator';
import axios from 'axios';

function NewAccount() {
    const [usernameFieldColor, setUsernameFieldColor] = useState("#6100DC");
    const [emailFieldColor, setEmailFieldColor] = useState("#6100DC");
    const [passwordFieldColor, setPasswordFieldColor] = useState("#6100DC");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const fieldOnChange = (e, setFn) => {
        setFn(e.target.value);
        validateInput(true);
    }

    const validateInput = (continous) => {
        if (username.length < 2 || username.indexOf('@') != -1) {
            setUsernameFieldColor("#FF002E");
            setTimeout(() => {
                if (!continous) {
                    setUsernameFieldColor("#6100DC");
                }
            }, 1000);
        } else {
            setUsernameFieldColor("#6100DC");
        }
        if (email.length < 2 || !EmailValidator.validate(email)) {
            setEmailFieldColor("#FF002E");
            setTimeout(() => {
                if (!continous) {
                    setEmailFieldColor("#6100DC");
                }
            }, 1000);
        } else {
            setEmailFieldColor("#6100DC");
        }
        if (password.length < 6 || !password.match(/[0-9]/) || !password.match(/[A-Z]/)) {
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
        if (username.length > 2 && username.indexOf('@') == -1 && email.length > 2 && EmailValidator.validate(email) && password.length > 6 && password.match(/[0-9]/) && password.match(/[A-Z]/)) {
            axios.post('https://ring-relay-api-prod.vercel.app/api/dbop?newUser', {
                username: username,
                email: email,
                password: password,
            }).then(res => {
            }).catch(e => { console.log(e) });
        }
    }
    return (
        <div>
            <WideLogo></WideLogo>
            <form onSubmit={submit}>
                <InputField color={usernameFieldColor} onChange={(e) => fieldOnChange(e, setUsername)} value={username} id="usernameField" type="text" placeholder="Username" name="username"></InputField>
                <InputField color={emailFieldColor} onChange={(e) => fieldOnChange(e, setEmail)} value={email} id="emailField" type="email" placeholder="Email" name="email"></InputField>
                <InputField color={passwordFieldColor} onChange={(e) => fieldOnChange(e, setPassword)} value={password} id="passwordField" type="password" placeholder="Password" name="password"></InputField>
                <button type='submit' style={{ backgroundColor: '#00000000', outline: 'none', border: 'none' }}>
                    <Button onClick={submit} id="createAccount" width="99.9%" height="6.46875%" color="#8F00FF" bkg="#6100DC" label="Create Account"></Button>
                </button>
            </form>
            <Label id="E2ELabel" className="newAccountLabel x0" text="End-to-end Encrypted" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <Label id="MsgAuthLabel" className="newAccountLabel x1" text="Message Origin Authentication" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <Label id="NoPlainLabel" className="newAccountLabel x2" text="Plaintext never hits the servers" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <HorizontalLine id="newAccountLn" color="#6100DC" left="10.277777778%" top="55%" width="79.444444444%"></HorizontalLine>
            <LinkDeco id="linkDeco"></LinkDeco>
            <Button id="privateKeyBackup" width="79.444444444%" height="5.46875%" color="#FF002E" bkg="#FF002E" label="Tap here to back-up your private key"></Button>
            <Link to={"/login"}><Button id="goToLoginButton" width="79.444444444%" height="3.46875%" color="#6000D9" bkg="#6000D9" label="Login"></Button></Link>
        </div>
    );
}

export default NewAccount;