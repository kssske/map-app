import { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSignup = async () => {
        try {
            const data = await signup(email, password);

            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Signup</h1>

            <input
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSignup}>
                Signup
            </button>
        </div>
    );
}