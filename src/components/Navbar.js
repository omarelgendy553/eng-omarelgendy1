import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#skills", label: t.nav.skills },
    { href: "#order", label: t.nav.order },
    { href: "#complaint", label: t.nav.complaint },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-40 glass-panel border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-semibold text-lg text-gradient">
          {lang === "ar" ? "عمر الجندي" : "Omar Elgendy"}
        </a>

        <div className="hidden md:flex items-center gap-7 font-body text-sm text-gray-200">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-steel-400 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="rounded-full border border-steel-500/60 px-3 py-1.5 text-xs font-semibold text-steel-400 hover:bg-steel-500/20 transition-colors"
            aria-label="Toggle language"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
          <button
            className="md:hidden text-gray-200 p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass-panel px-5 pb-4 flex flex-col gap-3 font-body text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-1.5 text-gray-200">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
