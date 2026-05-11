import { useState } from "react";
import { signup } from "../api";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        await signup(email, password);

        alert("登録成功");
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