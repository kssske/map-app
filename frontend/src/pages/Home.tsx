import { useEffect, useState } from "react";  //useState is for storing data related to the showing 
import { Link, useNavigate } from "react-router-dom";
import { fetchMap, locate } from "../api";
import MapView from "../MapView";
import type { Post } from "../types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);    //generate a datastorage for type Post 
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {    //execute only once, the moment the screen is displayed.　　so it Prevents infinite loops
    fetchMap().then(setPosts);  //fetchMap then put it in setPosts
  }, []);

  const handleCreate = async () => {
    if (!token) {
      alert("ログインしてください");
      navigate("/login");
      return;
    }
    if (!selected) return;

    await locate({
      title,
      description,
      price,
      lat: selected.lat,
      lng: selected.lng,
    });

    const newPosts = await fetchMap();
    setPosts(newPosts);
    setSelected(null);
    setTitle("");
    setDescription("");
    setPrice(0);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

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

      {/* 一覧 */}
      <section style={{ margin: "20px 0" }}>
        <h3>投稿一覧</h3>
        <ul>
          {posts.map(p => (   //convert each one into a <li> tag.
            <li key={p.id}>{p.title} - {p.price}円</li>
          ))}
        </ul>
      </section>

      {/* 投稿フォーム */}
      {selected && (  //show () unless null
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