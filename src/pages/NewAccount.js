import { Link } from 'react-router-dom'
import WideLogo from '../components/WideLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react'
import * as EmailValidator from 'email-validator';
import DomainGetter from '../fn/DomainGetter.js'
import { getKeyPair, keyToPem, encryptMessage, decryptMessage } from '../fn/crypto.js';
import axios from 'axios';

function NewAccount() {
    const [usernameFieldColor, setUsernameFieldColor] = useState("#6100DC");
    const [emailFieldColor, setEmailFieldColor] = useState("#6100DC");
    const [passwordFieldColor, setPasswordFieldColor] = useState("#6100DC");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [windowHash, setWindowHash] = useState("#/newAccount");
    const [newAccountStatus, setNewAccountStatus] = useState({ status: true, error: '', label: '' });
    const [backupPrivateKeyButtonProps, setBackupPrivateKeyButtonProps] = useState({ label: '', color: '#0057FF' });
    const [hasKeys, setHasKeys] = useState(false);

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    const fieldOnChange = (e, setFn) => {
        setFn(e.target.value);
        validateInput(true);
    }

    useEffect(() => {
        window.location.hash = windowHash;
    }, [windowHash])

    const privateKeyBackupOnClick = () => {
        // if (privateKeyPem != undefined) {
        //     download('ring-relay-key.pem', privateKeyPem);
        // }
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
            getKeyPair().then(keys => {
                setHasKeys(true)
                keyToPem(keys.privateKey).then(privatePem => {
                    window.crypto.subtle.exportKey("jwk", keys.publicKey).then(publickJWK => {
                        localStorage.setItem(`-PK`, privatePem);
                        axios.post(`${DomainGetter('prodx')}api/dbop?newUser`, {
                            username: username,
                            email: email,
                            password: password,
                            PUBKEY: JSON.stringify(publickJWK),
                        }).then(res => {
                            if (res.data.status == 'Success') {
                                setWindowHash('/login');
                            } else {
                                setNewAccountStatus({ status: false, label: `Failed to create new account [${res.data.error}]` })
                                setTimeout(() => {
                                    setNewAccountStatus({ status: true, label: `` })
                                }, 2000);
                            }
                        }).catch(e => {
                            setNewAccountStatus({ status: false, label: `Failed to create new account [L-65]` })
                            setTimeout(() => {
                                setNewAccountStatus({ status: true, label: `` })
                            }, 2000);
                        });
                    })
                })

            });
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
            <Button id="privateKeyBackup" show={hasKeys} onClick={privateKeyBackupOnClick} width="79.444444444%" height="5.46875%" color="#FF002E" bkg="#FF002E" label="Tap here to back-up your private key"></Button>
            <Label id="generatingKeyPairLabel" fontSize="2vh" show={!hasKeys} bkg="#0057FF40" color="#0057FF" text="<Generating Key Pair>"></Label>
            <Label id="newAccountFailedLabel" fontSize="2vh" show={!newAccountStatus.status} bkg="#FF002E30" color="#FF002E" text={newAccountStatus.label}></Label>
            <Link to={"/login"}><Button show={newAccountStatus.status} id="goToLoginButton" width="79.444444444%" height="3.46875%" color="#6000D9" bkg="#6000D9" label="Login"></Button></Link>
        </div>
    );
}

export default NewAccount;