import { useState } from "react";
import { Link } from "react-router-dom";
function ForgotPasswordCodeContainer() {
    const [message, setMessage] = useState("the code you entered is incorrect");
    return (
        <div className='forgotPasswordBox'>
            <form>
                <h2 className='forgotPasswordHeader'>forgot password</h2>
                <input className='forgotPasswordInput' type="text" placeholder="Code" pattern="^[0-9]{8}$" title="Enter a valid 8 digit code"  maxLength={8} required/><br />
                {message && <p className="forgotMessage">{message}</p>}
                <Link className="loginAchor" to="/login"> resend code (currently in developement) </Link>
                <br />
                <Link className="loginAchor" to="/login"> I already have an account login </Link>
                <br />
                <button className="forgotButton" type="submit">submit code</button>
            </form>
        </div>
    );
}

export default ForgotPasswordCodeContainer;