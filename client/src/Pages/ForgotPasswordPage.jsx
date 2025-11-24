import Navbar from '../components/navbar.jsx';
import ForgotPasswordContainer from '../components/forgotPasswordContainer.jsx';
import "../Styles/ForgotPassword.css";
export default function ForgotPasswordPage() {
    return (
        <div>
            <Navbar></Navbar>
            <div className='forgotPasswordContainer'>
                <ForgotPasswordContainer></ForgotPasswordContainer>
            </div>
        </div>
    );
}