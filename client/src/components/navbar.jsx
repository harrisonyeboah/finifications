import { useState } from "react";
import "../Styles/Navbar.css";
function Navbar() {
    const [message, setMessage] = useState("");
    return (
        <div className="navbarDiv">
            <h1 clasName="logoName"> finifications </h1>
            <a className="settingsAnchor" href="/"> Settings </a>
        </div>
    );
}
export default Navbar;