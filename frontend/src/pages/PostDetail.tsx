import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPost } from "../api";
import MapView from "../MapView";
import type { Post } from "../types";

export default function PostDetail() {
    const { id } = useParams();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPost(Number(id));
                setPost(data);
            } catch (err) {
                setError("投稿が見つかりません。");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) {
        return <p>読み込み中...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>投稿がありません。</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Link to="/">← 戻る</Link>

            <h1>{post.title}</h1>

            <p>
                <strong>説明</strong>
            </p>
            <p>{post.description}</p>

            <p>
                <strong>価格</strong>
            </p>
            <p>{post.price}円</p>

            <h3>投稿場所</h3>

            <MapView posts={[post]} />

        </div>
    );
}