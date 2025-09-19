import React, { useMemo, useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

/* ------------------ NAV ITEMS ------------------ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "dashboard", blurb: "High-level overview" },
  { id: "invites", label: "Invite Management", path: "invites", blurb: "Requests and codes" },
  { id: "clients", label: "Clients", path: "clients", blurb: "Membership roster" },
  { id: "mentors", label: "Mentors", path: "mentors", blurb: "Concierge team" },
  { id: "services", label: "Services & Content", path: "services", blurb: "Packages and resources" },
  { id: "reports", label: "Reports", path: "reports", blurb: "Performance insights" },
  { id: "settings", label: "Settings", path: "settings", blurb: "Brand + security" },
];

/* ------------------ SAMPLE DATA ------------------ */
const DASHBOARD_METRICS = [
  { label: "Total Invite Requests", value: 128 },
  { label: "Approved Invites", value: 94 },
  { label: "Active Clients", value: 38 },
  { label: "Mentors", value: 12 },
  { label: "Revenue (YTD)", value: "$420K" },
];

const ENGAGEMENT_TREND = [
  { month: "Jan", engagement: 42 },
  { month: "Feb", engagement: 48 },
  { month: "Mar", engagement: 51 },
  { month: "Apr", engagement: 58 },
  { month: "May", engagement: 61 },
  { month: "Jun", engagement: 66 },
];

/* ------------------ SIDEBAR ------------------ */
const SidebarContent = ({ items, onClose, showClose }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Taylor-Made</p>
        <p className="text-lg font-heading text-blueberry">Admin Studio</p>
      </div>
      {showClose && (
        <button
          type="button"
          className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-500 transition-colors hover:border-blueberry hover:text-blueberry"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
    <nav className="mt-8 flex flex-1 flex-col gap-3">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={`/admin-portal/${item.path}`}
          className={({ isActive }) =>
            `block rounded-2xl px-4 py-3 shadow-md backdrop-blur-md transition ${
              isActive
                ? "bg-gradient-to-r from-babyBlue/70 to-babyPink/70 text-white shadow-lg"
                : "bg-white/60 text-slate-600 hover:bg-babyBlue/20 hover:text-blueberry"
            }`
          }
          onClick={onClose}
        >
          <span className="font-semibold">{item.label}</span>
          <span className="mt-1 block text-xs text-slate-500">{item.blurb}</span>
        </NavLink>
      ))}
    </nav>
  </div>
);

const Sidebar = ({ items, isOpen, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity duration-200 lg:hidden ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    />

    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/20 bg-white/40 px-6 py-8 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <SidebarContent items={items} onClose={onClose} showClose />
    </aside>

    <div className="relative hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-white/20 lg:bg-white/40 lg:px-6 lg:py-8 lg:shadow-xl lg:backdrop-blur-xl">
      <div className="sticky top-10">
        <SidebarContent items={items} onClose={undefined} showClose={false} />
      </div>
    </div>
  </>
);

/* ------------------ TOPBAR ------------------ */
const Topbar = ({ adminName, onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden rounded-full border border-slate-200 px-3 py-2 text-xs font-heading uppercase tracking-[0.35em] text-blueberry"
          >
            Menu
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-babyBlue/20 font-heading text-blueberry shadow">
              TM
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Taylor-Made Concierge</p>
              <p className="font-playful text-2xl text-blueberry">Admin Suite</p>
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed in</p>
            <p className="font-semibold text-blueberry">{adminName}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-babyPink/30 text-blueberry font-heading">
            {adminName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

/* ------------------ DASHBOARD ------------------ */
const AdminDashboard = () => (
  <div className="space-y-8">
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {DASHBOARD_METRICS.map((metric) => (
        <article
          key={metric.label}
          className="rounded-[2rem] border border-babyBlue/30 bg-gradient-to-tr from-white via-babyBlue/10 to-babyPink/10 p-6 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
          <p className="mt-3 font-heading text-3xl text-blueberry">{metric.value}</p>
        </article>
      ))}
    </section>

    <section className="rounded-[2rem] border border-babyPink/40 bg-white/90 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-blueberry">Engagement Over Time</h2>
          <p className="text-sm text-slate-500">Monitor logins and concierge touchpoints.</p>
        </div>
        <button className="rounded-full bg-gradient-to-r from-babyBlue to-babyPink px-4 py-2 text-xs font-heading uppercase text-white shadow-md">
          Export
        </button>
      </div>
      <div className="mt-6 h-64">
        <ResponsiveContainer>
          <LineChart data={ENGAGEMENT_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="month" stroke="#94A3B8" />
            <YAxis allowDecimals={false} stroke="#94A3B8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="engagement" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  </div>
);

/* ------------------ ROOT ------------------ */
const AdminPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profile = useMemo(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);
  const adminName = profile?.name || "Admin";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cream via-white to-babyBlue/20 text-darkText">
      <Sidebar items={NAV_ITEMS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Topbar adminName={adminName} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route
                path="*"
                element={
                  <div className="rounded-[2rem] border border-babyPink/40 bg-white p-12 text-center shadow-md">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Not Found</p>
                    <h2 className="mt-4 font-playful text-3xl text-blueberry">This view is in concierge prep.</h2>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
