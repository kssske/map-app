import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { locate } from "../api";
import MapView from "../MapView";

export default function CreatePost() {
    const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleCreate = async () => {
        if (!token) {
            setError("ログインしてください。");
            navigate("/login");
            return;
        }

        if (!selected) {
            setError("地図をクリックして場所を選択してください。");
            return;
        }

        if (!title.trim()) {
            setError("タイトルを入力してください。");
            return;
        }

        try {
            await locate({
                title,
                description,
                price,
                lat: selected.lat,
                lng: selected.lng,
            });

            // 投稿成功したらHomeへ戻る
            navigate("/");
        } catch (err) {
            setError("投稿に失敗しました。");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>新規投稿</h1>

            {error && (
                <div
                    style={{
                        color: "red",
                        background: "#ffe6e6",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "5px",
                    }}
                >
                    {error}
                </div>
            )}

            {selected && (
                <p>
                    選択中：{selected.lat}, {selected.lng}
                </p>
            )}

            <MapView
                posts={[]}
                onMapClick={setSelected}
            />

            <div style={{ marginTop: "20px" }}>
                <input
                    placeholder="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <br />
                <br />

                <input
                    placeholder="説明"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br />
                <br />

                <input
                    type="number"
                    placeholder="価格"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />

                <br />
                <br />

                <button onClick={handleCreate}>
                    投稿する
                </button>

                <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate("/")}
                >
                    キャンセル
                </button>
            </div>
        </div>
    );
}