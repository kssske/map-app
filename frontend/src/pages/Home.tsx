import { useEffect, useState } from "react";  // useState is for storing data related to the showing 
import { Link } from "react-router-dom";
import { fetchMap } from "../api";
import MapView from "../MapView";
import type { Post } from "../types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);    // generate a datastorage for type Post 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");


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
            <>
              <Link to="/create">
                <button>新規投稿</button>
              </Link>

              <button onClick={logout}>Logout</button>
            </>
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


      <MapView posts={posts} />
    </div>
  );
}