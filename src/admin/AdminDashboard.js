import React, { useEffect, useState } from "react";
import { store } from "../utils/store";
import { exportToCSV } from "../utils/csvExport";

const STATUS_OPTIONS = ["Pending", "Completed", "Rejected"];

function StatusBadge({ status }) {
  const colors = {
    Pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    Completed: "bg-forest-600/30 text-forest-500 border-forest-500/40",
    Rejected: "bg-red-500/20 text-red-300 border-red-500/40",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${colors[status] || ""}`}>{status}</span>
  );
}

function SectionCard({ title, count, onExport, children }) {
  return (
    <div className="glass-panel rounded-2xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">
          {title} <span className="text-gray-500 text-sm font-normal">({count})</span>
        </h2>
        <button
          onClick={onExport}
          className="text-xs rounded-lg border border-steel-500/60 px-3 py-1.5 text-steel-400 hover:bg-steel-500/10 transition-colors"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [visitors, setVisitors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const refresh = () => {
    setVisitors(store.getVisitors());
    setOrders(store.getOrders());
    setComplaints(store.getComplaints());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleOrderStatus = (id, status) => {
    store.updateOrderStatus(id, status);
    refresh();
  };

  const handleComplaintStatus = (id, status) => {
    store.updateComplaintStatus(id, status);
    refresh();
  };

  return (
    <div className="min-h-screen bg-void px-4 md:px-8 py-10 font-body text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="text-sm rounded-lg border border-white/15 px-4 py-2 hover:bg-white/5 transition-colors"
          >
            Log out
          </button>
        </div>

        {/* VISITORS */}
        <SectionCard
          title="Visitor Data"
          count={visitors.length}
          onExport={() => exportToCSV(visitors, "visitors.csv")}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/10">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Device</th>
                <th className="py-2 pr-4">Browser / OS</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id} className="border-b border-white/5">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(v.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{v.ip}</td>
                  <td className="py-2 pr-4">{[v.city, v.country].filter(Boolean).join(", ") || "—"}</td>
                  <td className="py-2 pr-4">{v.deviceType}</td>
                  <td className="py-2 pr-4">{v.browser} / {v.os}</td>
                </tr>
              ))}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-600">
                    No visitor data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SectionCard>

        {/* ORDERS */}
        <SectionCard title="Orders" count={orders.length} onExport={() => exportToCSV(orders, "orders.csv")}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/10">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">Details</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 align-top">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{o.name}</td>
                  <td className="py-2 pr-4">{o.phone}</td>
                  <td className="py-2 pr-4">{o.service || "—"}</td>
                  <td className="py-2 pr-4 max-w-xs">{o.details}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.status} />
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                        className="bg-black/40 border border-white/10 rounded text-xs px-1.5 py-1"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-600">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SectionCard>

        {/* COMPLAINTS */}
        <SectionCard
          title="Complaints"
          count={complaints.length}
          onExport={() => exportToCSV(complaints, "complaints.csv")}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/10">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Contact</th>
                <th className="py-2 pr-4">Details</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b border-white/5 align-top">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-4">{c.name}</td>
                  <td className="py-2 pr-4">{c.contact}</td>
                  <td className="py-2 pr-4 max-w-xs">{c.details}</td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status} />
                      <select
                        value={c.status}
                        onChange={(e) => handleComplaintStatus(c.id, e.target.value)}
                        className="bg-black/40 border border-white/10 rounded text-xs px-1.5 py-1"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-600">
                    No complaints yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}
