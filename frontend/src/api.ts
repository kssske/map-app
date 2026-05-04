const BASE_URL = "http://localhost:3452";

export async function fetchPosts() {
    const res = await fetch(BASE_URL + "/api/posts");
    return res.json();
}