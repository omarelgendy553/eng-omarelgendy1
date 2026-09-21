import React, { useState } from "react";

/**
 * Demo-grade auth: a single shared password read from an env var, stored in
 * sessionStorage once entered correctly. This is fine for keeping casual
 * visitors out of your dashboard, but it is NOT real authentication — the
 * password ships inside the built JS bundle. For anything sensitive, swap
 * this for Firebase Auth, Supabase Auth, or Auth0.
 */
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "omar-admin-2026";

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("is_admin", "true");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void px-6">
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 w-full max-w-sm">
        <h1 className="font-display text-xl font-semibold mb-1">Admin Access</h1>
        <p className="text-sm text-gray-400 mb-6 font-body">Enter the dashboard password.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-steel-500 font-body"
          autoFocus
        />
        {error && <p className="text-sm text-red-400 mb-3 font-body">Incorrect password.</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-r from-forest-600 to-steel-600 py-2.5 font-semibold"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
