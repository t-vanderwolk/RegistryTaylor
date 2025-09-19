import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";

const members = [
  { id: 1, name: "Avery Parker", tier: "Signature", status: "active", mentor: "Morgan Ellis" },
  { id: 2, name: "Harper Family", tier: "Bespoke", status: "onboarding", mentor: "Registry With Taylor" },
  { id: 3, name: "Jordan Smith", tier: "Essentials", status: "active", mentor: "Morgan Ellis" },
];

const conciergeRequests = [
  { id: 21, type: "Nursery Reveal", owner: "Harper Family", submitted: "2h ago", priority: "high" },
  { id: 22, type: "Travel Concierge", owner: "Avery Parker", submitted: "Yesterday", priority: "medium" },
  { id: 23, type: "VIP Registry", owner: "Jordan Smith", submitted: "3 days ago", priority: "low" },
];

const mentorApplications = [
  { id: 31, name: "Sienna Wells", specialty: "Sleep Coaching", status: "Review" },
  { id: 32, name: "Aida Navarro", specialty: "Twin Coordination", status: "Interview" },
];

const resources = [
  { id: 41, title: "Taylor-Made Concierge Handbook", type: "Guide", updated: "Last week" },
  { id: 42, title: "Q4 Launch Calendar", type: "Roadmap", updated: "Sept 1" },
  { id: 43, title: "VIP Vendor Rolodex", type: "Directory", updated: "Today" },
];

const AdminDashboard = ({ admin }) => (
  <div className="space-y-6">
    <header className="space-y-2">
      <p className="text-sm uppercase tracking-[0.35em] text-babyBlue">Admin Overview</p>
      <h1 className="font-playful text-3xl text-blueberry">Welcome back, {admin?.name || "Admin"}! ✨</h1>
      <p className="font-body text-sm text-darkText/70">
        Keep the concierge program polished, confidential, and curated to perfection.
      </p>
    </header>

    <div className="grid gap-6 lg:grid-cols-3">
      <article className="rounded-3xl border border-babyBlue/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-blueberry">👥 Active Members</h2>
        <p className="mt-2 text-sm font-body text-darkText/70">Monitor tiers & mentoring coverage.</p>
        <ul className="mt-4 space-y-3 text-sm font-body text-darkText/80">
          {members.map((member) => (
            <li key={member.id} className="rounded-2xl bg-babyBlue/15 px-4 py-3">
              <p className="font-heading text-blueberry">{member.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-darkText/60">
                {member.tier} • Mentor: {member.mentor}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl border border-babyPink/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-blueberry">🎀 Concierge Requests</h2>
        <ul className="mt-4 space-y-3 text-sm font-body text-darkText/80">
          {conciergeRequests.map((request) => (
            <li key={request.id} className="rounded-2xl bg-babyPink/15 px-4 py-3">
              <p className="font-heading text-blueberry">{request.type}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-darkText/60">
                {request.owner} • Priority: {request.priority}
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-darkText/50">Submitted {request.submitted}</p>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl border border-pastelPurple/40 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-blueberry">🪄 Mentor Applications</h2>
        <ul className="mt-4 space-y-3 text-sm font-body text-darkText/80">
          {mentorApplications.map((application) => (
            <li key={application.id} className="rounded-2xl bg-pastelPurple/20 px-4 py-3">
              <p className="font-heading text-blueberry">{application.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-darkText/60">
                Specialty: {application.specialty} • Status: {application.status}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </div>
);

const MemberDirectory = () => (
  <div className="space-y-6">
    <header className="space-y-2">
      <h1 className="font-playful text-3xl text-blueberry">Member Directory 💌</h1>
      <p className="font-body text-sm text-darkText/70">Peek into each concierge journey and track their support circle.</p>
    </header>
    <div className="overflow-hidden rounded-3xl border border-babyBlue/30 bg-white shadow-soft">
      <table className="w-full text-left text-sm font-body text-darkText/80">
        <thead className="bg-babyBlue/20 text-xs uppercase tracking-[0.25em] text-blueberry">
          <tr>
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">Tier</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Mentor</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-t border-babyBlue/10">
              <td className="px-4 py-4 font-heading text-blueberry">{member.name}</td>
              <td className="px-4 py-4">{member.tier}</td>
              <td className="px-4 py-4">{member.status}</td>
              <td className="px-4 py-4">{member.mentor}</td>
              <td className="px-4 py-4">
                <button className="rounded-full bg-babyPink px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft">
                  View Journey
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ConciergeBoard = () => (
  <div className="space-y-6">
    <header className="space-y-2">
      <h1 className="font-playful text-3xl text-blueberry">Concierge Board 🪄</h1>
      <p className="font-body text-sm text-darkText/70">
        Track bespoke requests, assign mentors, and sprinkle in the Taylor-made magic.
      </p>
    </header>
    <div className="grid gap-4 md:grid-cols-3">
      {conciergeRequests.map((request) => (
        <article key={request.id} className="rounded-3xl border border-babyPink/30 bg-white p-5 shadow-soft">
          <header className="flex items-center justify-between">
            <p className="font-heading text-blueberry">{request.type}</p>
            <span className="rounded-full bg-babyPink/30 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-blueberry">
              {request.priority}
            </span>
          </header>
          <p className="mt-3 text-sm font-body text-darkText/75">Owner: {request.owner}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-darkText/50">Submitted {request.submitted}</p>
          <div className="mt-4 flex gap-2">
            <button className="rounded-full bg-babyBlue px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft">
              Assign Mentor
            </button>
            <button className="rounded-full border border-babyPink px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft">
              View Brief
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const KnowledgeLibrary = () => (
  <div className="space-y-6">
    <header className="space-y-2">
      <h1 className="font-playful text-3xl text-blueberry">Knowledge Library 📚</h1>
      <p className="font-body text-sm text-darkText/70">
        Keep mentors in the loop with the latest guides, checklists, and private memos.
      </p>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      {resources.map((resource) => (
        <article key={resource.id} className="flex items-center justify-between rounded-3xl border border-pastelPurple/40 bg-white px-6 py-4 shadow-soft">
          <div>
            <p className="font-heading text-blueberry">{resource.title}</p>
            <p className="text-xs font-body uppercase tracking-[0.3em] text-darkText/60">
              {resource.type} • Updated {resource.updated}
            </p>
          </div>
          <button className="rounded-full bg-pastelPurple px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft">
            View
          </button>
        </article>
      ))}
    </div>
  </div>
);

const AdminPortalLayout = ({ admin, onSignOut }) => {
  const location = useLocation();
  const links = useMemo(
    () => [
      { to: "/admin-portal", label: "Dashboard" },
      { to: "/admin-portal/members", label: "Member Directory" },
      { to: "/admin-portal/concierge", label: "Concierge Board" },
      { to: "/admin-portal/library", label: "Knowledge Library" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-cream text-darkText">
      <header className="sticky top-0 z-40 border-b border-babyPink/30 bg-white/90 backdrop-blur shadow-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-babyPink/40 px-3 py-2 font-heading text-blueberry shadow-soft">
              Taylor-Made Baby Planning
            </div>
            <span className="hidden text-xs uppercase tracking-[0.3em] text-darkText/50 md:inline">
              Admin Concierge Command
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-babyPink/40 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft hover:-translate-y-1 hover:shadow-dreamy"
            >
              Log Out
            </button>
            <div className="flex items-center gap-3 rounded-full border border-babyPink/30 bg-white px-3 py-2 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-babyPink/40 font-heading text-blueberry">
                {(admin?.name || 'AD').slice(0, 2).toUpperCase()}
              </span>
              <div className="text-left">
                <p className="font-heading text-sm text-blueberry">{admin?.name || 'Admin'}</p>
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-darkText/50">Concierge Director</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row">
        <nav className="lg:w-64">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/admin-portal"}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 font-body text-sm transition ${
                      isActive
                        ? 'bg-babyBlue/20 text-blueberry border border-babyBlue/40'
                        : 'border border-transparent text-darkText/70 hover:bg-babyBlue/10'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.label}</span>
                      {isActive && <span className="text-xs font-heading text-blueberry">★</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-6 shadow-soft">
          <Routes>
            <Route index element={<AdminDashboard admin={admin} />} />
            <Route path="members" element={<MemberDirectory />} />
            <Route path="concierge" element={<ConciergeBoard />} />
            <Route path="library" element={<KnowledgeLibrary />} />
            <Route path="*" element={<AdminDashboard admin={admin} />} />
          </Routes>
        </main>
      </div>

      <footer className="px-4 pb-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-babyPink/30 bg-babyPink/10 px-6 py-3 text-center text-[0.65rem] font-heading uppercase tracking-[0.3em] text-darkText/50">
          Taylor-Made Baby Planning • Confidential Concierge Operations • NDA Protected
        </div>
      </footer>
    </div>
  );
};

const AdminPortal = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    const token = localStorage.getItem("tm_token");
    if (!token) {
      setState({ status: "unauthorized", data: null, error: "Please sign in to access the admin portal." });
      return;
    }

    const abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch("/api/v1/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("tm_token");
          localStorage.removeItem("tm_user");
          setState({ status: "unauthorized", data: null, error: "Your session expired. Please sign in again." });
          return;
        }

        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(payload?.error?.message || "Unable to load admin profile.");
        }

        if (payload?.data?.role !== 'admin') {
          setState({ status: "unauthorized", data: null, error: "Only admin users may access this portal." });
          return;
        }

        setState({ status: "ready", data: payload.data, error: null });
      } catch (error) {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error: error.message || "Unable to load admin profile." });
      }
    })();

    return () => abortController.abort();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    setState({ status: "unauthorized", data: null, error: "Signed out." });
    navigate("/portal");
  };

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-blueberry">Loading concierge dashboards…</p>
        </div>
      </main>
    );
  }

  if (state.status === "unauthorized") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="space-y-4 rounded-[2.5rem] border border-babyPink/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-blueberry">{state.error}</p>
          <button
            type="button"
            onClick={() => navigate("/portal")}
            className="mx-auto rounded-full bg-babyBlue px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Go to Sign In
          </button>
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="space-y-4 rounded-[2.5rem] border border-babyPink/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-blueberry">{state.error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mx-auto rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return <AdminPortalLayout admin={state.data} onSignOut={handleSignOut} />;
};

export default AdminPortal;
