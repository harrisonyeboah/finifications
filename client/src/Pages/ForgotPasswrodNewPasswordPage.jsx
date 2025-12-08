import Navbar from '../components/navbar.jsx';
import ForgotPasswordNewPasswordContainer from '../components/forgotPasswordNewPasswordContainer.jsx';
import "../Styles/ForgotPassword.css";
import {useEffect, useState} from 'react';

export default function ForgotPasswordNewPasswordPage() {
    useEffect(() => {
        document.title = "Forgot Password - Finifications";
    }, []);
    return (
        <div>
            <Navbar></Navbar>
            <div className='forgotPasswordContainer'>
                <ForgotPasswordNewPasswordContainer></ForgotPasswordNewPasswordContainer>
            </div>
        </div>
    );
}