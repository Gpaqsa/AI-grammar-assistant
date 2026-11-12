"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type ProfileData = {
  id: number;
  username: string;
  email: string;
  date_joined: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiFetch("/auth/profile/");
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Could not load your profile.");
        setProfile(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load your profile.");
      }
    }
    void loadProfile();
  }, [router]);

  return <section className="container py-12 md:py-16">
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-widest text-violet-700">Account</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">My profile</h1>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {!profile && !error ? <p className="muted mt-8">Loading your profile...</p> : profile && <div className="panel mt-8 p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-100 text-xl font-black text-violet-700">
            {profile.username.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="muted mt-1 text-sm">GrammarAI member</p>
          </div>
        </div>
        <dl className="mt-6 space-y-5">
          <div><dt className="muted text-sm">Username</dt><dd className="mt-1 font-semibold">{profile.username}</dd></div>
          <div><dt className="muted text-sm">Email</dt><dd className="mt-1 font-semibold">{profile.email || "Not provided"}</dd></div>
          <div><dt className="muted text-sm">Member since</dt><dd className="mt-1 font-semibold">{new Date(profile.date_joined).toLocaleDateString()}</dd></div>
        </dl>
        <Link className="primary mt-7" href="/history">View my correction history</Link>
      </div>}
    </div>
  </section>;
}
