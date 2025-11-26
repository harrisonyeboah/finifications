// Installing my dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function LoginContainer() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: "", 

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit =  async (e) => {
        e.preventDefault();
        // Add form submission logic here
        try {
            // This will send my api call to the backend. 
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo)
            }); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            } 
            else {
                setMessage("Login successful!");
                navigate('/dashboard'); // Redirect to dashboard or another page
            }
            console.log("User Info Submitted:", userInfo);
            // Reset form after submission
            setUserInfo({
                username: "",
                password: "", 
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage(error.message);
        }
    };


    return (
        <div className='loginBox'>
            <form onSubmit={handleSubmit}>
                <h2 className='loginHeader'>login</h2>
                <input className='loginInput' name="username" onChange={handleChange} type="text" placeholder="username" /><br />
                <input className='loginInput' name="password" onChange={handleChange} type="password" placeholder="password" /><br />
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
