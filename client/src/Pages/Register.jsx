import Navbar from '../components/navbar.jsx';
import RegisterContainer from '../components/registerContainer.jsx';
import "../Styles/Register.css";
import { useEffect } from 'react';
export default function RegisterPage() {
    useEffect(() => {
            document.title = "Register - Finifications";
    }, []);
    // This is it 
    return (
        <div>
            <Navbar></Navbar>
            <div className='registerContainer'>
                <RegisterContainer></RegisterContainer>
            </div>
        </div>
    );
}