import Navbar from '../components/navbar.jsx';
import ForgotPasswordCodeContainer from '../components/forgotPasswordCodeContainer.jsx';
import "../Styles/ForgotPassword.css";
export default function ForgotPasswordCodePage() {
    return (
        <div>
            <Navbar></Navbar>
            <div className='forgotPasswordContainer'>
                <ForgotPasswordCodeContainer></ForgotPasswordCodeContainer>
            </div>
        </div>
    );
}