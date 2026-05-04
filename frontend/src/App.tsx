import { useEffect, useState } from "react";
import { fetchPosts } from "./api";
import MapView from "./MapView";
import type { Post } from "./types";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);  //generate a data storage

  useEffect(() => {  //execute only once, the moment the screen is displayed.
    fetchPosts().then(setPosts);  //fetchPosts then put it in setPosts
  }, []);

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

      {/* 地図 */}
      <MapView posts={posts} />
    </div>
  );
}