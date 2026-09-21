import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { store } from "../utils/store";
import { sendTelegramNotification, formatOrderMessage, formatComplaintMessage } from "../utils/telegram";

const WHATSAPP_NUMBER = "201032853311";

function Field({ label, ...props }) {
  return (
    <label className="block mb-4 text-start">
      <span className="block text-sm text-gray-400 mb-1.5 font-body">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-steel-500 font-body"
      />
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block mb-4 text-start">
      <span className="block text-sm text-gray-400 mb-1.5 font-body">{label}</span>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-steel-500 font-body resize-none"
      />
    </label>
  );
}

export function OrderForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", service: "", details: "" });
  const [status, setStatus] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.details) return;

    const order = { ...form, createdAt: Date.now() };
    store.addOrder(order);
    sendTelegramNotification(formatOrderMessage(order));

    const waText = encodeURIComponent(
      `New order via website:\n` +
        `Name: ${form.name}\n` +
        `Phone: ${form.phone}\n` +
        `Service: ${form.service}\n` +
        `Details: ${form.details}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, "_blank");

    setStatus("success");
    setForm({ name: "", phone: "", service: "", details: "" });
  };

  return (
    <section id="order" className="max-w-2xl mx-auto px-6 py-24">
      <div className="glass-panel rounded-2xl p-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-1">{t.order.title}</h2>
        <p className="text-gray-400 text-sm mb-6 font-body">{t.order.subtitle}</p>
        <form onSubmit={handleSubmit}>
          <Field label={t.order.name} value={form.name} onChange={update("name")} required />
          <Field label={t.order.phone} value={form.phone} onChange={update("phone")} required type="tel" />
          <Field label={t.order.service} value={form.service} onChange={update("service")} />
          <TextArea label={t.order.details} value={form.details} onChange={update("details")} required />
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-forest-600 to-steel-600 py-3 font-body font-semibold hover:opacity-90 transition-opacity"
          >
            {t.order.submit}
          </button>
          {status === "success" && (
            <p className="mt-3 text-sm text-forest-500 font-body">{t.order.success}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export function ComplaintForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", contact: "", details: "" });
  const [status, setStatus] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.details) return;

    const complaint = { ...form, createdAt: Date.now() };
    store.addComplaint(complaint);
    sendTelegramNotification(formatComplaintMessage(complaint));

    setStatus("success");
    setForm({ name: "", contact: "", details: "" });
  };

  return (
    <section id="complaint" className="max-w-2xl mx-auto px-6 py-24">
      <div className="glass-panel rounded-2xl p-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-1">{t.complaint.title}</h2>
        <p className="text-gray-400 text-sm mb-6 font-body">{t.complaint.subtitle}</p>
        <form onSubmit={handleSubmit}>
          <Field label={t.complaint.name} value={form.name} onChange={update("name")} required />
          <Field label={t.complaint.email} value={form.contact} onChange={update("contact")} required />
          <TextArea label={t.complaint.details} value={form.details} onChange={update("details")} required />
          <button
            type="submit"
            className="w-full rounded-lg border border-steel-500 py-3 font-body font-semibold text-steel-400 hover:bg-steel-500/10 transition-colors"
          >
            {t.complaint.submit}
          </button>
          {status === "success" && (
            <p className="mt-3 text-sm text-forest-500 font-body">{t.complaint.success}</p>
          )}
        </form>
      </div>
    </section>
  );
}
