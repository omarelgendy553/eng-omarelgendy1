/**
 * A tiny localStorage-backed "database".
 *
 * IMPORTANT LIMITATION:
 * GitHub Pages only serves static files — there is no server to hold a real
 * database. This store keeps everything in the visitor's own browser
 * (localStorage), which is enough to demo the full flow (forms → admin
 * dashboard → CSV export) end to end on one machine/browser, but it will
 * NOT let you see a client's order from your own browser on your own phone.
 *
 * To make the admin dashboard genuinely cross-device, swap this file's
 * internals for calls to a real backend — Firebase Firestore, Supabase, or
 * a small REST API — while keeping the same function names so nothing else
 * in the app has to change.
 */

const KEYS = {
  visitors: "admin_visitors",
  orders: "admin_orders",
  complaints: "admin_complaints",
};

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getVisitors: () => read(KEYS.visitors),
  addVisitor: (visitor) => {
    const all = read(KEYS.visitors);
    all.unshift({ id: crypto.randomUUID(), ...visitor });
    write(KEYS.visitors, all);
  },

  getOrders: () => read(KEYS.orders),
  addOrder: (order) => {
    const all = read(KEYS.orders);
    const withMeta = { id: crypto.randomUUID(), status: "Pending", ...order };
    all.unshift(withMeta);
    write(KEYS.orders, all);
    return withMeta;
  },
  updateOrderStatus: (id, status) => {
    const all = read(KEYS.orders).map((o) => (o.id === id ? { ...o, status } : o));
    write(KEYS.orders, all);
  },

  getComplaints: () => read(KEYS.complaints),
  addComplaint: (complaint) => {
    const all = read(KEYS.complaints);
    const withMeta = { id: crypto.randomUUID(), status: "Pending", ...complaint };
    all.unshift(withMeta);
    write(KEYS.complaints, all);
    return withMeta;
  },
  updateComplaintStatus: (id, status) => {
    const all = read(KEYS.complaints).map((c) => (c.id === id ? { ...c, status } : c));
    write(KEYS.complaints, all);
  },
};
