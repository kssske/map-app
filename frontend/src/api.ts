const baseUrl = import.meta.env.VITE_API_URL;

export async function fetchPosts() {
    const res = await fetch(baseUrl + "/api/posts");
    return res.json();
}
export async function createPost(data: {
    title: string;
    description: string;
    price: number;
    lat: number;
    lng: number;
}) {
    await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}