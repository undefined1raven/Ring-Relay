import { Link } from 'react-router-dom'
import WideLogo from '../components/WideLogo.js'
import LinkDeco from '../components/LinkDeco.js'
import InputField from '../components/InputField.js'
import Label from '../components/Label.js'
import HorizontalLine from '../components/HorizontalLine.js'
import Button from '../components/Button.js'


function NewAccount() {
    const submit = () => {
        console.log(Date.now())
    }
    return (
        <div>
            <WideLogo></WideLogo>
            <form onSubmit={submit}>
                <InputField id="usernameField" type="text" placeholder="Username" name="username"></InputField>
                <InputField id="emailField" type="email" placeholder="Email" name="email"></InputField>
                <InputField id="passwordField" type="password" placeholder="Password" name="username"></InputField>
                <button type='submit' style={{backgroundColor: '#00000000', outline: 'none', border: 'none'}}>
                    <Button id="createAccount" width="99.9%" height="6.46875%" color="#8F00FF" bkg="#6100DC" label="Create Account"></Button>
                </button>
            </form>
            <Label id="E2ELabel" className="newAccountLabel x0" text="End-to-end Encrypted" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <Label id="MsgAuthLabel" className="newAccountLabel x1" text="Message Origin Authentication" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <Label id="NoPlainLabel" className="newAccountLabel x2" text="Plaintext never hits the servers" color="#9745FF" bkg="#6100DC40" fontSize="1.9vh"></Label>
            <HorizontalLine id="newAccountLn" color="#6100DC" left="10.277777778%" top="55%" width="79.444444444%"></HorizontalLine>
            <LinkDeco id="linkDeco"></LinkDeco>
            <Button id="privateKeyBackup" width="79.444444444%" height="5.46875%" color="#FF002E" bkg="#FF002E" label="Tap here to back-up your private key"></Button>
            <Link to={"/"} style={{ color: "#FFF", position: 'absolute', top: '50%' }}>Home</Link>
        </div>
    );
}

export default NewAccount;