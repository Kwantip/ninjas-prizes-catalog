import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { adminModeSetter } from '../App';

function AdminAcessPage() {
    const { isAdmin, enableAdmin } = adminModeSetter();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("Please enter a password to continue or click the button below to return to Ninjas' View");

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const correctPwd = await enableAdmin(password);
        if (correctPwd) {
            navigate("/")
        } else {
            setMessage("Incorrect password!\nPlease enter the correct password or click the button below to go back to Ninjas' View.");
            setPassword("");
        }
    }
    const handleGoBack = () => {
        navigate("/");
        window.scrollTo(0, 0);
    }

    return (
        !isAdmin && (
            <main className="admin-access-page">
                <h1>You are now accessing the Admin View</h1>
                <p style={{ whiteSpace: "pre-line" }}>{message}</p>
                <form onSubmit={handleLogin}>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                    <input type="submit" value="Login" />
                </form>
                <button onClick={handleGoBack}>Go Back</button>
            </main>
        )
    )
}

export default AdminAcessPage;