/**
 * Sends a text notification to a Telegram chat via a bot.
 *
 * SECURITY NOTE:
 * This project is a static site (GitHub Pages has no server), so calling the
 * Telegram Bot API directly from the browser means the bot token below is
 * visible to anyone who opens devtools. That is fine for a low-stakes demo,
 * but for production you should proxy this call through a small serverless
 * function (Cloudflare Worker / Vercel function / Firebase Cloud Function)
 * that holds the token server-side, and call that function from here instead.
 *
 * Setup:
 * 1. Message @BotFather on Telegram, run /newbot, copy the token.
 * 2. Send any message to your new bot, then visit
 *    https://api.telegram.org/bot<token>/getUpdates to find your chat id.
 * 3. Put both values in a .env file at the project root (see .env.example).
 */

const BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn(
      "[telegram] REACT_APP_TELEGRAM_BOT_TOKEN / REACT_APP_TELEGRAM_CHAT_ID not set — skipping notification.",
      message
    );
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
    const data = await res.json();
    if (!data.ok) console.error("[telegram] API responded with an error:", data);
    return data;
  } catch (err) {
    console.error("[telegram] Failed to send notification:", err);
    return { ok: false, error: String(err) };
  }
}

export function formatOrderMessage(order) {
  return (
    `🟢 <b>New order</b>\n` +
    `Name: ${order.name}\n` +
    `Phone: ${order.phone}\n` +
    `Service: ${order.service}\n` +
    `Details: ${order.details}\n` +
    `Time: ${new Date(order.createdAt).toLocaleString()}`
  );
}

export function formatComplaintMessage(complaint) {
  return (
    `🔴 <b>New complaint</b>\n` +
    `Name: ${complaint.name}\n` +
    `Contact: ${complaint.contact}\n` +
    `Details: ${complaint.details}\n` +
    `Time: ${new Date(complaint.createdAt).toLocaleString()}`
  );
}

export function formatVisitorMessage(visitor) {
  return (
    `👁️ <b>New visitor consented to data collection</b>\n` +
    `IP: ${visitor.ip || "unknown"}\n` +
    `Location: ${visitor.city || "?"}, ${visitor.country || "?"}\n` +
    `Device: ${visitor.deviceType} — ${visitor.browser}\n` +
    `Time: ${new Date(visitor.createdAt).toLocaleString()}`
  );
}
