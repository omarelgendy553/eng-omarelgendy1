import React from "react";
import { useLanguage } from "../context/LanguageContext";

export function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="max-w-4xl mx-auto px-6 py-24">
      <span className="block h-px w-16 bg-steel-500 mb-6" />
      <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">{t.about.title}</h2>
      <p className="font-body text-lg leading-relaxed text-gray-300 max-w-2xl">{t.about.body}</p>
    </section>
  );
}

export function SkillsSection() {
  const { t } = useLanguage();
  return (
    <section id="skills" className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="font-display text-3xl md:text-4xl font-semibold mb-10">{t.skills.title}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {t.skills.items.map((item, i) => (
          <div
            key={i}
            className="glass-panel rounded-2xl p-6 hover:border-steel-400/60 transition-colors"
          >
            <div className="mb-4 h-10 w-10 rounded-lg bg-gradient-to-br from-forest-600 to-steel-600 flex items-center justify-center font-display font-bold">
              {i + 1}
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
            <p className="font-body text-sm text-gray-400 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">{t.contact.title}</h2>
      <p className="font-body text-gray-400 mb-8 max-w-xl mx-auto">{t.contact.body}</p>
      <a
        href="https://wa.me/201032853311"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-600 to-steel-600 px-8 py-3 font-body font-semibold hover:opacity-90 transition-opacity"
      >
        {t.contact.whatsapp}
      </a>
      <p className="mt-10 text-xs text-gray-600 font-body">
        © {new Date().getFullYear()} Omar Elgendy — {t.footer}
      </p>
    </section>
  );
}
