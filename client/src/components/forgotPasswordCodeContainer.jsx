import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";


function ForgotPasswordCodeContainer() {
    const [message, setMessage] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    const { commited, setCommited } = useContext(AppContext);
    // This is it 
    
    const PRODBACKEND = "https://finifications.onrender.com";
    const LOCALBACKEND = "http://localhost:8080";

    const CURRENTBACKEND = PRODBACKEND; 
    useEffect(() => {
        if (!commited) {
            setCommited(false);
            setMessage("you must enter your code.")
            navigate('/forgot-password');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCode(e.target.value); // Update the state directly with the new value
    }

    const handleSubmit = async (e) => {
        const myId = sessionStorage.getItem("forSession"); 
        e.preventDefault();
        try {
            const response = await fetch(`${CURRENTBACKEND}/api/confirmCode`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({code, myId})
        });

        if (response.status === 200) {
            const data = await response.json();
            navigate('/forgot-password/new'); // Redirect to dashboard or another page
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
                <input onChange={handleChange} className='forgotPasswordInput' type="text" placeholder="Code" pattern="^[0-9]{8}$" title="Enter a valid 8 digit code"  maxLength={8} required/><br />
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