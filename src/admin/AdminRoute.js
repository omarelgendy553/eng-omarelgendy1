import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminRoute() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("is_admin") === "true");

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <AdminDashboard
      onLogout={() => {
        sessionStorage.removeItem("is_admin");
        setAuthed(false);
      }}
    />
  );
}
