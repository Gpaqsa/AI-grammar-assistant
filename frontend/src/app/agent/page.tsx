"use client";
import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function Agent() {
  const [text, setText] = useState("");
  const [corrected, setCorrected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function correct() {
    setError(""); setCorrected(""); setBusy(true); setCopied(false);
    try {
      const response = await apiFetch("/correct/", { method: "POST", body: JSON.stringify({ text }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not correct the text.");
      setCorrected(data.corrected_text);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  async function copyResult() {
    await navigator.clipboard.writeText(corrected);
    setCopied(true);
  }
  return <section className="container py-12 md:py-16"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-widest text-violet-700">AI grammar assistant</p><h1 className="mt-3 text-4xl font-black tracking-tight">Make your text clearer.</h1><p className="muted mt-3 max-w-2xl leading-7">Paste a long text below. The assistant will correct grammar, spelling, and punctuation while preserving your meaning.</p>
    <div className="mt-8 grid items-start gap-5 lg:grid-cols-2"><div className="panel p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Your original text</h2><span className="muted text-xs">{text.length.toLocaleString()} characters</span></div><textarea className="field mt-4 min-h-[340px] resize-y leading-7" value={text} onChange={e=>setText(e.target.value)} maxLength={50000} placeholder="Paste your essay, report, email, or other long text here..." /><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="muted text-xs">Maximum 50,000 characters</span><button className="primary" disabled={!text.trim() || busy} onClick={correct}>{busy ? "Correcting..." : "✦ Correct grammar"}</button></div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}{error.includes("not configured") && <span> Add your AI API key to the backend .env file.</span>}</p>}</div>
      <div className="panel min-h-[420px] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">Corrected text</h2>{corrected && <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold" onClick={copyResult}>{copied ? "Copied ✓" : "Copy text"}</button>}</div>{corrected ? <div className="mt-4 whitespace-pre-wrap break-words leading-7 text-slate-700">{corrected}</div> : <div className="mt-4 grid min-h-[330px] place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center"><div><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-xl text-violet-700">✦</div><p className="mt-4 font-bold">Your corrected text will appear here</p><p className="muted mt-2 max-w-xs text-sm leading-6">Your original meaning stays the priority. Submit text to get started.</p></div></div>}{corrected && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Review the result before using it. If you are logged in, this correction is saved to your history.</p>}</div></div>
    <p className="muted mt-5 text-sm">Want to revisit previous corrections? <Link className="font-bold text-violet-700" href="/history">Open your history →</Link></p>
  </div></section>
}
