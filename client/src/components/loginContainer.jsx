import { useState } from "react";
function LoginContainer() {
    const [message, setMessage] = useState("this username or password is incorrect");
    return (
        <div className='loginBox'>
            <form>
                <h2 className='loginHeader'>login</h2>
                <input className='loginInput' type="text" placeholder="username" /><br />
                <input className='loginInput' type="password" placeholder="password" /><br />
                {message && <p className="loginMessage">{message}</p>}
                <a className='loginAchor' href="https://www.youtube.com/"> forgot password? </a>
                <br />
                <a className='loginAchor' href="https://www.youtube.com/"> don't have an account register </a>
                <br />
                <button className="loginButton" type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginContainer;
