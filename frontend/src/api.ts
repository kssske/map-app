import type { Post } from "./types";
const baseUrl = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>)  //use this when to add something.
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(baseUrl + url, {
        ...options,      // 1st
        headers          //then
    });

    const data = await res.json();

    if (!res.ok) {
        const message = data.errors || data.error || "API error";
        throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }

    return data as T;
}
export const fetchMap = () => apiFetch<Post[]>("/api/posts");
export const locate = (data) =>
    apiFetch<Post>("/api/posts", {
        method: "POST",
        body: JSON.stringify(data),
    });
export const login = (email: string, password: string) =>
    apiFetch<{ token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });


export const signup = (email: string, password: string) =>
    apiFetch<{ message: string }>("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });