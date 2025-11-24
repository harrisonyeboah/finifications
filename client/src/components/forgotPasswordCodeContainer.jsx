import { useState } from "react";
function ForgotPasswordCodeContainer() {
    const [message, setMessage] = useState("the code you entered is incorrect");
    return (
        <div className='forgotPasswordBox'>
            <form>
                <h2 className='forgotPasswordHeader'>forgot password</h2>
                <input className='forgotPasswordInput' type="text" placeholder="Code" pattern="^[0-9]{8}$" title="Enter a valid 8 digit code"  maxLength={8} required/><br />
                {message && <p className="forgotMessage">{message}</p>}
                <a className='forgotPasswordAchor' href="https://www.youtube.com/"> go back to login </a>
                <br />
                <button className='resendCode' href="https://www.youtube.com/"> resend code </button>
                <br />
                <button className="forgotButton" type="submit">submit code</button>
            </form>
        </div>
    );
}

export default ForgotPasswordCodeContainer;