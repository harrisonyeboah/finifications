import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

function ForgotPasswordNewPasswordContainer() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const { commited, setCommited } = useContext(AppContext);

    const navigate = useNavigate();

    const PRODBACKEND = "https://finifications.onrender.com";
    const LOCALBACKEND = "http://localhost:8080";
    const CURRENTBACKEND = PRODBACKEND;

    useEffect(() => {
        if (!commited) {
            setMessage("you must enter your code.")
            navigate('/forgot-password');
        }
        const checkFirst = async () => {
            const response = await fetch(`${CURRENTBACKEND}/api/authenticate`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                navigate('/forgot-password');
            } 
        };
        checkFirst();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Check matching
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        // 2. Send request to backend
        const response = await fetch(`${CURRENTBACKEND}/api/changePassword`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newPassword: password,
            }),
        });

        const data = await response.json();

        // 3. Show backend message
        if (response.status === 200) {
            sessionStorage.removeItem(data.delly);
            setMessage("Password updated successfully");
            setCommited(false);
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setMessage(data.error || "Something went wrong");
        }
    };

    return (
        <div className='forgotPasswordBox'>
            <form onSubmit={handleSubmit}>
                <h2 className='forgotPasswordHeader'>forgot password</h2>

                <input
                    className='forgotPasswordInput'
                    type="password"
                    placeholder="Password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />

                <input
                    className='forgotPasswordInput'
                    type="password"
                    placeholder="Confirm Password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                /><br />

                {message && <p className="forgotMessage">{message}</p>}

                <a className='forgotPasswordAchor' href="/login"> Go Back to Login </a>
                <br />

                <button className="forgotButton" type="submit">Submit New Password</button>
            </form>
        </div>
    );
}

export default ForgotPasswordNewPasswordContainer;
