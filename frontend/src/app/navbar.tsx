"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Profile = { username: string; email: string };

export default function Navbar({ links }: { links: readonly (readonly [string, string])[] }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!window.localStorage.getItem("access")) {
      setProfile(null);
      setReady(true);
      return;
    }
    try {
      const response = await apiFetch("/auth/profile/");
      if (!response.ok) {
        if (response.status === 401) {
          window.localStorage.removeItem("access");
          window.localStorage.removeItem("refresh");
          setProfile(null);
          setReady(true);
          return;
        }
        throw new Error("Could not load your profile.");
      }
      setProfile(await response.json());
    } catch (error) {
      console.error("Could not load your profile.", error);
      setProfile(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDarkMode(isDark);

    void loadProfile();
    window.addEventListener("auth-change", loadProfile);
    return () => window.removeEventListener("auth-change", loadProfile);
  }, [loadProfile]);

  function toggleTheme() {
    const nextDarkMode = !darkMode;
    setDarkMode(nextDarkMode);
    document.documentElement.classList.toggle("dark", nextDarkMode);
    window.localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
  }

  function logout() {
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    setProfile(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  }

  return (
    <header className="border-b border-slate-100 bg-white/90">
      <nav className="container flex min-h-[76px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700">G</span>
          Grammar<span className="text-violet-600">AI</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          {links.map(([label, href]) => <Link key={href} className="transition hover:text-violet-700" href={href}>{label}</Link>)}
        </div>
        <div className="flex items-center gap-3 text-sm font-bold">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-lg"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? "☀" : "☾"}
          </button>
          {ready && (profile ? (
            <div className="relative flex items-center gap-1">
              <Link
                href="/profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 font-black text-violet-700"
                aria-label="My profile"
                title="My profile"
              >
                {profile.username.slice(0, 1).toUpperCase()}
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(open => !open)}
                className="grid h-8 w-6 place-items-center rounded-md text-slate-600"
                aria-label="Open account menu"
                aria-expanded={menuOpen}
              >⌄</button>
              {menuOpen && <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <p className="truncate px-3 py-2 text-sm font-bold">{profile.username}</p>
                <button onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-violet-50">Log out</button>
              </div>}
            </div>
          ) : <>
            <Link className="hidden sm:block" href="/login">Log in</Link>
            <Link className="primary" href="/register">Get started</Link>
          </>)}
        </div>
      </nav>
    </header>
  );
}
