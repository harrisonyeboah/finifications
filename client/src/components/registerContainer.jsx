import { useState } from "react";
function RegisterContainer() {
    const [message, setMessage] = useState(" This username is already taken");
    return (
        <div className='registerBox'>
            <form>
                <h2 className='registerHeader'>register</h2>
                <input className='registerInput' type="text" placeholder="First Name" /><br />
                <input className='registerInput' type="text" placeholder="Last Name" /><br />
                <input className='registerInput' type="text" placeholder="Username" /><br />
                <input className='registerInput' type="password" placeholder="Password" /><br />
                <input className='registerInput' type="email" placeholder="Email Address" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="Enter a valid email address" required/><br />
                <input className='registerInput' type="tel" placeholder="676-767-6767" pattern="^\d{3}-\d{3}-\d{4}$" title="Format: 123-456-7890" required/><br />
                {message && <p className="registerMessage">{message}</p>}
                <a className='registerAchor' href="https://www.youtube.com/"> Have an account? Login. </a>
                <br />
                <button className="registerButton" type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterContainer;
