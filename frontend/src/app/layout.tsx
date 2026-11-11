import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grammarly — AI Grammar Correction",
  description: "Correct grammar in long texts with an AI writing assistant.",
};

const links = [["Home", "/"], ["About", "/about"], ["AI Agent", "/agent"], ["History", "/history"]] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <header className="border-b border-slate-100 bg-white/90">
      <nav className="container flex min-h-[76px] items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-violet-700">G</span>Grammar<span className="text-violet-600">AI</span></Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">{links.map(([label, href]) => <Link key={href} className="transition hover:text-violet-700" href={href}>{label}</Link>)}</div>
        <div className="flex items-center gap-3 text-sm font-bold"><Link className="hidden sm:block" href="/login">Log in</Link><Link className="primary" href="/register">Get started</Link></div>
      </nav>
    </header>
    <main>{children}</main>
    <footer className="mt-20 border-t border-slate-100 bg-white"><div className="container flex flex-col justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} GrammarAI</span><span>Focused on clearer, grammatically correct writing.</span></div></footer>
  </body></html>;
}
