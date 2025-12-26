import { useState } from "react";
import "../Styles/Navbar.css";
function Navbar() {
    const [message, setMessage] = useState("");
    return (
        <div className="navbarDiv">
            <h1 clasName="logoName"> finifications </h1>
        </div>
    );
    // This is it 
}
export default Navbar;