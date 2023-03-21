import { Link } from 'react-router-dom'
import WideLogo from '../components/WideLogo.js'
import MinLogo from '../components/MinLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'
import { useEffect, useState } from 'react'
import * as EmailValidator from 'email-validator';
import DomainGetter from '../fn/DomainGetter.js'
import { getKeyPair, keyToPem, getSigningKeyPair, pemToKey } from '../fn/crypto.js';
import axios from 'axios';
import PasswordValidator from '../components/PasswordValidator.js'

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
    const [accountInfoLabel, setAccountInfoLabel] = useState({ color: '#6300E0', label: '[Awaiting account info]' })





    const fieldOnChange = (e, setFn) => {
        setFn(e.target.value);
        validateInput(true);
    }

    function ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
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
        if (username.length > 2 && username.indexOf('@') == -1 && email.length > 2 && EmailValidator.validate(email) && password.length > 7 && !password.match(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/)) {
            setAccountInfoLabel({label: '[Generating Key Pairs]', color: '#001AFF'})
            getKeyPair().then(keys => {
                getSigningKeyPair().then(signingKeys => {
                    setHasKeys(true)
                    keyToPem(keys.privateKey).then(privatePem => {
                        keyToPem(signingKeys.privateKey).then(privateSigningPem => {
                            window.crypto.subtle.exportKey("jwk", signingKeys.publicKey).then(publicSigningJWK => {
                                window.crypto.subtle.exportKey("jwk", keys.publicKey).then(publickJWK => {
                                    localStorage.setItem(`-PK`, privatePem);
                                    localStorage.setItem(`-SPK`, privateSigningPem);
                                    axios.post(`${DomainGetter('prodx')}api/dbop?newUser`, {
                                        username: username,
                                        email: email,
                                        password: password,
                                        PUBKEY: JSON.stringify(publickJWK),
                                        PUBSIGN: JSON.stringify(publicSigningJWK)
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
                        })
                    })
                })
            });
        } else {
            if (!password.match(/[0-9]/)) {
                setAccountInfoLabel({ color: '#FF001F', label: 'Password must contain at least a number' });
            }
            if (!password.match(/[A-Z]/)) {
                setAccountInfoLabel({ color: '#FF001F', label: 'Password must contain at least an upper case letter' });
            }
            if (password.length <= 7) {
                setAccountInfoLabel({ color: '#FF001F', label: 'Password has to have at least 8 chars' });
            }
            if(password.match(/^(|[a-zA-Z0-9]*)$/)){
                setAccountInfoLabel({ color: '#FF001F', label: 'Password has to have at least a symbol' });
            }
            if (!EmailValidator.validate(email)) {
                setAccountInfoLabel({ color: '#FF001F', label: 'Invalid Email' });
            }
            if (username.length <= 2) {
                setAccountInfoLabel({ color: '#FF001F', label: 'Username has to have at least 2 chars' });
            }
            setTimeout(() => {
                setAccountInfoLabel({ color: '#6300E0', label: '[Awaiting account info]' });
            }, 2000);
        }
    }
    return (
        <div>
            <div id="logoBkg"></div>
            <MinLogo id="minLogo"></MinLogo>
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
            <HorizontalLine id="newAccountLn" color="#6100DC" left="5%" top="55%" width="90%"></HorizontalLine>
            <LinkDeco id="linkDeco"></LinkDeco>
            <Label fontSize="2vh" id="privateKeyBackup" show={hasKeys} style={{ width: '79.444444444%', height: '5.46875%' }} color="#001AFF" bkg="#001AFF30" text="[Redirecting]"></Label>
            <Label id="generatingKeyPairLabel" fontSize="2.1vh" show={!hasKeys} bkg={`${accountInfoLabel.color}30`} style={{top: '85.5%', height: '5.46875%'}} color={accountInfoLabel.color} text={accountInfoLabel.label}></Label>
            <Label id="newAccountFailedLabel" fontSize="2vh" show={!newAccountStatus.status} bkg="#FF002E30" color="#FF002E" text={newAccountStatus.label}></Label>
            <PasswordValidator top="49%" password={password}></PasswordValidator>
            <Link to={"/login"}><Button show={newAccountStatus.status} style={{top: '77.3%', fontSize: '1.9vh'}} id="goToLoginButton" width="79.444444444%" height="5.46875%" color="#6000D9" bkg="#6000D9" label="Already have an account? Log In"></Button></Link>
        </div>
    );
}

export default NewAccount;