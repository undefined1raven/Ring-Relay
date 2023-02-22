import { Link } from 'react-router-dom'


function Login() {
  return (
    <div>
      <h1 style={{ color: "#FFF" }}>Epic home</h1>
      <Link to={"login"} style={{color: "#FFF"}}>Login</Link>
    </div>
  );
}

export default Login;