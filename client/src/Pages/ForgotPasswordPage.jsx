import Navbar from '../components/navbar.jsx';
import ForgotPasswordContainer from '../components/forgotPasswordContainer.jsx';
import "../Styles/ForgotPassword.css";
import {useEffect, useState} from 'react';

export default function ForgotPasswordPage() {
    useEffect(() => {
    document.title = "Forgot Password - Finifications";
    }, []);
    // This is it 
    return (
        <div>
            <Navbar></Navbar>
            <div className='forgotPasswordContainer'>
                <ForgotPasswordContainer></ForgotPasswordContainer>
            </div>
        </div>
    );
}