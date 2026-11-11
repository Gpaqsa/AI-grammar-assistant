import Link from "next/link";

export default function Home() {
  return <><section className="overflow-hidden"><div className="container grid items-center gap-12 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
    <div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700"><span>✦</span> Your AI grammar assistant</div>
      <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">Your ideas, <span className="gradient-text">perfectly</span> expressed.</h1>
      <p className="muted mt-6 max-w-xl text-lg leading-8">Correct grammar in long texts without losing your original meaning or voice. Paste your writing, get a clear correction, and carry on with confidence.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link className="primary" href="/agent">Correct my text <span className="ml-2">→</span></Link><Link className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold" href="/about">How it works</Link></div>
      <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500"><span>✓ Grammar & spelling</span><span>✓ Long-text support</span><span>✓ Meaning preserved</span></div>
    </div>
    <div className="relative"><div className="absolute -inset-6 rounded-full bg-gradient-to-br from-violet-100 via-blue-50 to-fuchsia-100 blur-2xl" /><div className="panel relative p-5 sm:p-7"><div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="font-bold">Text correction</p><p className="muted mt-1 text-xs">A simple example</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Corrected</span></div>
      <p className="muted mt-5 text-xs font-bold uppercase tracking-wider">Original text</p><div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">She go to the library yesterday because she need to finish her assignment.</div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-violet-700">Corrected text</p><div className="mt-2 rounded-xl border border-violet-100 bg-violet-50/70 p-4 text-sm leading-6 text-slate-800">She <b className="text-violet-700">went</b> to the library yesterday because she <b className="text-violet-700">needed</b> to finish her assignment.</div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><span className="text-emerald-600">✓</span> Grammar corrected while preserving meaning</div>
    </div></div>
  </div></section>
  <section className="border-y border-slate-100 bg-white py-16"><div className="container"><div className="mx-auto max-w-xl text-center"><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Simple by design</p><h2 className="mt-3 text-3xl font-black tracking-tight">Everything you need to write clearly</h2><p className="muted mt-3">One focused tool for making your writing grammatically correct.</p></div>
    <div className="mt-10 grid gap-5 md:grid-cols-3">{[["01","Correct long texts","Paste essays, reports, emails, and other long-form writing."],["02","Keep your meaning","Fix grammar, spelling, and punctuation without rewriting your ideas."],["03","Find it later","Sign in to save corrections and revisit your previous texts."]].map(([n,title,desc])=><div key={n} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6"><span className="text-sm font-black text-violet-600">{n}</span><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="muted mt-2 leading-6">{desc}</p></div>)}</div>
  </div></section></>;
}
