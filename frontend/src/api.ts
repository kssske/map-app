import type { Post, AuthResponse } from "./types";
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
        ...options,      // before
        headers          //then
    });

    const data = await res.json();
    console.log("API error data:", data);
    console.log(data.errors);
    if (!res.ok) {
        const message = Array.isArray(data.errors)
            ? data.errors.map((e: any) => e.msg).join(", ")
            : data.error || "API error";
        throw new Error(message);
    }

    return data as T;
}
export const fetchMap = () => apiFetch<Post[]>("/api/posts");   //　[]　means multiple  without [] means single
export const locate = (data: any) =>
    apiFetch<Post>("/api/posts", {
        method: "POST",
        body: JSON.stringify(data),
    });
export const login = (email: string, password: string) =>
    apiFetch<AuthResponse>("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });


export const signup = (email: string, password: string) =>
    apiFetch<AuthResponse>("/api/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });