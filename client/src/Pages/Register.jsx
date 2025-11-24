import Navbar from '../components/navbar.jsx';
import RegisterContainer from '../components/registerContainer.jsx';
import "../Styles/Register.css";
export default function RegisterPage() {
    return (
        <div>
            <Navbar></Navbar>
            <div className='registerContainer'>
                <RegisterContainer></RegisterContainer>
            </div>
        </div>
    );
}