import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Routes, Route, Navigate, useNavigate, useLocation, Link } from "react-router-dom";
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
import { SparklesIcon } from "@heroicons/react/24/outline";
import api from "../lib/api";
import EmptyState from "../components/UI/EmptyState";
import RegistryBoard from "../components/registry/RegistryBoard";
import { useRegistryStore } from "../hooks/useRegistryStore";

const EnvelopeIcon = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 5.25h16.5a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-12a.75.75 0 0 1 .75-.75zm0 0 8.25 6 8.25-6"
    />
  </svg>
);

/* ------------------ NAV ITEMS ------------------ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "dashboard", blurb: "High-level overview" },
  { id: "invites", label: "Invite Management", path: "invites", blurb: "Requests and codes" },
  { id: "messages", label: "Messaging", path: "messages", blurb: "Conversations" },
  { id: "clients", label: "Clients", path: "clients", blurb: "Membership roster" },
  { id: "mentors", label: "Mentors", path: "mentors", blurb: "Concierge team" },
  { id: "calendar", label: "Calendar", path: "calendar", blurb: "Milestones & events" },
  { id: "registry", label: "Registry", path: "registry", blurb: "Lists & gifting" },
  { id: "blog", label: "Blog Manager", path: "blog", blurb: "Posts & drafts" },
  { id: "services", label: "Services & Content", path: "services", blurb: "Packages and resources" },
  { id: "reports", label: "Reports", path: "reports", blurb: "Performance insights" },
  { id: "settings", label: "Settings", path: "settings", blurb: "Brand + security" },
];

const engagementSeries = (data) =>
  (data || []).map((point) => ({
    ...point,
    label: point.month,
  }));

const useAdminMetrics = () => {
  const [stats, setStats] = useState(null);
  const [recentInvites, setRecentInvites] = useState([]);
  const [engagement, setEngagement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/admin/dashboard");
      const payload = response.data?.data || {};
      setStats(payload.stats || null);
      setRecentInvites(Array.isArray(payload.recent_invites) ? payload.recent_invites : []);
      setEngagement(Array.isArray(payload.engagement) ? payload.engagement : []);
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to load admin metrics.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return {
    stats,
    recentInvites,
    engagement,
    loading,
    error,
    reload: loadMetrics,
  };
};

/* ------------------ INVITE MANAGEMENT ------------------ */
const statusBadgeStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  declined: "bg-rose-100 text-rose-700",
};

const InviteManagement = ({ onApproved }) => {
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
      const response = await api.patch(`/api/v1/invite-requests/${id}`, {
        status,
        generateInviteCode: Boolean(options.generateInviteCode),
        targetRole: options.targetRole,
      });
      await loadRequests();
      if (status === 'approved' && typeof onApproved === 'function') {
        const updated = response.data?.data;
        onApproved(updated);
      }
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
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] ${
                        statusBadgeStyles[request.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {request.status}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-babyBlue/30 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-blueberry/80">
                      {request.requested_role === 'mentor' ? 'Mentor' : 'Client'}
                    </span>
                  </div>
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
                        targetRole: request.requested_role,
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
const SidebarContent = ({ items, basePath, onClose, showClose }) => (
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
          to={`${basePath}/${item.path}`}
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

const Sidebar = ({ items, basePath, isOpen, onClose }) => (
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
      <SidebarContent items={items} basePath={basePath} onClose={onClose} showClose />
    </aside>

    <div className="relative hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-white/20 lg:bg-white/40 lg:px-6 lg:py-8 lg:shadow-xl lg:backdrop-blur-xl">
      <div className="sticky top-10">
        <SidebarContent items={items} basePath={basePath} onClose={undefined} showClose={false} />
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
const AdminDashboard = ({ basePath: dashboardBasePath = "/admin" }) => {
  const { stats, recentInvites, engagement, loading, error, reload } = useAdminMetrics();
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");
  const [questionDrafts, setQuestionDrafts] = useState({});
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [mentorsError, setMentorsError] = useState("");

  const metricCards = [
    { id: "total_invite_requests", label: "Invite Requests", value: stats?.total_invite_requests },
    { id: "pending_invite_requests", label: "Pending Invites", value: stats?.pending_invite_requests },
    { id: "approved_invite_requests", label: "Approved Invites", value: stats?.approved_invite_requests },
    { id: "active_clients", label: "Active Clients", value: stats?.active_clients },
    { id: "active_mentors", label: "Active Mentors", value: stats?.active_mentors },
  ];

  const formatValue = (value) => {
    if (loading) return "...";
    if (typeof value === "number") return value;
    return "--";
  };

  const hydrateDrafts = useCallback((items) => {
    setQuestionDrafts(() =>
      items.reduce((acc, item) => {
        acc[item.id] = {
          answer: item.answer || '',
          status: item.status || 'pending',
          username: item.username || '',
          email: item.email || '',
          question: item.question,
          assigned_to: item.assigned_to || '',
        };
        return acc;
      }, {})
    );
  }, []);

  const loadQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError("");
    try {
      const response = await api.get('/api/v1/admin/blog/questions');
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setQuestions(data);
      hydrateDrafts(data);
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Unable to load blog questions.';
      setQuestionsError(message);
    } finally {
      setQuestionsLoading(false);
    }
  }, [hydrateDrafts]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    const loadMentors = async () => {
      setMentorsLoading(true);
      setMentorsError("");
      try {
        const response = await api.get('/api/v1/admin/mentors');
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        setMentors(data);
      } catch (err) {
        const message = err.response?.data?.error?.message || 'Unable to load mentors.';
        setMentorsError(message);
      } finally {
        setMentorsLoading(false);
      }
    };

    loadMentors();
  }, []);

  const handleDraftChange = (id, field, value) => {
    setQuestionDrafts((current) => {
      const nextDraft = {
        ...(current[id] || {}),
        [field]: value,
      };

      if (field === 'answer') {
        const trimmed = value?.trim() || '';
        nextDraft.status = trimmed.length ? 'published' : 'pending';
      }

      return {
        ...current,
        [id]: nextDraft,
      };
    });
  };

  const handleSaveQuestion = async (id) => {
    const draft = questionDrafts[id];
    if (!draft) return;
    try {
      const response = await api.patch(`/api/v1/admin/blog/questions/${id}`, {
        username: draft.username,
        email: draft.email,
        question: draft.question,
        answer: draft.answer,
        status: draft.status,
      });
      const updated = response.data?.data;
      if (updated) {
        setQuestions((current) => {
          const next = current.map((item) => (item.id === id ? updated : item));
          hydrateDrafts(next);
          return next;
        });
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Unable to update question.';
      setQuestionsError(message);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await api.delete(`/api/v1/admin/blog/questions/${id}`);
      setQuestions((current) => {
        const next = current.filter((item) => item.id !== id);
        hydrateDrafts(next);
        return next;
      });
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Unable to delete question.';
      setQuestionsError(message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Concierge Pulse</p>
          <h1 className="font-playful text-3xl text-blueberry">Operations Dashboard</h1>
          <p className="text-sm text-slate-500">Live counts from the client, mentor, and invite programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`${dashboardBasePath}/messages`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-babyPink/60 bg-white text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
            aria-label="View Messages"
          >
            <EnvelopeIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={reload}
            className="rounded-full border border-babyBlue/50 bg-white/80 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
          >
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((metric) => (
          <article
            key={metric.id}
            className="rounded-[2rem] border border-babyBlue/30 bg-gradient-to-tr from-white via-babyBlue/10 to-babyPink/10 p-6 shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
            <p className="mt-3 font-heading text-3xl text-blueberry">{formatValue(metric.value)}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-pastelPurple/40 bg-white/95 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-blueberry">Blog Q & A Submissions</h2>
            <p className="text-sm text-darkText/60">Review reader questions and publish answers to the public blog.</p>
          </div>
          <button
            type="button"
            onClick={loadQuestions}
            className="rounded-full border border-pastelPurple/40 bg-white px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
          >
            Refresh
          </button>
        </div>

        {questionsError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {questionsError}
          </div>
        )}

        {questionsLoading ? (
          <div className="mt-6">
            <EmptyState
              title="Loading questions"
              description="Gathering submissions from the Q & A form."
              icon={SparklesIcon}
            />
          </div>
        ) : questions.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No questions yet"
              description="Once readers submit Q & A prompts, you can answer and publish them here."
              icon={SparklesIcon}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {questions.map((question) => {
              const draft = questionDrafts[question.id] || { answer: question.answer || '', status: question.status, name: question.name || '', question: question.question };
              return (
                <article
                  key={question.id}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-pastelPurple/40 bg-white/95 p-5 shadow-soft"
                >
                  <header className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">
                        {question.username || 'Guest'} · {new Date(question.created_at).toLocaleDateString()}
                      </p>
                      <input
                        type="text"
                        value={draft.username}
                        onChange={(event) => handleDraftChange(question.id, 'username', event.target.value)}
                        className="w-full rounded-2xl border border-pastelPurple/40 bg-white px-3 py-2 font-heading text-sm text-blueberry focus:border-babyPink focus:outline-none"
                        placeholder="Username"
                      />
                      <input
                        type="email"
                        value={draft.email}
                        onChange={(event) => handleDraftChange(question.id, 'email', event.target.value)}
                        className="w-full rounded-2xl border border-pastelPurple/40 bg-white px-3 py-2 font-body text-sm text-blueberry focus:border-babyPink focus:outline-none"
                        placeholder="Email"
                      />
                    </div>
                    <textarea
                      value={draft.question}
                      onChange={(event) => handleDraftChange(question.id, 'question', event.target.value)}
                      className="w-full rounded-2xl border border-pastelPurple/40 bg-white px-3 py-2 font-heading text-base text-blueberry focus:border-babyPink focus:outline-none"
                      rows={3}
                    />
                  </header>

                  <label className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">
                    Answer
                    <textarea
                      value={draft.answer}
                      onChange={(event) => handleDraftChange(question.id, 'answer', event.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-pastelPurple/40 bg-white px-3 py-3 font-body text-sm text-darkText/80 focus:border-babyPink focus:outline-none"
                      placeholder="Craft a thoughtful concierge response…"
                    />
                  </label>

        <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.3em] text-darkText/60">
          <span>Status</span>
          <select
            value={draft.status}
            onChange={(event) => handleDraftChange(question.id, 'status', event.target.value)}
            className="rounded-full border border-pastelPurple/40 bg-white px-3 py-1 text-blueberry focus:border-babyPink focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.3em] text-darkText/60">
          <span>Assigned Mentor</span>
          <select
            value={draft.assigned_to || ''}
            onChange={(event) => handleDraftChange(question.id, 'assigned_to', event.target.value || null)}
            className="rounded-full border border-pastelPurple/40 bg-white px-3 py-1 text-blueberry focus:border-babyPink focus:outline-none"
            disabled={mentorsLoading}
          >
            <option value="">Unassigned</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name}
              </option>
            ))}
          </select>
          {mentorsError && <span className="text-[0.6rem] font-body text-rose-500 normal-case">{mentorsError}</span>}
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleSaveQuestion(question.id)}
                      className="rounded-full bg-babyBlue px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="rounded-full border border-rose-200 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-rose-500 shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-dreamy"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-babyPink/40 bg-white/90 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl text-blueberry">Engagement Over Time</h2>
            <p className="text-sm text-slate-500">Invites, new clients, and messages by month.</p>
          </div>
        <button className="rounded-full bg-gradient-to-r from-babyBlue to-babyPink px-4 py-2 text-xs font-heading uppercase text-white shadow-md">
          Export
        </button>
      </div>
      <div className="mt-6 h-64">
          <ResponsiveContainer>
            <LineChart data={engagementSeries(engagement)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#94A3B8" />
              <YAxis allowDecimals={false} stroke="#94A3B8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="invites" name="Invites" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="new_clients" name="New Clients" stroke="#F472B6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="messages" name="Messages" stroke="#1D4ED8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {engagement.length === 0 && !loading && (
          <p className="mt-4 text-xs font-heading uppercase tracking-[0.3em] text-slate-400">
            No engagement activity recorded yet.
          </p>
        )}
      </section>

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/90 p-6 shadow-lg">
        <h2 className="font-heading text-xl text-blueberry">Recent Invites</h2>
        <p className="text-sm text-slate-500">Latest codes generated across concierge programs.</p>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading recent invites...</p>
        ) : recentInvites.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No invite codes issued yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentInvites.map((invite) => (
              <div
                key={invite.code}
                className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-babyBlue/20 bg-white px-5 py-4 shadow-soft"
              >
                <div>
                  <p className="font-heading text-blueberry">{invite.code}</p>
                  <p className="text-xs text-slate-500">{invite.role}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>{invite.assigned_name || "Unassigned"}</p>
                  <p>{invite.created_at ? new Date(invite.created_at).toLocaleDateString() : "--"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* ------------------ CLIENT DIRECTORY ------------------ */
const ClientDirectory = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientDetail, setClientDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/admin/clients");
      setClients(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to load clients.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const formatDate = useCallback((value) => {
    if (!value) return '--';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString();
  }, []);

  const openClientDetail = useCallback(
    async (id) => {
      setSelectedClientId(id);
      setClientDetail(null);
      setDetailError("");
      setDetailLoading(true);
      try {
        const response = await api.get(`/api/v1/admin/clients/${id}`);
        setClientDetail(response.data?.data || null);
      } catch (err) {
        const message = err.response?.data?.error?.message || "Unable to load client profile.";
        setDetailError(message);
      } finally {
        setDetailLoading(false);
      }
    },
    []
  );

  const closeClientDetail = () => {
    setSelectedClientId(null);
    setClientDetail(null);
    setDetailError("");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Concierge Members</p>
          <h1 className="font-playful text-3xl text-blueberry">Active Clients</h1>
          <p className="text-sm text-slate-500">Families with live access to the concierge studio.</p>
        </div>
        <button
          type="button"
          onClick={loadClients}
          className="rounded-full border border-babyBlue/50 bg-white/80 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
        >
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
      )}

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-lg">
        {loading ? (
          <p className="text-sm text-slate-500">Loading clients...</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-slate-500">No active clients at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {clients.map((client) => (
              <li key={client.id} className="rounded-3xl border border-babyBlue/20 bg-white px-5 py-4 shadow-soft">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => openClientDetail(client.id)}
                      className="font-heading text-lg text-blueberry underline-offset-4 hover:underline"
                    >
                      {client.name}
                    </button>
                    <p className="text-xs text-slate-500">{client.email}</p>
                    {client.phone && <p className="text-xs text-slate-400">{client.phone}</p>}
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p>Joined {formatDate(client.created_at)}</p>
                    {client.package_choice && <p>Package: {client.package_choice}</p>}
                  </div>
                </div>
                {client.mentors?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {client.mentors.map((mentor) => (
                      <span
                        key={mentor.id}
                        className="inline-flex items-center rounded-full bg-babyBlue/10 px-3 py-1 text-[0.7rem] font-heading uppercase tracking-[0.25em] text-blueberry"
                      >
                        {mentor.name}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProfileDrawer
        open={Boolean(selectedClientId)}
        title={clientDetail?.client?.name || 'Client Profile'}
        onClose={closeClientDetail}
        loading={detailLoading}
        error={detailError}
      >
        {clientDetail && !detailLoading && !detailError && (
          <div className="space-y-6 text-sm text-slate-600">
            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Contact</h3>
              <div className="mt-3 space-y-2">
                <p><span className="font-semibold text-blueberry">Email:</span> {clientDetail.client.email}</p>
                {clientDetail.client.phone && <p><span className="font-semibold text-blueberry">Phone:</span> {clientDetail.client.phone}</p>}
                {clientDetail.client.zip_code && <p><span className="font-semibold text-blueberry">ZIP:</span> {clientDetail.client.zip_code}</p>}
                <p><span className="font-semibold text-blueberry">Member since:</span> {formatDate(clientDetail.client.created_at)}</p>
              </div>
            </section>

            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Concierge Details</h3>
              <div className="mt-3 space-y-2">
                <p><span className="font-semibold text-blueberry">Package:</span> {clientDetail.client.package_choice || 'N/A'}</p>
                <p><span className="font-semibold text-blueberry">Due date:</span> {formatDate(clientDetail.client.due_date)}</p>
                {clientDetail.client.mentor_preference && (
                  <p><span className="font-semibold text-blueberry">Mentor preference:</span> {clientDetail.client.mentor_preference}</p>
                )}
                {clientDetail.client.family_intro && (
                  <p className="whitespace-pre-line"><span className="font-semibold text-blueberry">Family intro:</span> {clientDetail.client.family_intro}</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Mentor Team</h3>
              {clientDetail.mentors.length === 0 ? (
                <p className="mt-3 text-slate-500">No mentors assigned yet.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {clientDetail.mentors.map((mentor) => (
                    <li key={mentor.id}>
                      <span className="font-semibold text-blueberry">{mentor.name}</span>
                      <p className="text-xs text-slate-500">{mentor.specialty || 'Concierge mentor'}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Invite History</h3>
              {clientDetail.invites.length === 0 ? (
                <p className="mt-3 text-slate-500">No invites associated with this email.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {clientDetail.invites.map((invite) => (
                    <li key={invite.code} className="rounded-2xl border border-babyBlue/20 bg-babyBlue/10 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-blueberry">{invite.code}</span>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{invite.used_at ? 'Used' : 'Open'}</span>
                      </div>
                      <p className="text-xs text-slate-500">Created {formatDate(invite.created_at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </ProfileDrawer>
    </div>
  );
};

/* ------------------ MENTOR DIRECTORY ------------------ */
const MentorDirectory = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [mentorDetail, setMentorDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadMentors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/admin/mentors");
      setMentors(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to load mentors.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  const formatDate = useCallback((value) => {
    if (!value) return '--';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '--' : date.toLocaleDateString();
  }, []);

  const openMentorDetail = useCallback(async (id) => {
    setSelectedMentorId(id);
    setMentorDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const response = await api.get(`/api/v1/admin/mentors/${id}`);
      setMentorDetail(response.data?.data || null);
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to load mentor profile.";
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeMentorDetail = () => {
    setSelectedMentorId(null);
    setMentorDetail(null);
    setDetailError("");
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Concierge Team</p>
          <h1 className="font-playful text-3xl text-blueberry">Active Mentors</h1>
          <p className="text-sm text-slate-500">Specialists currently supporting families.</p>
        </div>
        <button
          type="button"
          onClick={loadMentors}
          className="rounded-full border border-babyBlue/50 bg-white/80 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
        >
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
      )}

      <section className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-lg">
        {loading ? (
          <p className="text-sm text-slate-500">Loading mentors...</p>
        ) : mentors.length === 0 ? (
          <p className="text-sm text-slate-500">No active mentors currently enrolled.</p>
        ) : (
          <ul className="space-y-4">
            {mentors.map((mentor) => (
              <li
                key={mentor.id}
                className="rounded-3xl border border-babyPink/20 bg-white px-5 py-4 shadow-soft"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => openMentorDetail(mentor.id)}
                      className="font-heading text-lg text-blueberry underline-offset-4 hover:underline"
                    >
                      {mentor.name}
                    </button>
                    <p className="text-xs text-slate-500">{mentor.email}</p>
                    {mentor.phone && <p className="text-xs text-slate-400">{mentor.phone}</p>}
                    {mentor.specialty && (
                      <p className="mt-2 text-xs font-heading uppercase tracking-[0.3em] text-slate-500">
                        Specialty: {mentor.specialty}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p>
                      Joined {mentor.created_at ? new Date(mentor.created_at).toLocaleDateString() : "--"}
                    </p>
                    {mentor.max_clients && (
                      <p>
                        Capacity {mentor.client_count || 0}/{Number(mentor.max_clients) || "∞"}
                      </p>
                    )}
                  </div>
                </div>
                {mentor.clients?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mentor.clients.map((client) => (
                      <span
                        key={client.id}
                        className="inline-flex items-center rounded-full bg-babyBlue/10 px-3 py-1 text-[0.7rem] font-heading uppercase tracking-[0.25em] text-blueberry"
                      >
                        {client.name}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProfileDrawer
        open={Boolean(selectedMentorId)}
        title={mentorDetail?.mentor?.name || 'Mentor Profile'}
        onClose={closeMentorDetail}
        loading={detailLoading}
        error={detailError}
      >
        {mentorDetail && !detailLoading && !detailError && (
          <div className="space-y-6 text-sm text-slate-600">
            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Contact</h3>
              <div className="mt-3 space-y-2">
                <p><span className="font-semibold text-blueberry">Email:</span> {mentorDetail.mentor.email}</p>
                {mentorDetail.mentor.phone && <p><span className="font-semibold text-blueberry">Phone:</span> {mentorDetail.mentor.phone}</p>}
                <p><span className="font-semibold text-blueberry">Joined:</span> {formatDate(mentorDetail.mentor.created_at)}</p>
              </div>
            </section>

            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Profile</h3>
              <div className="mt-3 space-y-2">
                <p><span className="font-semibold text-blueberry">Specialty:</span> {mentorDetail.mentor.specialty || 'Concierge mentor'}</p>
                {mentorDetail.mentor.availability && (
                  <p><span className="font-semibold text-blueberry">Availability:</span> {mentorDetail.mentor.availability}</p>
                )}
                <p><span className="font-semibold text-blueberry">Capacity:</span> {mentorDetail.mentor.max_clients || 'Flexible'}</p>
                {mentorDetail.mentor.bio && (
                  <p className="whitespace-pre-line"><span className="font-semibold text-blueberry">Bio:</span> {mentorDetail.mentor.bio}</p>
                )}
                {mentorDetail.mentor.certifications?.length > 0 && (
                  <p>
                    <span className="font-semibold text-blueberry">Certifications:</span>{' '}
                    {mentorDetail.mentor.certifications.join(', ')}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Assigned Families</h3>
              {mentorDetail.clients.length === 0 ? (
                <p className="mt-3 text-slate-500">No families assigned yet.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {mentorDetail.clients.map((client) => (
                    <li key={client.id}>
                      <span className="font-semibold text-blueberry">{client.name}</span>
                      <p className="text-xs text-slate-500">
                        {client.package_choice || 'Package TBD'} · Due {formatDate(client.due_date)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Invite History</h3>
              {mentorDetail.invites.length === 0 ? (
                <p className="mt-3 text-slate-500">No invites associated with this email.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {mentorDetail.invites.map((invite) => (
                    <li key={invite.code} className="rounded-2xl border border-babyBlue/20 bg-babyBlue/10 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-blueberry">{invite.code}</span>
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{invite.used_at ? 'Used' : 'Open'}</span>
                      </div>
                      <p className="text-xs text-slate-500">Created {formatDate(invite.created_at)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </ProfileDrawer>
    </div>
  );
};

/* ------------------ CALENDAR ------------------ */
const AdminMessages = () => {
  const [threads, setThreads] = useState([]);
  const [threadLoading, setThreadLoading] = useState(true);
  const [threadError, setThreadError] = useState("");
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [conversation, setConversation] = useState({ client: null, mentors: [], messages: [] });
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_user') || 'null');
    } catch (error) {
      return null;
    }
  }, []);

  const loadThreads = useCallback(async () => {
    setThreadLoading(true);
    setThreadError("");
    try {
      const response = await api.get('/api/v1/admin/messages/threads');
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setThreads(data);
      if (data.length && !activeThreadId) {
        setActiveThreadId(data[0].id);
      }
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Unable to load conversations.';
      setThreadError(message);
    } finally {
      setThreadLoading(false);
    }
  }, [activeThreadId]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const markMessagesRead = useCallback(
    async (messages, threadId) => {
      if (!adminUser) return;
      const unread = messages.filter((message) => !message.read && message.sender_id !== adminUser.id);
      if (!unread.length) return;
      await Promise.allSettled(
        unread.map((message) => api.patch(`/api/v1/admin/messages/${message.id}/read`))
      );
      setThreads((current) =>
        current.map((thread) =>
          thread.id === threadId
            ? { ...thread, unread_count: 0 }
            : thread
        )
      );
    },
    [adminUser]
  );

  const loadConversation = useCallback(
    async (threadId) => {
      if (!threadId) return;
      setConversationLoading(true);
      setConversationError("");
      try {
        const response = await api.get(`/api/v1/admin/messages/threads/${threadId}`);
        const data = response.data?.data || {};
        const messages = Array.isArray(data.messages) ? data.messages : [];
        setConversation({
          client: data.client || null,
          mentors: data.mentors || [],
          messages,
        });
        await markMessagesRead(messages, threadId);
      } catch (err) {
        const message = err.response?.data?.error?.message || 'Unable to load conversation.';
        setConversationError(message);
      } finally {
        setConversationLoading(false);
      }
    },
    [markMessagesRead]
  );

  useEffect(() => {
    if (activeThreadId) {
      loadConversation(activeThreadId);
    }
  }, [activeThreadId, loadConversation]);

  const handleSelectThread = (threadId) => {
    setActiveThreadId(threadId);
    setConversationError("");
    setConversation({ client: null, mentors: [], messages: [] });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!activeThreadId || !messageBody.trim()) return;
    setSending(true);
    try {
      const response = await api.post('/api/v1/admin/messages', {
        client_id: activeThreadId,
        body: messageBody.trim(),
      });
      const saved = response.data?.data;
      if (saved) {
        setConversation((current) => ({
          ...current,
          messages: [...(current.messages || []), saved],
        }));
        setThreads((current) =>
          current.map((thread) =>
            thread.id === activeThreadId
              ? {
                  ...thread,
                  last_message: {
                    body: saved.body,
                    created_at: saved.created_at,
                    sender_name: saved.sender_name,
                    sender_role: saved.sender_role,
                  },
                  unread_count: 0,
                }
              : thread
          )
        );
      }
      setMessageBody("");
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Unable to send message.';
      setConversationError(message);
    } finally {
      setSending(false);
    }
  };

  const activeMessages = conversation.messages || [];

  return (
    <div className="grid min-h-[520px] gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg text-blueberry">Threads</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Client inbox</p>
          </div>
          <button
            type="button"
            onClick={loadThreads}
            className="rounded-full border border-babyBlue/40 px-3 py-1 text-[0.7rem] font-heading uppercase tracking-[0.3em] text-blueberry"
          >
            Refresh
          </button>
        </div>
        <div className="mt-4 space-y-2 overflow-y-auto">
          {threadLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : threadError ? (
            <p className="text-sm text-rose-600">{threadError}</p>
          ) : threads.length === 0 ? (
            <p className="text-sm text-slate-500">No conversations yet.</p>
          ) : (
            threads.map((thread) => (
              <button
                type="button"
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  thread.id === activeThreadId
                    ? 'border border-babyPink/40 bg-babyPink/20 text-blueberry'
                    : 'border border-transparent text-darkText/70 hover:bg-babyPink/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-heading text-blueberry">{thread.name}</p>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                      {thread.package || 'Package TBD'}
                    </p>
                    {thread.last_message && (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {thread.last_message.sender_name}: {thread.last_message.body}
                      </p>
                    )}
                  </div>
                  {thread.unread_count > 0 && (
                    <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-babyPink/70 px-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-white">
                      {thread.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex flex-col rounded-[2rem] border border-babyBlue/30 bg-white/95 shadow-soft">
        <header className="border-b border-babyBlue/30 px-6 py-4">
          <h2 className="font-heading text-lg text-blueberry">
            {conversation?.client?.name || 'Select a conversation'}
          </h2>
          {conversation?.mentors?.length > 0 && (
            <p className="text-xs text-slate-500">Mentors: {conversation.mentors.map((m) => m.name).join(', ')}</p>
          )}
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {conversationLoading ? (
            <p className="text-sm text-slate-500">Loading conversation…</p>
          ) : conversationError ? (
            <p className="text-sm text-rose-600">{conversationError}</p>
          ) : !activeThreadId ? (
            <p className="text-sm text-slate-500">Select a client to view messages.</p>
          ) : activeMessages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet. Start the conversation below.</p>
          ) : (
            activeMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-soft ${
                  adminUser && message.sender_id === adminUser.id
                    ? 'ml-auto bg-babyBlue/25 text-darkText'
                    : 'bg-babyPink/25 text-darkText'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-darkText/60">{message.sender_name}</p>
                <p className="mt-1 whitespace-pre-line">{message.body}</p>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-darkText/40">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
        <footer className="border-t border-babyBlue/30 px-6 py-4">
          <form className="flex flex-col gap-3" onSubmit={handleSendMessage}>
            <textarea
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              placeholder="Type an update for this family"
              rows={3}
              className="w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Messages are shared with the family and assigned mentors.</span>
              <button
                type="submit"
                disabled={!messageBody.trim() || sending || !activeThreadId}
                className={`rounded-full bg-babyPink px-5 py-2 font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
                  !messageBody.trim() || sending || !activeThreadId ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-dreamy'
                }`}
              >
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        </footer>
      </section>
    </div>
  );
};

/* ------------------ CALENDAR ------------------ */
const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get('/api/v1/admin/calendar');
        setEvents(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        const message = err.response?.data?.error?.message || 'Unable to load calendar events.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, [currentMonth]);

  const days = useMemo(() => {
    const startOfMonth = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 0));
    const startDay = new Date(startOfMonth);
    startDay.setUTCDate(startDay.getUTCDate() - startDay.getUTCDay());
    const endDay = new Date(endOfMonth);
    endDay.setUTCDate(endDay.getUTCDate() + (6 - endDay.getUTCDay()));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = [];
    for (let d = new Date(startDay); d <= endDay; d.setUTCDate(d.getUTCDate() + 1)) {
      const dateInstance = new Date(d);
      const isCurrentMonth = dateInstance.getUTCMonth() === currentMonth.getUTCMonth();
      const isToday = dateInstance.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
      result.push({ date: new Date(dateInstance), isCurrentMonth, isToday });
    }
    return result;
  }, [currentMonth]);

  const eventsByDay = useMemo(() => {
    return events.reduce((acc, event) => {
      const date = new Date(event.date);
      if (Number.isNaN(date.getTime())) return acc;
      const key = date.toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    }, {});
  }, [events]);

  const changeMonth = (offset) => {
    const next = new Date(currentMonth);
    next.setUTCMonth(next.getUTCMonth() + offset);
    setCurrentMonth(next);
  };

  const eventBadgeStyles = {
    client_due_date: 'bg-babyPink/30 text-blueberry',
    invite_request: 'bg-babyBlue/30 text-blueberry',
    invite_handled: 'bg-emerald-100 text-emerald-700',
    mentor_onboarded: 'bg-pastelPurple/30 text-pastelPurple-900',
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Operations</p>
          <h1 className="font-playful text-3xl text-blueberry">Concierge Calendar</h1>
          <p className="text-sm text-slate-500">Milestones, invites, and mentor onboarding at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="rounded-full border border-babyBlue/40 px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-blueberry"
          >
            Prev
          </button>
          <span className="text-sm font-heading uppercase tracking-[0.3em] text-slate-500">{monthLabel}</span>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="rounded-full border border-babyBlue/40 px-3 py-1 text-xs font-heading uppercase tracking-[0.3em] text-blueberry"
          >
            Next
          </button>
        </div>
      </header>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-lg">
        {loading ? (
          <p className="text-sm text-slate-500">Loading calendar…</p>
        ) : (
          <div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="px-2 pb-2 font-heading uppercase tracking-[0.3em] text-slate-400">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const key = day.date.toISOString().slice(0, 10);
              const dayEvents = eventsByDay[key] || [];
              return (
                <div
                  key={key}
                  className={`min-h-[100px] rounded-2xl border px-2 py-2 ${
                    day.isCurrentMonth ? 'border-babyBlue/20 bg-white' : 'border-transparent bg-white/60 text-slate-300'
                  } ${day.isToday ? 'ring-2 ring-babyPink/60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blueberry">{day.date.getUTCDate()}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={`block rounded-full px-2 py-1 text-[0.65rem] font-heading uppercase tracking-[0.25em] ${
                          eventBadgeStyles[event.type] || 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {event.title}
                      </span>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="block rounded-full bg-slate-100 px-2 py-1 text-[0.65rem] font-heading uppercase tracking-[0.25em] text-slate-500">
                        +{dayEvents.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Legend</h2>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-babyPink/60" /> Client due date
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-babyBlue/60" /> Invite request
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-400" /> Invite handled
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-pastelPurple/60" /> Mentor onboarded
          </span>
        </div>
      </section>
    </div>
  );
};

/* ------------------ REGISTRY MANAGER ------------------ */
const AdminRegistryManager = () => {
  const { items } = useRegistryStore();

  const summary = useMemo(() => {
    const counts = items.reduce(
      (acc, item) => {
        const status = item.status || "planning";
        acc.total += 1;
        acc.byStatus[status] = (acc.byStatus[status] || 0) + 1;
        if (item.link) acc.withLinks += 1;
        return acc;
      },
      { total: 0, byStatus: {}, withLinks: 0 },
    );

    const collect = (...keys) => keys.reduce((total, key) => total + (counts.byStatus[key] || 0), 0);

    return {
      total: counts.total,
      planning: collect("planning", "shortlist"),
      inFlight: collect("ordered", "shipped"),
      fulfilled: collect("delivered", "fulfilled"),
      withLinks: counts.withLinks,
    };
  }, [items]);

  const highlightCards = [
    { label: "Total items", value: summary.total },
    { label: "Active planning", value: summary.planning },
    { label: "Ordered / shipped", value: summary.inFlight },
    { label: "Fulfilled", value: summary.fulfilled },
    { label: "With outside links", value: summary.withLinks },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-6 shadow-soft">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-heading uppercase tracking-[0.35em] text-slate-400">Concierge Snapshot</span>
            <h1 className="font-playful text-3xl text-blueberry">Registry Overview</h1>
            <p className="text-sm text-slate-500">
              Monitor the shared registry workspace. Updates reflect instantly across client, mentor, and admin portals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center justify-center rounded-full border border-babyPink/40 bg-babyPink/10 px-4 py-2 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:bg-babyPink/20"
          >
            Add new item
          </button>
        </header>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {highlightCards.map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-5 py-4 text-sm text-blueberry"
            >
              <p className="text-xs font-heading uppercase tracking-[0.3em] text-blueberry/60">{card.label}</p>
              <p className="mt-2 text-2xl font-heading">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <RegistryBoard role="admin" />
    </div>
  );
};

/* ------------------ SERVICES & CONTENT ------------------ */
const INITIAL_SERVICES = [
  {
    id: "signature",
    name: "Signature Concierge",
    category: "Packages",
    price: "$495/mo",
    summary: "End-to-end nursery, registry, and milestone planning with weekly mentor touchpoints.",
    status: "published",
  },
  {
    id: "essentials",
    name: "Essentials Planning",
    category: "Packages",
    price: "$249/mo",
    summary: "Foundational registry strategy, vendor vetting, and two concierge check-ins each month.",
    status: "draft",
  },
  {
    id: "masterclasses",
    name: "Masterclass Library",
    category: "Content",
    price: "Included",
    summary: "Self-paced video curriculum covering nursery styling, hospitality prep, and postpartum transitions.",
    status: "published",
  },
];

const RESOURCE_LIBRARY = [
  {
    id: "nursery-lookbook",
    title: "Nursery Palette Lookbook",
    type: "PDF",
    updatedAt: "2024-07-14",
    link: "#",
  },
  {
    id: "registry-checklist",
    title: "Concierge Registry Checklist",
    type: "Google Sheet",
    updatedAt: "2024-08-02",
    link: "#",
  },
  {
    id: "hospital-bag",
    title: "Hospital Bag Guide",
    type: "Notion Page",
    updatedAt: "2024-09-10",
    link: "#",
  },
];

const ServicesContent = () => {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [form, setForm] = useState({ name: "", category: "", price: "", summary: "" });
  const [message, setMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setMessage("");
  };

  const handleAddService = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.summary.trim()) {
      setMessage("Add a name and summary before saving.");
      return;
    }

    const newService = {
      id: `${Date.now()}`,
      name: form.name.trim(),
      category: form.category.trim() || "Packages",
      price: form.price.trim() || "Custom",
      summary: form.summary.trim(),
      status: "draft",
    };
    setServices((current) => [newService, ...current]);
    setForm({ name: "", category: "", price: "", summary: "" });
    setMessage("Draft service created. Publish when you're ready to share it with clients.");
  };

  const toggleStatus = (id) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? {
              ...service,
              status: service.status === "published" ? "draft" : "published",
            }
          : service
      )
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Offerings</p>
          <h1 className="font-playful text-3xl text-blueberry">Services & Content</h1>
          <p className="text-sm text-slate-500">Curate packages, digital resources, and concierge experiences.</p>
        </div>
      </header>

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Create a new service</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Drafts are private until published</p>
        <form onSubmit={handleAddService} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Name
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Concierge VIP Day"
              required
            />
          </label>
          <label className="text-sm">
            Category
            <input
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Packages, Content, Event"
            />
          </label>
          <label className="text-sm">
            Price / Access
            <input
              type="text"
              value={form.price}
              onChange={handleChange("price")}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="$499, Included, Custom"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Description
            <textarea
              value={form.summary}
              onChange={handleChange("summary")}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Outline what makes this experience special."
              required
            />
          </label>
          <div className="md:col-span-2 flex items-center justify-between">
            {message && <p className="text-xs font-heading uppercase tracking-[0.3em] text-slate-400">{message}</p>}
            <button
              type="submit"
              className="rounded-full bg-babyPink px-5 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              Save Draft
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg text-blueberry">Live & Draft Services</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-[2rem] border border-babyBlue/25 bg-white/95 p-6 shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-heading text-xl text-blueberry">{service.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{service.category}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] ${
                    service.status === 'published'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{service.summary}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{service.price}</span>
                <button
                  type="button"
                  onClick={() => toggleStatus(service.id)}
                  className="rounded-full border border-babyBlue/40 px-4 py-2 font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
                >
                  {service.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Resource Library</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Quick links for the concierge team</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {RESOURCE_LIBRARY.map((resource) => (
            <a
              key={resource.id}
              href={resource.link}
              className="rounded-3xl border border-babyBlue/20 bg-babyBlue/10 p-4 text-sm text-blueberry shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              <p className="font-heading">{resource.title}</p>
              <p className="mt-2 text-xs text-slate-500">{resource.type}</p>
              <p className="mt-1 text-xs text-slate-400">Updated {resource.updatedAt}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ------------------ REPORTS ------------------ */
const ReportsOverview = () => {
  const { stats, engagement, recentInvites, loading, error, reload } = useAdminMetrics();

  const totals = useMemo(() => {
    return engagement.reduce(
      (acc, row) => ({
        invites: acc.invites + (row.invites || 0),
        clients: acc.clients + (row.new_clients || 0),
        messages: acc.messages + (row.messages || 0),
      }),
      { invites: 0, clients: 0, messages: 0 }
    );
  }, [engagement]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Insights</p>
          <h1 className="font-playful text-3xl text-blueberry">Reports & Analytics</h1>
          <p className="text-sm text-slate-500">Compare invite flow, onboarding, and mentor engagement.</p>
        </div>
        <button
          type="button"
          onClick={reload}
          className="rounded-full border border-babyBlue/50 bg-white/80 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft transition hover:-translate-y-0.5"
        >
          Refresh
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total Invites (6 mo)</p>
          <p className="mt-2 text-3xl font-heading text-blueberry">{totals.invites}</p>
        </article>
        <article className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">New Clients (6 mo)</p>
          <p className="mt-2 text-3xl font-heading text-blueberry">{totals.clients}</p>
        </article>
        <article className="rounded-[2rem] border border-babyBlue/20 bg-white/95 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Messages Logged</p>
          <p className="mt-2 text-3xl font-heading text-blueberry">{totals.messages}</p>
        </article>
        <article className="rounded-[2rem] border border-babyPink/20 bg-white/95 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active Concierge Team</p>
          <p className="mt-2 text-3xl font-heading text-blueberry">{stats?.active_mentors ?? '--'}</p>
        </article>
      </section>

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Monthly Trend</h2>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Invite requests vs onboarding vs messaging</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer>
            <LineChart data={engagementSeries(engagement)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" stroke="#94A3B8" />
              <YAxis allowDecimals={false} stroke="#94A3B8" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="invites" name="Invites" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="new_clients" name="New Clients" stroke="#F472B6" strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="messages" name="Messages" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {engagement.length === 0 && !loading && (
          <p className="mt-4 text-xs font-heading uppercase tracking-[0.3em] text-slate-400">
            No activity yet for this reporting period.
          </p>
        )}
      </section>

      <section className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Recent Invite Activity</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Compiling invite data…</p>
        ) : recentInvites.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No invites issued yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-babyBlue/20 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <th className="py-3">Code</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Assigned</th>
                  <th className="py-3">Created</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvites.map((invite) => (
                  <tr key={invite.code} className="border-b border-babyBlue/10">
                    <td className="py-3 font-heading text-blueberry">{invite.code}</td>
                    <td className="py-3 capitalize">{invite.role}</td>
                    <td className="py-3">{invite.assigned_name || 'Unassigned'}</td>
                    <td className="py-3">{invite.created_at ? new Date(invite.created_at).toLocaleDateString() : '--'}</td>
                    <td className="py-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {invite.used_at ? 'Used' : 'Open'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

/* ------------------ SETTINGS ------------------ */
const AdminSettings = () => {
  const [brand, setBrand] = useState({
    studioName: "Taylor-Made Baby Co.",
    supportEmail: "support@taylormadebaby.co",
    primaryColor: "#5b6ee1",
    timezone: "America/Phoenix",
  });
  const [preferences, setPreferences] = useState({
    digest: true,
    inviteAutoEmail: true,
    mentorAlerts: false,
    requireTwoFactor: false,
  });
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [message, setMessage] = useState("");

  const handleBrandChange = (field) => (event) => {
    setBrand((current) => ({ ...current, [field]: event.target.value }));
    setMessage("");
  };

  const handlePreferenceChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setPreferences((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const simulateSave = (type) => {
    if (type === 'brand') {
      setSavingBrand(true);
    } else {
      setSavingPrefs(true);
    }

    setTimeout(() => {
      if (type === 'brand') {
        setSavingBrand(false);
      } else {
        setSavingPrefs(false);
      }
      setMessage('Settings saved. Changes will apply to new portal sessions.');
    }, 600);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Configuration</p>
          <h1 className="font-playful text-3xl text-blueberry">Admin Settings</h1>
          <p className="text-sm text-slate-500">Update brand details, communication preferences, and security policies.</p>
        </div>
      </header>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
      )}

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Brand Identity</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            simulateSave('brand');
          }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <label className="text-sm">
            Studio name
            <input
              type="text"
              value={brand.studioName}
              onChange={handleBrandChange('studioName')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
            />
          </label>
          <label className="text-sm">
            Support email
            <input
              type="email"
              value={brand.supportEmail}
              onChange={handleBrandChange('supportEmail')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
            />
          </label>
          <label className="text-sm">
            Primary color
            <input
              type="color"
              value={brand.primaryColor}
              onChange={handleBrandChange('primaryColor')}
              className="mt-2 h-12 w-32 cursor-pointer rounded-2xl border border-babyBlue/30 bg-white"
            />
          </label>
          <label className="text-sm">
            Default timezone
            <select
              value={brand.timezone}
              onChange={handleBrandChange('timezone')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
            >
              <option value="America/Phoenix">America/Phoenix</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Chicago">America/Chicago</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
            </select>
          </label>
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={savingBrand}
              className={`rounded-full bg-babyPink px-5 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
                savingBrand ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-dreamy'
              }`}
            >
              {savingBrand ? 'Saving…' : 'Save Brand Settings'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Communication & Security</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            simulateSave('preferences');
          }}
          className="mt-6 space-y-4"
        >
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={preferences.digest}
              onChange={handlePreferenceChange('digest')}
              className="h-4 w-4"
            />
            Send a weekly concierge digest to the admin team.
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={preferences.inviteAutoEmail}
              onChange={handlePreferenceChange('inviteAutoEmail')}
              className="h-4 w-4"
            />
            Auto-email approved invite codes to requesters.
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={preferences.mentorAlerts}
              onChange={handlePreferenceChange('mentorAlerts')}
              className="h-4 w-4"
            />
            Notify mentors when they are assigned a new family.
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={preferences.requireTwoFactor}
              onChange={handlePreferenceChange('requireTwoFactor')}
              className="h-4 w-4"
            />
            Require two-factor authentication for all admin logins.
          </label>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={savingPrefs}
              className={`rounded-full bg-babyBlue px-5 py-3 text-xs font-heading uppercase tracking-[0.3em] text-white shadow-pop transition ${
                savingPrefs ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-dreamy'
              }`}
            >
              {savingPrefs ? 'Saving…' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

/* ------------------ PROFILE DRAWER ------------------ */
const ProfileDrawer = ({ open, onClose, title, loading, error, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <aside className="relative h-full w-full max-w-md overflow-y-auto border-l border-babyBlue/20 bg-white px-6 py-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Profile Overview</p>
            <h2 className="font-playful text-2xl text-blueberry">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 transition hover:border-blueberry hover:text-blueberry"
          >
            Close
          </button>
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-slate-500">Loading details…</p>}
          {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
          {!loading && !error && children}
        </div>
      </aside>
    </div>
  );
};

/* ------------------ BLOG MANAGER ------------------ */
const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const defaultBlogForm = {
  id: null,
  title: "",
  slug: "",
  category: "Announcements",
  visibility: "public",
  excerpt: "",
  content: "",
};

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(defaultBlogForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get('/api/v1/admin/blog/posts', { params: { visibility: 'all' } });
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setPosts(data);
    } catch (err) {
      const messageText = err.response?.data?.error?.message || 'Unable to load posts.';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => {
      if (field === 'title') {
        const nextSlug = current.id || current.slug ? current.slug : slugify(value);
        return { ...current, title: value, slug: nextSlug };
      }
      if (field === 'slug') {
        return { ...current, slug: slugify(value) };
      }
      return { ...current, [field]: value };
    });
    setMessage("");
  };

  const resetForm = () => {
    setForm(defaultBlogForm);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.category.trim() || !form.content.trim()) {
      setMessage('Please complete all fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        content: form.content.trim(),
        visibility: form.visibility,
      };

      if (form.slug.trim()) {
        payload.slug = form.slug.trim();
      }

      if (form.excerpt.trim()) {
        payload.excerpt = form.excerpt.trim();
      }

      if (form.id) {
        await api.put(`/api/v1/admin/blog/posts/${form.id}`, payload);
        setMessage('Post updated.');
      } else {
        await api.post('/api/v1/admin/blog/posts', payload);
        setMessage('Post published.');
      }
      resetForm();
      loadPosts();
    } catch (err) {
      const messageText = err.response?.data?.error?.message || 'We could not save this post yet.';
      setMessage(messageText);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setForm({
      id: post.id,
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Announcements',
      visibility: post.visibility || 'public',
      excerpt: post.excerpt || '',
      content: post.content || '',
    });
    setMessage('Editing draft. Save to update the post.');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/api/v1/admin/blog/posts/${id}`);
      setMessage('Post deleted.');
      if (form.id === id) {
        resetForm();
      }
      loadPosts();
    } catch (err) {
      const messageText = err.response?.data?.error?.message || 'Unable to delete this post.';
      setMessage(messageText);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Content Studio</p>
          <h1 className="font-playful text-3xl text-blueberry">Blog Manager</h1>
          <p className="text-sm text-slate-500">Draft, publish, and update private lounge posts.</p>
        </div>
      </header>

      {message && (
        <div className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3 text-sm text-blueberry">{message}</div>
      )}

      <section className="rounded-[2rem] border border-babyBlue/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">{form.id ? 'Edit Post' : 'Create Post'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="text-sm">
            Title
            <input
              type="text"
              value={form.title}
              onChange={handleInputChange('title')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Welcome to the concierge lounge"
              required
            />
          </label>
          <label className="text-sm">
            Slug
            <input
              type="text"
              value={form.slug}
              onChange={handleInputChange('slug')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="stroller-styles-demystified"
            />
          </label>
          <label className="text-sm">
            Category
            <input
              type="text"
              value={form.category}
              onChange={handleInputChange('category')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Announcements, Mentor Notes, Events"
              required
            />
          </label>
          <label className="text-sm">
            Visibility
            <select
              value={form.visibility}
              onChange={handleInputChange('visibility')}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
            </select>
          </label>
          <label className="text-sm">
            Excerpt
            <textarea
              value={form.excerpt}
              onChange={handleInputChange('excerpt')}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Optional summary shown on the public blog."
            />
          </label>
          <label className="text-sm">
            Content
            <textarea
              value={form.content}
              onChange={handleInputChange('content')}
              rows={6}
              className="mt-2 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
              placeholder="Write your post here..."
              required
            />
          </label>
          <div className="flex items-center justify-end gap-2">
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-slate-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className={`rounded-full bg-babyPink px-5 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
                saving ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-dreamy'
              }`}
            >
              {saving ? 'Saving…' : form.id ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-babyPink/30 bg-white/95 p-6 shadow-lg">
        <h2 className="font-heading text-lg text-blueberry">Recent Posts</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading posts…</p>
        ) : error ? (
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        ) : posts.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No posts yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {posts.map((post) => (
              <article key={post.id} className="rounded-3xl border border-babyBlue/20 bg-white px-5 py-4 shadow-soft">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-heading text-lg text-blueberry">{post.title}</h3>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{post.category}</p>
                    <p className="text-xs text-slate-500">Slug: {post.slug}</p>
                    <p className="text-xs text-slate-500">Visibility: {post.visibility === 'members_only' ? 'Members Only' : 'Public'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>
                      Updated {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : post.updated_at ? new Date(post.updated_at).toLocaleDateString() : '--'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEdit(post)}
                      className="rounded-full border border-babyBlue/30 px-3 py-1 font-heading uppercase tracking-[0.3em] text-blueberry"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="rounded-full border border-rose-200 px-3 py-1 font-heading uppercase tracking-[0.3em] text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{post.excerpt || post.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* ------------------ ROOT ------------------ */
const AdminPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/admin") ? "/admin" : "/admin-portal";
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
      <Sidebar items={NAV_ITEMS} basePath={basePath} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Topbar adminName={adminName} onToggleSidebar={() => setSidebarOpen((v) => !v)} onSignOut={handleSignOut} />
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard basePath={basePath} />} />
              <Route
                path="invites"
                element={
                  <InviteManagement
                    onApproved={(request) => {
                      const destination = request?.requested_role === 'mentor' ? 'mentors' : 'clients';
                      navigate(`${basePath}/${destination}`);
                    }}
                  />
                }
              />
              <Route path="clients" element={<ClientDirectory />} />
              <Route path="mentors" element={<MentorDirectory />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="registry" element={<AdminRegistryManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="services" element={<ServicesContent />} />
              <Route path="reports" element={<ReportsOverview />} />
              <Route path="settings" element={<AdminSettings />} />
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
