import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: "Grammarly — AI Grammar Correction",
  description: "Correct grammar in long texts with an AI writing assistant.",
};

const links = [["Home", "/"], ["About", "/about"], ["AI Agent", "/agent"], ["History", "/history"]] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <Navbar links={links} />
    <main>{children}</main>
    <footer className="mt-20 border-t border-slate-100 bg-white"><div className="container flex flex-col justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} GrammarAI</span><span>Focused on clearer, grammatically correct writing.</span></div></footer>
  </body></html>;
}
