"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const endpoint = mode === "login" ? "/auth/login/" : "/auth/register/";
      const payload = mode === "login" ? { username, password } : { username, email, password };
      const res = await fetch(`${API_URL}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data === "object" ? Object.values(data).flat().join(" ") : "Authentication failed.");
      if (mode === "login") {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        router.push("/agent");
      } else {
        router.push("/login?registered=1");
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <section className="container grid min-h-[70vh] place-items-center py-12"><div className="panel w-full max-w-md p-7 sm:p-9"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-xl font-black text-violet-700">G</div><h1 className="mt-5 text-center text-3xl font-black">{mode === "login" ? "Welcome back" : "Create your account"}</h1><p className="muted mt-2 text-center">{mode === "login" ? "Log in to access your saved corrections." : "Save and revisit your corrected texts."}</p>
    <form onSubmit={submit} className="mt-7 space-y-4"><div><label className="mb-2 block text-sm font-bold" htmlFor="username">Username</label><input className="field" id="username" autoComplete="username" required value={username} onChange={e=>setUsername(e.target.value)} /></div>{mode === "register" && <div><label className="mb-2 block text-sm font-bold" htmlFor="email">Email</label><input className="field" id="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div>}<div><label className="mb-2 block text-sm font-bold" htmlFor="password">Password</label><input className="field" id="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required value={password} onChange={e=>setPassword(e.target.value)} /></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button className="primary w-full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button></form><p className="muted mt-6 text-center text-sm">{mode === "login" ? "New here? " : "Already have an account? "}<Link className="font-bold text-violet-700" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Create an account" : "Log in"}</Link></p>
  </div></section>
}
