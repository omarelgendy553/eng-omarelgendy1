import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getAIResponse } from "../utils/aiAssistant";

export default function AIChat() {
  const { t, dir } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: t.chat.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await getAIResponse(nextMessages);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the assistant just now — please try WhatsApp instead." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end" dir={dir}>
      {open && (
        <div className="mb-3 w-80 max-w-[85vw] h-96 glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="font-display font-semibold text-sm">{t.chat.title}</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-lg leading-none">
              ×
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm font-body ${
                  m.role === "user"
                    ? "ml-auto bg-steel-600 text-white"
                    : "mr-auto bg-forest-800 text-gray-100"
                }`}
                style={m.role === "user" ? { marginInlineStart: "auto" } : { marginInlineEnd: "auto" }}
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 font-body">…</div>}
          </div>
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.placeholder}
              className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-steel-500 font-body"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-steel-600 px-3 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {t.chat.send}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-forest-600 to-steel-600 shadow-lg shadow-black/40 hover:scale-110 transition-transform"
        aria-label="Open AI assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
          <path d="M12 3a9 9 0 0 0-9 9c0 1.6.42 3.1 1.16 4.4L3 21l4.8-1.1A9 9 0 1 0 12 3Z" />
          <circle cx="8.5" cy="12" r="0.9" fill="white" />
          <circle cx="12" cy="12" r="0.9" fill="white" />
          <circle cx="15.5" cy="12" r="0.9" fill="white" />
        </svg>
      </button>
    </div>
  );
}
