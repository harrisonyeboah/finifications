import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/Register.jsx';
import ForgotPasswordPage from './Pages/ForgotPasswordPage.jsx';
import ForgotPasswordCodePage from './Pages/ForgotPasswordCodePage.jsx';
import ForgotPasswordNewPasswordPage from './Pages/ForgotPasswrodNewPasswordPage.jsx';
import Dashboard from './Pages/Dashboard.jsx';
function App() {
    const [message, setMessage] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        // Example: Fetch data from the server
        fetch('http://localhost:3001/api/hello')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="App">
            <LoginPage></LoginPage>
            <RegisterPage></RegisterPage>
            <ForgotPasswordPage></ForgotPasswordPage>
            <ForgotPasswordCodePage></ForgotPasswordCodePage>
            <ForgotPasswordNewPasswordPage></ForgotPasswordNewPasswordPage>
            <Dashboard></Dashboard>
        </div>
    );
}

export default App;

