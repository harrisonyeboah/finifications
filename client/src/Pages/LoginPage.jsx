import Navbar from '../components/navbar.jsx';
import LoginContainer from '../components/loginContainer.jsx';
import "../Styles/Login.css";
export default function LoginPage() {
    return (
        <div>
            <Navbar></Navbar>
            <div className='loginContainer'>
                <LoginContainer></LoginContainer>
            </div>
        </div>
    );
}
