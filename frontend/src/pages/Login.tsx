import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError("メールアドレスとパスワードを入力してください。");
            return;
        }

        try {
            setError(null);
            setLoading(true);

            const data = await login(email, password);

            if (data && data.token) {
                localStorage.setItem("token", data.token);
                navigate("/");
            } else {
                setError("メールアドレスまたはパスワードが違います。");
            }
        } catch (err: any) {
            setError(err.message || "ログイン処理中にエラーが発生しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h1>Login</h1>

            {/*  Home画面とデザインを合わせたエラー表示エリア */}
            {error && (
                <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", margin: "10px 0", border: "1px solid #ffcccc" }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    style={{ padding: "8px" }}
                />

                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={{ padding: "8px" }}
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    {loading ? "ログイン中..." : "Login"}
                </button>
            </div>

            <p style={{ marginTop: "15px", fontSize: "14px" }}>
                アカウントをお持ちでないですか？ <Link to="/signup">サインアップはこちら</Link>
            </p>
        </div>
    );
}