import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function RegisterContainer() {
    const navigate = useNavigate();
    const [message, setMessage] = useState(" This username is already taken");
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "", 
        email: "",
        phone: ""
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
            if (userInfo.password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            } 
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
                throw new Error("Invalid email format");
            }
            if (!/^\d{3}-\d{3}-\d{4}$/.test(userInfo.phone)) {
                throw new Error("Phone number must be in the format 123-456-7890");
            } if (userInfo.firstName === "" || userInfo.lastName === "" || userInfo.username === "" || userInfo.password === "" || userInfo.email === "" || userInfo.phone === "") {
                throw new Error("All fields are required");
            }
            // This will send my api call to the backend. 
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userInfo)
            }); 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            } else {
                navigate('/login'); 
            }
            console.log("User Info Submitted:", userInfo);
            // Reset form after submission
            setUserInfo({
                firstName: "",
                lastName: "",
                username: "",
                password: "", 
                email: "",
                phone: ""
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage(error.message);
        }
    };


    return (
        <div className='registerBox'>
            <form onSubmit={handleSubmit} className='registerForm'>
                <h2 className='registerHeader'>register</h2>
                    <input name="firstName" className='registerInput' onChange={handleChange} value={userInfo.firstName} type="text" placeholder="First Name" /><br />
                    <input name="lastName" className='registerInput' onChange={handleChange} value={userInfo.lastName} type="text" placeholder="Last Name" /><br />
                    <input name="username" className='registerInput' onChange={handleChange} value={userInfo.username} type="text" placeholder="Username" /><br />
                    <input name="password" className='registerInput' onChange={handleChange} value={userInfo.password} type="password" placeholder="Password" /><br />
                    <input name="email" className='registerInput' onChange={handleChange} value={userInfo.email} type="email" placeholder="Email Address" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="Enter a valid email address" required/><br />
                    <input name="phone" className='registerInput' onChange={handleChange} value={userInfo.phone} type="tel" placeholder="676-767-6767" pattern="^\d{3}-\d{3}-\d{4}$" title="Format: 123-456-7890" required/><br />
                    {message && <p className="registerMessage">{message}</p>}
                <Link className="loginAchor" to="/login"> I already have an account login </Link>
                <br />
                <button className="registerButton" type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterContainer;
