import Navbar from '../components/navbar.jsx';
import ForgotPasswordNewPasswordContainer from '../components/forgotPasswordNewPasswordContainer.jsx';
import "../Styles/ForgotPassword.css";
export default function ForgotPasswordNewPasswordPage() {
    return (
        <div>
            <Navbar></Navbar>
            <div className='forgotPasswordContainer'>
                <ForgotPasswordNewPasswordContainer></ForgotPasswordNewPasswordContainer>
            </div>
        </div>
    );
}