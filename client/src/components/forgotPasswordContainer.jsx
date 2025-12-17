import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function ForgotPasswordContainer() {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const { commited, setCommited } = useContext(AppContext);
    const navigate = useNavigate();

    const PRODBACKEND = "https://finifications.onrender.com";
    const LOCALBACKEND = "http://localhost:8080";

    const CURRENTBACKEND = PRODBACKEND;

    const handleChange = (e) => {
        setEmail(e.target.value); // Update the state directly with the new value
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${CURRENTBACKEND}/api/validateBeforeCode`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email})
        }); 
        console.log(email);
        if (response.status === 200) {
            const data = await response.json();
            sessionStorage.setItem("forSession", data.forSession); 
            console.log(sessionStorage.getItem("forSession"));
            setCommited(true);
            navigate('/forgot-password/code'); // Redirect to dashboard or another page
        } else {
            const data = await response.json();
            console.log(data);
            setMessage(data.message);
        }

        } catch(error) {
            console.error("Error submiting email.");
            setMessage("Error sending email") // This probably means there is a front end fetch error. 
        }
    }

    return (
        <div className='forgotPasswordBox'>
            <form onSubmit={handleSubmit}>
                <h2 className='forgotPasswordHeader'>forgot password</h2>
                <input className='forgotPasswordInput' onChange={handleChange} type="email" placeholder="Email Address" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="Enter a valid email address" required/><br />
                {message && <p className="forgotMessage">{message}</p>}
                <Link className='forgotPasswordAchor' to="/login"> Go Back to Login </Link>
                <br />
                <button className="forgotButton" type="submit">Submit Email</button>
            </form>
        </div>
    );
}

export default ForgotPasswordContainer;
