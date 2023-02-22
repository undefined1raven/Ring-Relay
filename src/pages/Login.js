import { Link } from 'react-router-dom'
import WideLogo from '../components/WideLogo.js'
import InputField from '../components/InputField.js'


function Home() {
    return (
        <div>
            <WideLogo></WideLogo>
            <form>
                <InputField id="usernameField" type="text" placeholder="Username" name="username"></InputField>
                <InputField id="emailField" type="email" placeholder="Email" name="email"></InputField>
                <InputField id="passwordField" type="password" placeholder="Password" name="username"></InputField>
            </form>
            <Link to={"/"} style={{ color: "#FFF", position: 'absolute', top: '50%' }}>Home</Link>
        </div>
    );
}

export default Home;