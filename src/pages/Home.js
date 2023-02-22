import { Link } from 'react-router-dom'


function Login() {
  return (
    <div>
      <h1 style={{ color: "#FFF" }}>Epic home</h1>
      <Link to={"newAccount"} style={{color: "#FFF"}}>New Account</Link>
    </div>
  );
}

export default Login;