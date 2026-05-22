import { useState } from "react";
import { login } from "./api";
import { useNavigate, Link } from "react-router-dom";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError("メールアドレスとパスワードを入力してください。");
            return;
        }
        try {
            setError("");
            setLoading(true);
            const data = await login(email, password);
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                navigate("/");
            } else {
                setError("ログインに失敗しました（トークンがありません）");
            }
        } catch (err: any) {
            setError(err.error || "ログインに失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>ログイン</h2>

            {/* エラーメッセージの表示 */}
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
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
            </div>

            <p style={{ marginTop: "15px", fontSize: "14px" }}>
                アカウントをお持ちでないですか？ <Link to="/signup">サインアップはこちら</Link>
            </p>
        </div>
    );
}