import { useEffect, useState } from "react";  // useState is for storing data related to the showing 
import { Link, useNavigate } from "react-router-dom";
import { fetchMap, locate } from "../api";
import MapView from "../MapView";
import type { Post } from "../types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);    // generate a datastorage for type Post 
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setError(null); // 前のエラーをクリア
      const data = await fetchMap();
      setPosts(data);
    } catch (err) {
      setError("データの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {   // execute only once, the moment the screen is displayed.so it Prevents infinite loops
    loadData();       // fetchMap then put it in setPosts
  }, []);

  const handleCreate = async () => {
    if (!token) {
      setError("ログインをしてください");
      navigate("/login");
      return;
    }
    if (!selected) return;

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

      await loadData();

      // reset form
      setSelected(null);
      setTitle("");
      setDescription("");
      setPrice(0);
    } catch (err) {
      setError("投稿に失敗しました。");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>地図データを読み込み中...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>地図マーケット</h1>
        <div style={{ zIndex: 10 }}>
          {!token ? (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/signup"><button>Signup</button></Link>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </header>

      {error && (
        <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", margin: "10px 0" }}>
          ⚠️ {error}
        </div>
      )}

      {/* 一覧 */}
      <section style={{ margin: "20px 0" }}>
        <h3>投稿一覧</h3>
        <ul>
          {posts.map(p => (   // convert each one into a <li> tag.
            <li key={p.id}>{p.title} - {p.price}円</li>
          ))}
        </ul>
      </section>

      {/* 投稿フォーム */}
      {selected && (  // show () unless null
        <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <p>選択中: {selected.lat}, {selected.lng}</p>
          <input placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="説明" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <button onClick={handleCreate}>投稿</button>
        </div>
      )}

      {/* 地図 */}
      <MapView posts={posts} onMapClick={setSelected} />
    </div>
  );
}