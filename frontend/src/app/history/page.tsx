"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type RecordItem = { id: number; original_text: string; corrected_text: string; created_at: string };
export default function History() {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  async function load() {
    setLoading(true); setError("");
    try {
      const res = await apiFetch("/history/");
      if (res.status === 401) throw new Error("Please log in to see your saved corrections.");
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Could not load history.");
      setItems(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load history."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function remove(id: number) {
    if (!window.confirm("Delete this saved correction?")) return;
    const res = await apiFetch(`/history/${id}/`, { method: "DELETE" });
    if (res.ok) { setItems(prev => prev.filter(x => x.id !== id)); if (selected?.id === id) setSelected(null); }
    else setError("Could not delete this correction.");
  }
  return <section className="container py-12 md:py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Your workspace</p><h1 className="mt-3 text-4xl font-black tracking-tight">Correction history</h1><p className="muted mt-3">Your previously corrected texts, all in one place.</p></div><Link className="primary" href="/agent">+ Correct new text</Link></div>
    {error && <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><p>{error}</p>{error.includes("log in") && <Link className="mt-2 inline-block font-bold underline" href="/login">Go to login</Link>}</div>}
    {loading ? <p className="muted mt-10">Loading your history...</p> : items.length === 0 && !error ? <div className="panel mt-8 grid min-h-64 place-items-center p-8 text-center"><div><div className="text-3xl">▤</div><h2 className="mt-3 text-xl font-bold">No saved corrections yet</h2><p className="muted mt-2">Correct a text while logged in and it will appear here.</p><Link className="primary mt-5" href="/agent">Start correcting</Link></div></div> : <div className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-3">{items.map(item=><button key={item.id} onClick={()=>setSelected(item)} className={`w-full rounded-2xl border bg-white p-5 text-left transition hover:border-violet-300 ${selected?.id===item.id ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"}`}><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-violet-700">CORRECTION #{item.id}</span><span className="muted text-xs">{new Date(item.created_at).toLocaleString()}</span></div><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.original_text}</p><span className="mt-3 inline-block text-xs font-bold text-violet-700">View correction →</span></button>)}</div>
      <div className="panel h-fit p-6">{selected ? <><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold">Saved correction #{selected.id}</h2><button className="text-sm font-bold text-red-600" onClick={()=>remove(selected.id)}>Delete</button></div><h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-500">Original</h3><p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate-600">{selected.original_text}</p><h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-violet-700">Corrected</h3><p className="mt-2 whitespace-pre-wrap break-words leading-7">{selected.corrected_text}</p><button className="primary mt-5" onClick={()=>navigator.clipboard.writeText(selected.corrected_text)}>Copy corrected text</button></> : <div className="grid min-h-64 place-items-center text-center"><p className="muted">Select a saved correction to see the original and corrected text.</p></div>}</div></div>}
  </section>
}
