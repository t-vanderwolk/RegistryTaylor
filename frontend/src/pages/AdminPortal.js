import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../lib/api";

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

/* ------------------ INVITE MANAGEMENT ------------------ */
const statusBadgeStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  declined: "bg-rose-100 text-rose-700",
};

const InviteManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioning, setActioning] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/invite-requests");
      setRequests(response.data?.data || []);
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to load invitation requests.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleDecision = async (id, status, options = {}) => {
    setActioning(`${id}-${status}`);
    try {
      await api.patch(`/api/v1/invite-requests/${id}`, {
        status,
        generateInviteCode: Boolean(options.generateInviteCode),
      });
      await loadRequests();
    } catch (err) {
      const message = err.response?.data?.error?.message || `Unable to mark request as ${status}.`;
      setError(message);
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Concierge Leads</p>
          <h1 className="font-playful text-3xl text-blueberry">Invitation Requests</h1>
          <p className="text-sm text-slate-500">
            Review prospective families, approve concierge access, or decline with a gentle touch.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="rounded-full border border-babyBlue/50 bg-white/80 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
        >
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <section className="rounded-[2rem] border border-babyPink/40 bg-white/95 p-6 shadow-lg">
        {loading ? (
          <p className="text-sm text-slate-500">Loading invitation requests…</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-slate-500">No invitation requests yet. New submissions will appear here.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-3xl border border-babyBlue/30 bg-white px-5 py-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-heading text-blueberry">{request.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <a href={`mailto:${request.email}`} className="underline">{request.email}</a>
                      {request.zip_code && <span>ZIP {request.zip_code}</span>}
                      {request.package_choice && <span>{request.package_choice}</span>}
                      <span>Requested {new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] ${
                      statusBadgeStyles[request.status] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                {request.generated_code && (
                  <p className="mt-2 text-xs font-heading uppercase tracking-[0.3em] text-emerald-600">
                    Invite Code: {request.generated_code}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={actioning === `${request.id}-approved` || request.status === 'approved'}
                    onClick={() =>
                      handleDecision(request.id, 'approved', {
                        generateInviteCode: !request.generated_code,
                      })
                    }
                    className={`rounded-full border border-emerald-300 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-emerald-600 shadow-soft transition ${
                      actioning === `${request.id}-approved` || request.status === 'approved'
                        ? 'opacity-60'
                        : 'hover:-translate-y-0.5 hover:shadow-dreamy'
                    }`}
                  >
                    {request.status === 'approved' ? 'Approved' : 'Approve & Generate Invite'}
                  </button>
                  <button
                    type="button"
                    disabled={actioning === `${request.id}-declined` || request.status === 'declined'}
                    onClick={() => handleDecision(request.id, 'declined')}
                    className={`rounded-full border border-rose-300 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-rose-600 shadow-soft transition ${
                      actioning === `${request.id}-declined` || request.status === 'declined'
                        ? 'opacity-60'
                        : 'hover:-translate-y-0.5 hover:shadow-dreamy'
                    }`}
                  >
                    {request.status === 'declined' ? 'Declined' : 'Decline'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

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
const Topbar = ({ adminName, onToggleSidebar, onSignOut }) => {
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
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-full border border-babyPink/60 bg-babyPink/10 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:bg-babyPink/20"
          >
            Log Out
          </button>
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
  const navigate = useNavigate();
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

  const handleSignOut = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    navigate("/portal");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cream via-white to-babyBlue/20 text-darkText">
      <Sidebar items={NAV_ITEMS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Topbar adminName={adminName} onToggleSidebar={() => setSidebarOpen((v) => !v)} onSignOut={handleSignOut} />
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="invites" element={<InviteManagement />} />
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
