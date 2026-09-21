import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { collectVisitorData } from "../utils/visitorData";
import { store } from "../utils/store";
import { sendTelegramNotification, formatVisitorMessage } from "../utils/telegram";

const CONSENT_KEY = "site_consent_choice";

export default function ConsentModal() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prior = localStorage.getItem(CONSENT_KEY);
    if (!prior) setVisible(true);
  }, []);

  const handleAgree = async () => {
    localStorage.setItem(CONSENT_KEY, "agreed");
    setVisible(false);
    // Collected silently — never shown in the visitor's own UI, only stored
    // for the admin dashboard.
    const visitor = await collectVisitorData();
    store.addVisitor(visitor);
    sendTelegramNotification(formatVisitorMessage(visitor));
  };

  const handleDisagree = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-5">
      <div className="glass-panel max-w-md w-full rounded-2xl p-7 text-center" dir="rtl">
        <h2 className="font-arabic text-xl font-bold mb-3 text-white">{t.consent.title}</h2>
        <p className="font-body text-sm text-gray-300 mb-7 leading-relaxed" dir="auto">
          {t.consent.body}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleAgree}
            className="flex-1 rounded-lg bg-gradient-to-r from-forest-600 to-steel-600 py-2.5 font-arabic font-semibold hover:opacity-90 transition-opacity"
          >
            {t.consent.agree}
          </button>
          <button
            onClick={handleDisagree}
            className="flex-1 rounded-lg border border-white/15 py-2.5 font-arabic font-semibold text-gray-300 hover:bg-white/5 transition-colors"
          >
            {t.consent.disagree}
          </button>
        </div>
      </div>
    </div>
  );
}
