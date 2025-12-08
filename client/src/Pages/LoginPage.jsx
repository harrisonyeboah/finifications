import Navbar from '../components/navbar.jsx';
import LoginContainer from '../components/loginContainer.jsx';
import "../Styles/Login.css";
import { useEffect } from 'react';
export default function LoginPage() {
    useEffect(() => {
            document.title = "Login - Finifications";
    }, []);
    return (
        <div>
            <Navbar></Navbar>
            <div className='loginContainer'>
                <LoginContainer></LoginContainer>
            </div>
        </div>
    );
}
