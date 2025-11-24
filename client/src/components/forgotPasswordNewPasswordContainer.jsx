import { useState } from "react";
function ForgotPasswordNewPasswordContainer() {
    const [message, setMessage] = useState("This password reset link has expired");
    return (
        <div className='forgotPasswordBox'>
            <form>
                <h2 className='forgotPasswordHeader'>forgot password</h2>
                <input className='forgotPasswordInput' type="password" placeholder="Password" minLength={8} title="Enter a password with at least 8 chars" required/><br />
                <input className='forgotPasswordInput' type="password" placeholder="Confirm Password" minLength={8} title="Enter a password with at least 8 chars" required/><br />
                {message && <p className="forgotMessage">{message}</p>}
                <a className='forgotPasswordAchor' href="https://www.youtube.com/"> Go Back to Login </a>
                <br />
                <button className="forgotButton" type="submit">Submit New Password </button>
            </form>
        </div>
    );
}

export default ForgotPasswordNewPasswordContainer;