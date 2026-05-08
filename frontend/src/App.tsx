import { useEffect, useState } from "react";   //useState is for storing data related to the showing 
import { fetchPosts, createPost } from "./api";
import MapView from "./MapView";
import type { Post } from "./types";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);  //generate a datastorage for type Post 
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  useEffect(() => {  //execute only once, the moment the screen is displayed.　　so it Prevents infinite loops
    fetchPosts().then(setPosts);  //fetchPosts then put it in setPosts
  }, []);
  const handleCreate = async () => {
    if (!selected) return;

    await createPost({
      title,
      description,
      price,
      lat: selected.lat,
      lng: selected.lng,
    });

    const newPosts = await fetchPosts();
    setPosts(newPosts);

    setSelected(null);
    setTitle("");
    setDescription("");
    setPrice(0);
  };
  return (
    <div>
      <h1>地図マーケット</h1>

      {/* 一覧 */}
      <ul>
        {posts.map(p => ( //convert each one into a <li> tag.
          <li key={p.id}>
            {p.title} - {p.price}円
          </li>
        ))}
      </ul>
      {/* 投稿フォーム */}
      {selected && (
        <div>
          <p>選択中: {selected.lat}, {selected.lng}</p>

          <input
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}  // save e to setTitle in real time
          />

          <input
            placeholder="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="価格"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <button onClick={handleCreate}>
            投稿
          </button>
        </div>
      )}
      {/* 地図 */}
      <MapView posts={posts} onMapClick={setSelected} />
    </div>
  );
}