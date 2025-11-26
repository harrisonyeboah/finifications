// Importing my dependencies
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import my styles 
import './App.css';

// Importing my pages 
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
        fetch('http://localhost:8080/api/hello')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="App">
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/forgot-password/code" element={<ForgotPasswordCodePage />} />
                <Route path="/forgot-password/new" element={<ForgotPasswordNewPasswordPage />} />

                <Route path="/dashboard" element={<Dashboard />} />

                {/* Default redirect to login */}
                <Route path="*" element={<LoginPage />} />
                
            </Routes>
        </Router>

        </div>
    );
}

export default App;

