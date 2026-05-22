import { useState } from "react";
import { signup } from "../api";
import { useNavigate, Link } from "react-router-dom";
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSignup = async () => {
        if (!email.trim() || !password.trim()) {
            setError("メールアドレスとパスワードを入力してください。");
            return;
        }

        try {
            setError(null);
            setLoading(true); // avoid press repeatedly

            const data = await signup(email, password);


            if (data && data.token) {
                localStorage.setItem("token", (data as any).token);
                navigate("/");
            } else {

                navigate("/login");
            }
        } catch (err) {
            setError("サインアップに失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h1>Signup</h1>

            {/* エラー表示 */}
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
                    onClick={handleSignup}
                    disabled={loading}
                    style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                    {loading ? "登録中..." : "Signup"}
                </button>
            </div>

            <p style={{ marginTop: "15px", fontSize: "14px" }}>
                すでにアカウントをお持ちですか？ <Link to="/login">ログインはこちら</Link>
            </p>
        </div>
    );
}