export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access");
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
}
