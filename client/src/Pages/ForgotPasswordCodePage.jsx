import Navbar from '../components/navbar.jsx';
import ForgotPasswordCodeContainer from '../components/forgotPasswordCodeContainer.jsx';
import "../Styles/ForgotPassword.css";
import {useEffect, useState} from 'react';

export default function ForgotPasswordCodePage() {
    useEffect(() => {
        document.title = "Forgot Password - Finifications";
    }, []);
    return (
        <div>
            <Navbar></Navbar>
            <div className='forgotPasswordContainer'>
                <ForgotPasswordCodeContainer></ForgotPasswordCodeContainer>
            </div>
        </div>
    );
}