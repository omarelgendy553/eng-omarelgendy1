/**
 * Calls an AI provider to answer a visitor's question.
 *
 * SECURITY NOTE: same caveat as telegram.js — a static GitHub Pages site
 * cannot hide an API key from the browser's network tab. For a real
 * deployment, put this fetch call behind a serverless proxy (Cloudflare
 * Worker, Vercel Edge Function, Firebase Function) that injects the key
 * server-side, and point PROVIDER at that proxy URL instead.
 *
 * Switch providers by setting REACT_APP_AI_PROVIDER to "openai" or "gemini".
 */

const PROVIDER = process.env.REACT_APP_AI_PROVIDER || "openai";
const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const SYSTEM_PROMPT =
  "You are the friendly customer-facing assistant on Omar Elgendy's portfolio " +
  "and business site. Omar is a student at the Faculty of Artificial " +
  "Intelligence, Menofia University, available for freelance/dev work. " +
  "Answer briefly, help visitors understand his skills, and guide them to " +
  "the Order form or WhatsApp (+201032853311) for anything transactional.";

async function callOpenAI(history) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      max_tokens: 300,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "OpenAI request failed");
  return data.choices[0].message.content.trim();
}

async function callGemini(history) {
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Gemini request failed");
  return data.candidates[0].content.parts[0].text.trim();
}

/**
 * @param {{role: 'user'|'assistant', content: string}[]} history
 * @returns {Promise<string>} assistant reply
 */
export async function getAIResponse(history) {
  const hasKey = PROVIDER === "gemini" ? GEMINI_KEY : OPENAI_KEY;

  if (!hasKey) {
    // Graceful offline fallback so the widget still feels alive in a demo
    // with no API key configured yet.
    const lastMsg = history[history.length - 1]?.content?.toLowerCase() || "";
    if (lastMsg.includes("price") || lastMsg.includes("cost") || lastMsg.includes("سعر"))
      return "Pricing depends on scope — the fastest way to get a quote is to fill in the Order form or message Omar directly on WhatsApp.";
    if (lastMsg.includes("order") || lastMsg.includes("طلب"))
      return "You can submit an order using the Order form above — it goes straight to Omar's WhatsApp.";
    return "Thanks for reaching out! (Demo mode — connect an OpenAI or Gemini API key in .env to enable live AI replies.) In the meantime, feel free to use the Order form or WhatsApp button.";
  }

  return PROVIDER === "gemini" ? callGemini(history) : callOpenAI(history);
}
