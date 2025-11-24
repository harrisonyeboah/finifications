import { useState } from "react";
function ForgotPasswordContainer() {
    const [message, setMessage] = useState("This password reset link has expired");
    return (
        <div className='forgotPasswordBox'>
            <form>
                <h2 className='forgotPasswordHeader'>forgot password</h2>
                <input className='forgotPasswordInput' type="email" placeholder="Email Address" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="Enter a valid email address" required/><br />
                {message && <p className="forgotMessage">{message}</p>}
                <a className='forgotPasswordAchor' href="https://www.youtube.com/"> Go Back to Login </a>
                <br />
                <button className="forgotButton" type="submit">Submit Email</button>
            </form>
        </div>
    );
}

export default ForgotPasswordContainer;
