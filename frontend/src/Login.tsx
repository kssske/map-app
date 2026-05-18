import { useState } from "react";
import { login } from "./api";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err: any) {
            setError(err.error || "ログインに失敗しました");
        }
    };

    return (
        <div>
            <h2>ログイン</h2>

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

            <button onClick={handleLogin}>
                ログイン
            </button>
            {error && <p className="message error">{error}</p>}
        </div>
    );
}