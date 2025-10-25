import React, { useEffect, useMemo, useState, useCallback } from "react";
import { NavLink, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import api from "../lib/api";
import RegistryBoard from "../components/registry/RegistryBoard";
import { MentorDashboard, AvailabilityManager } from "../features/mentors";

const notifications = [
  { id: 1, mentee: "Avery P.", detail: "New registry update submitted", time: "5m ago" },
  { id: 2, mentee: "Jordan S.", detail: "Requested nursery layout review", time: "20m ago" },
  { id: 3, mentee: "The Harper Family", detail: "Sent celebration RSVP list", time: "1h ago" },
];

const schedule = [
  { id: 1, label: "Registry refinement call", mentee: "Avery P.", time: "9:30 AM" },
  { id: 2, label: "Nursery walk-through", mentee: "Morgan & Devin", time: "1:00 PM" },
  { id: 3, label: "Mentor circle sync", mentee: "Internal", time: "4:30 PM" },
];

const openTasks = [
  "Confirm travel gear list for the Martinez family",
  "Upload Sip & See inspiration deck",
  "Prep in-law communication template for Harper family",
];

const mentorResources = [
  { id: 1, title: "Fourth Trimester Schedules", category: "Checklist" },
  { id: 2, title: "In-Law Boundaries Playbook", category: "Guide" },
  { id: 3, title: "Nursery Reveal Timeline", category: "Timeline" },
  { id: 4, title: "VIP Registry Vendor List", category: "Directory" },
];

const mentorMentees = [
  { id: 1, name: "Avery Parker", channel: "SMS" },
  { id: 2, name: "Jordan Smith", channel: "Email" },
  { id: 3, name: "Harper Family", channel: "Signal" },
];

const notesSeed = [
  { id: 1, mentee: "Avery Parker", body: "Focus on travel-ready nursery essentials. Follow up with stroller base availability.", timestamp: "Today, 9:10 AM" },
  { id: 2, mentee: "Harper Family", body: "Event timeline approved. Need final vendor confirmations by Friday.", timestamp: "Yesterday, 6:20 PM" },
];

const mentorTemplates = [
  {
    id: "baby-shower-conflict",
    label: "Handling Baby Shower Conflicts",
    message:
      "Hi [Name], thank you so much for wanting to help. Let’s align on tasks that keep the celebration relaxed for everyone. I’ll send a shared checklist so you have full visibility."
  },
  {
    id: "boundary-setting",
    label: "Boundary Setting Warm-Up",
    message:
      "Hi [Name], I’d love to share how we’re building a calm, cozy homecoming. We’ll have sweet moments together, and we’ll also carve out quiet time for the new family to settle in."
  },
  {
    id: "visitation",
    label: "Visitation Scheduling",
    message:
      "Hi [Name], everyone is excited! To make the visit smooth, here’s a draft schedule with rest windows for both parents and baby. Let me know if any adjustments would feel better."
  },
];

const registryChecklist = [
  "Travel system stroller",
  "Convertible car seat",
  "Smart baby monitor",
  "Nursery glider",
  "Feeding essentials",
  "Hospital bag prep",
];

const recommendationList = [
  {
    id: 1,
    title: "Nuna TRVL Compact Stroller",
    description: "Feather-light and folds with one hand—perfect for concierge-level travel plans.",
    image:
      "https://images.unsplash.com/photo-1522199998318-76cbbfbe0b56?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 2,
    title: "Pipette Baby Essentials Set",
    description: "Ultra-clean, calming skincare set curated for first-month routines.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 3,
    title: "Maison Deux Cloud Rug",
    description: "Hand-tufted pastel cloud rug that layers luxury into nursery mood boards.",
    image:
      "https://images.unsplash.com/photo-1616628182506-4b2b5f0b6645?auto=format&fit=crop&w=600&q=60",
  },
];

const diaryMoodBoard = [
  { id: 1, label: "Dreamy Lighting" },
  { id: 2, label: "Cozy Textures" },
  { id: 3, label: "Pastel Palette" },
  { id: 4, label: "Storage Solutions" },
  { id: 5, label: "Sensory Corner" },
  { id: 6, label: "Baby Closet" },
];

const MentorPortalDashboard = ({ profile }) => (
  <div className="space-y-6">
    <header className="space-y-2">
      <p className="text-sm uppercase tracking-[0.35em] text-mauve">Mentor Dashboard</p>
      <h1 className="font-playful text-3xl text-charcoal">
        Hi {profile?.name || "Mentor"}, here’s what’s new today 💕
      </h1>
      <p className="font-body text-sm text-charcoal/70">
        Stay playful, polished, and ready for every concierge detail.
      </p>
    </header>

    <div className="grid gap-6 lg:grid-cols-3">
      <article className="rounded-3xl bg-white shadow-soft border border-blush/30 p-6">
        <h2 className="font-heading text-lg text-charcoal flex items-center gap-2">🔔 Notifications</h2>
        <ul className="mt-4 space-y-3 font-body text-sm text-charcoal/80">
          {notifications.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl bg-blush/20 px-4 py-3 border border-blush/40"
            >
              <p className="font-semibold text-charcoal">{item.mentee}</p>
              <p>{item.detail}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60 mt-1">{item.time}</p>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl bg-white shadow-soft border border-mauve/30 p-6">
        <h2 className="font-heading text-lg text-charcoal flex items-center gap-2">📅 Today’s Schedule</h2>
        <ul className="mt-4 space-y-3 font-body text-sm text-charcoal/80">
          {schedule.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-mauve/20 px-4 py-3 border border-mauve/40"
            >
              <div>
                <p className="font-semibold text-charcoal">{item.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">{item.mentee}</p>
              </div>
              <span className="font-heading text-sm text-charcoal">{item.time}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl bg-white shadow-soft border border-mauve/40 p-6">
        <h2 className="font-heading text-lg text-charcoal flex items-center gap-2">🧾 Open Tasks</h2>
        <ul className="mt-4 space-y-3 font-body text-sm text-charcoal/80">
          {openTasks.map((task, index) => (
            <li
              key={task}
              className="flex items-start gap-3 rounded-2xl bg-mauve/20 px-4 py-3 border border-mauve/40"
            >
              <span className="font-heading text-charcoal">{`0${index + 1}`}</span>
              <p>{task}</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  </div>
);

const RegistrySupport = () => {
  const [query, setQuery] = useState("");
  const filteredMentees = mentorMentees.filter((mentee) => mentee.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-playful text-3xl text-charcoal">Registry Support 🛍️</h1>
        <p className="font-body text-sm text-charcoal/70">
          Search or select a mentee registry to fine-tune their essentials.
        </p>
      </header>

      <div className="rounded-3xl bg-white border border-mauve/30 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Search registry</label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type a mentee name or registry keyword"
              className="mt-2 w-full rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm font-body text-charcoal focus:border-mauve focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Import Amazon Registry
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filteredMentees.map((mentee) => (
            <div key={mentee.id} className="rounded-2xl border border-mauve/30 bg-mauve/10 px-4 py-3">
              <p className="font-heading text-charcoal">{mentee.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">Preferred channel: {mentee.channel}</p>
            </div>
          ))}
          {!filteredMentees.length && (
            <p className="rounded-2xl bg-ivory px-4 py-3 text-sm font-body text-charcoal/70">
              No mentee matches yet. Start typing to search.
            </p>
          )}
        </div>
      </div>

      <section className="rounded-3xl border border-blush/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-charcoal">Checklist Template</h2>
        <ul className="mt-3 space-y-3 text-sm font-body text-charcoal/80">
          {registryChecklist.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blush/40 text-charcoal font-heading text-xs">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <RegistryBoard role="mentor" />
    </div>
  );
};

const PersonalShopping = () => (
  <div className="space-y-6">
    <header className="space-y-2">
      <h1 className="font-playful text-3xl text-charcoal">Personal Shopping ✨</h1>
      <p className="font-body text-sm text-charcoal/70">
        Curate joyful essentials and send tailored suggestions instantly.
      </p>
    </header>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {recommendationList.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-3xl border border-blush/30 bg-white shadow-soft">
          <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
          <div className="space-y-3 p-5">
            <h2 className="font-heading text-lg text-charcoal">{item.title}</h2>
            <p className="font-body text-sm text-charcoal/75">{item.description}</p>
            <button
              type="button"
              className="rounded-full bg-mauve/80 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
            >
              Suggest to Mentee
            </button>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const NurseryDesign = () => (
  <div className="space-y-6">
    <header className="space-y-2">
      <h1 className="font-playful text-3xl text-charcoal">Nursery Design 🍼</h1>
      <p className="font-body text-sm text-charcoal/70">
        Float inspiration, build mood boards, and export a polished shopping list.
      </p>
    </header>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-blush/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-charcoal">Upload Inspiration</h2>
        <p className="mt-2 text-sm font-body text-charcoal/70">
          Drop aesthetic screenshots, IG finds, or PDF lookbooks.
        </p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blush/40 bg-blush/20 px-6 py-10 text-center text-sm font-body text-charcoal hover:border-blush/60">
          <span>Drag & drop files or click to upload</span>
          <input type="file" multiple className="hidden" />
        </label>
      </section>
      <section className="rounded-3xl border border-mauve/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-charcoal">Shopping List</h2>
        <p className="mt-2 text-sm font-body text-charcoal/70">
          Curate must-haves and export for concierge approvals.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
        >
          Export Shopping List
        </button>
      </section>
    </div>
    <section className="rounded-3xl border border-mauve/40 bg-white p-6 shadow-soft">
      <h2 className="font-heading text-lg text-charcoal">Mood Board</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {diaryMoodBoard.map((item) => (
          <div
            key={item.id}
            className="flex h-32 flex-col justify-center rounded-2xl bg-mauve/30 text-center font-heading text-charcoal shadow-soft"
          >
            {item.label}
          </div>
        ))}
      </div>
    </section>
  </div>
);

const InLawInterface = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(mentorTemplates[0]);
  const [preview, setPreview] = useState(mentorTemplates[0].message);

  useEffect(() => {
    setPreview(selectedTemplate.message);
  }, [selectedTemplate]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-playful text-3xl text-charcoal">In-Law Interface 🤍</h1>
        <p className="font-body text-sm text-charcoal/70">
          Warmly set boundaries and expectations for family with curated templates.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-3 rounded-3xl border border-mauve/30 bg-white p-6 shadow-soft">
          <h2 className="font-heading text-lg text-charcoal">Templates</h2>
          <p className="text-xs font-body text-charcoal/60">Select a tone that suits the moment.</p>
          <ul className="mt-4 space-y-2">
            {mentorTemplates.map((template) => (
              <li key={template.id}>
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(template)}
                  className={`w-full rounded-2xl px-4 py-3 text-left font-body text-sm transition ${
                    template.id === selectedTemplate.id
                      ? "bg-mauve/20 text-charcoal border border-mauve/40"
                      : "border border-mauve/20 text-charcoal/70 hover:bg-mauve/10"
                  }`}
                >
                  {template.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="rounded-3xl border border-blush/30 bg-white p-6 shadow-soft">
          <h2 className="font-heading text-lg text-charcoal">Message Preview</h2>
          <textarea
            value={preview}
            onChange={(event) => setPreview(event.target.value)}
            className="mt-4 h-48 w-full rounded-2xl border border-blush/30 bg-blush/10 p-4 font-body text-sm text-charcoal focus:border-blush focus:outline-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
            >
              Send to Mentee for Review
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const EventsCelebrations = () => (
  <div className="space-y-6">
    <header className="space-y-2">
      <h1 className="font-playful text-3xl text-charcoal">Events & Celebrations 🎉</h1>
      <p className="font-body text-sm text-charcoal/70">
        Keep every celebration polished—from baby showers to sip & sees.
      </p>
    </header>
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <section className="rounded-3xl border border-blush/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-charcoal">Planning Checklist</h2>
        <ul className="mt-4 space-y-3 font-body text-sm text-charcoal/80">
          {["Confirm guest list", "Send bespoke invitations", "Align vendor mood board", "Schedule concierge arrivals", "Prep thank-you strategy"].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 rounded-full bg-blush" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-mauve/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-charcoal">Calendar Integration</h2>
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-mauve/30 bg-mauve/10 px-6 py-12 text-center font-body text-sm text-charcoal/70">
          <p>Connect Google Calendar or Calendly to auto-sync celebrations, mentor sessions, and glam arrivals.</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Connect Calendar
          </button>
        </div>
      </section>
    </div>
  </div>
);

const Messages = () => {
  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);
  const mentorUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("tm_user") || "null");
    } catch (parseError) {
      return null;
    }
  }, []);

  const fetchMessages = useCallback(
    async (clientId) => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get('/api/v1/mentor/messages', {
          params: clientId ? { clientId } : {},
        });
        const data = response.data?.data || {};
        const fetchedClients = Array.isArray(data.clients) ? data.clients : [];
        setClients(fetchedClients);
        const activeId = data.active_client_id || fetchedClients[0]?.id || null;
        setActiveClientId(activeId);
        const fetchedMessages = Array.isArray(data.messages) ? data.messages : [];
        setMessages(fetchedMessages);
        if (activeId) {
          const unread = fetchedMessages.filter(
            (message) => !message.read && mentorUser && message.sender_id !== mentorUser.id
          );
          await Promise.allSettled(
            unread.map((message) => api.patch(`/api/v1/mentor/messages/${message.id}/read`))
          );
        }
      } catch (err) {
        const message = err.response?.data?.error?.message || 'Unable to load messages.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [mentorUser]
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectClient = (clientId) => {
    if (clientId === activeClientId) return;
    fetchMessages(clientId);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!activeClientId || !messageBody.trim()) return;
    setSending(true);
    try {
      const response = await api.post('/api/v1/mentor/messages', {
        client_id: activeClientId,
        body: messageBody.trim(),
      });
      const saved = response.data?.data;
      if (saved) {
        setMessages((current) => [...current, saved]);
      }
      setMessageBody("");
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Unable to send message.';
      setError(message);
    } finally {
      setSending(false);
    }
  };

  const currentClient = clients.find((client) => client.id === activeClientId) || null;

  return (
    <div className="grid min-h-[520px] gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-3xl border border-blush/30 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-lg text-charcoal">Families</h2>
        <div className="mt-4 space-y-2">
          {loading && clients.length === 0 ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-slate-500">No assigned families yet.</p>
          ) : (
            clients.map((client) => (
              <button
                type="button"
                key={client.id}
                onClick={() => handleSelectClient(client.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  client.id === activeClientId
                    ? 'border border-blush/40 bg-blush/20 text-charcoal'
                    : 'border border-transparent text-charcoal/70 hover:bg-blush/10'
                }`}
              >
                <span className="font-heading text-charcoal">{client.name}</span>
                <span className="block text-[0.65rem] uppercase tracking-[0.3em] text-charcoal/50">
                  {client.package_choice || 'Package TBD'}
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex flex-col rounded-3xl border border-mauve/30 bg-white shadow-soft">
        <header className="border-b border-mauve/30 px-6 py-4">
          <h2 className="font-heading text-lg text-charcoal">
            {currentClient ? `Chat with ${currentClient.name}` : 'Select a family'}
          </h2>
          <p className="text-xs font-body text-charcoal/60">All communication remains under NDA.</p>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading conversation…</p>
          ) : error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : !currentClient ? (
            <p className="text-sm text-slate-500">Select a family to view messages.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet. Start the conversation below.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-lg rounded-2xl px-4 py-3 text-sm shadow-soft ${
                  mentorUser && message.sender_id === mentorUser.id
                    ? 'ml-auto bg-mauve/25 text-charcoal'
                    : 'bg-blush/25 text-charcoal'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal/60">{message.sender_name}</p>
                <p className="mt-1 whitespace-pre-line">{message.body}</p>
                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-charcoal/40">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
        <footer className="border-t border-mauve/30 px-6 py-4">
          <form className="flex gap-3" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={messageBody}
              onChange={(event) => {
                setMessageBody(event.target.value);
                setError("");
              }}
              placeholder={currentClient ? `Send a note to ${currentClient.name}` : 'Select a family to begin'}
              className="flex-1 rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm font-body text-charcoal focus:border-blush focus:outline-none"
              disabled={!currentClient}
            />
            <button
              type="submit"
              disabled={!currentClient || !messageBody.trim() || sending}
              className={`rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft ${
                !currentClient || !messageBody.trim() || sending ? 'opacity-60' : 'hover:-translate-y-0.5'
              }`}
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
          <p className="mt-2 text-center text-[0.65rem] uppercase tracking-[0.3em] text-charcoal/50">
            All communication remains under NDA 🤍
          </p>
        </footer>
      </section>
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState(notesSeed);
  const [form, setForm] = useState({ mentee: "", body: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.mentee || !form.body) return;
    setNotes((current) => [
      {
        id: Date.now(),
        mentee: form.mentee,
        body: form.body,
        timestamp: new Date().toLocaleString(),
      },
      ...current,
    ]);
    setForm({ mentee: "", body: "" });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-playful text-3xl text-charcoal">Session Notes ✍️</h1>
        <p className="font-body text-sm text-charcoal/70">
          Capture private mentor notes and revisit them any time.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-blush/30 bg-white p-6 shadow-soft">
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Mentee</label>
          <input
            value={form.mentee}
            onChange={(event) => setForm((current) => ({ ...current, mentee: event.target.value }))}
            placeholder="Who was this session with?"
            className="mt-2 w-full rounded-2xl border border-blush/40 bg-white px-4 py-3 text-sm font-body text-charcoal focus:border-blush focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Notes</label>
          <textarea
            value={form.body}
            onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
            placeholder="Key takeaways, concierge promises, next steps"
            className="mt-2 h-32 w-full rounded-2xl border border-blush/40 bg-white px-4 py-3 text-sm font-body text-charcoal focus:border-blush focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
        >
          Save Note
        </button>
      </form>
      <section className="space-y-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-3xl border border-mauve/30 bg-white p-6 shadow-soft">
            <p className="font-heading text-charcoal">{note.mentee}</p>
            <p className="mt-2 font-body text-sm text-charcoal/80">{note.body}</p>
            <p className="mt-3 text-xs font-body uppercase tracking-[0.3em] text-charcoal/50">{note.timestamp}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

const ResourceLibrary = () => {
  const [query, setQuery] = useState("");
  const filtered = mentorResources.filter((resource) =>
    resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-playful text-3xl text-charcoal">Resource Library 📚</h1>
        <p className="font-body text-sm text-charcoal/70">
          Quick access to checklists, blogs, and VIP concierge templates.
        </p>
      </header>
      <div className="rounded-3xl border border-mauve/30 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-charcoal/60">Filter resources</label>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles or categories"
              className="mt-2 w-full rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm font-body text-charcoal focus:border-blush focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Upload New Resource
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((resource) => (
          <article key={resource.id} className="flex items-center justify-between rounded-3xl border border-blush/30 bg-white px-6 py-4 shadow-soft">
            <div>
              <p className="font-heading text-charcoal">{resource.title}</p>
              <p className="text-xs font-body uppercase tracking-[0.3em] text-charcoal/60">{resource.category}</p>
            </div>
            <button
              type="button"
              className="rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
            >
              Download
            </button>
          </article>
        ))}
        {!filtered.length && (
          <p className="rounded-3xl bg-ivory px-6 py-4 text-sm font-body text-charcoal/70">
            No resources match that search just yet.
          </p>
        )}
      </div>
    </div>
  );
};

const MentorPortalLayout = ({
  profile,
  onSignOut,
  isOnline,
  setIsOnline,
  isDropdownOpen,
  setIsDropdownOpen,
  basePath,
}) => {
  const links = useMemo(
    () => [
      { to: basePath, label: "Dashboard", end: true },
      { to: `${basePath}/snapshot`, label: "Concierge Snapshot" },
      { to: `${basePath}/availability`, label: "Availability" },
      { to: `${basePath}/registry-support`, label: "Registry Support" },
      { to: `${basePath}/personal-shopping`, label: "Personal Shopping" },
      { to: `${basePath}/nursery-design`, label: "Nursery Design" },
      { to: `${basePath}/in-law-interface`, label: "In-Law Interface" },
      { to: `${basePath}/events`, label: "Events & Celebrations" },
      { to: `${basePath}/messages`, label: "Messages" },
      { to: `${basePath}/notes`, label: "Notes" },
      { to: `${basePath}/resources`, label: "Resource Library" },
    ],
    [basePath],
  );

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="sticky top-0 z-40 border-b border-blush/30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blush/40 px-3 py-2 font-heading text-charcoal shadow-soft">
              Taylor-Made Baby Co.
            </div>
            <span className="hidden text-xs uppercase tracking-[0.3em] text-charcoal/50 md:inline">
              Mentor Concierge Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal/60">
              <span>{isOnline ? "Online" : "Away"}</span>
              <button
                type="button"
                onClick={() => setIsOnline((prev) => !prev)}
                className={`h-6 w-12 rounded-full border border-blush/50 transition ${isOnline ? "bg-blush" : "bg-ivory"}`}
              >
                <span
                  className={`block h-5 w-5 translate-y-[2px] rounded-full bg-white shadow-soft transition ${
                    isOnline ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-blush/60 bg-blush/10 px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/20"
            >
              Log Out
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-blush/30 bg-white px-3 py-2 shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush/40 font-heading text-charcoal">
                  {(profile?.name || "Mentor").slice(0, 2).toUpperCase()}
                </span>
                <div className="text-left">
                  <p className="font-heading text-sm text-charcoal">{profile?.name || "Mentor"}</p>
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-charcoal/50">Mentor Concierge</p>
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-blush/30 bg-white p-3 shadow-dreamy">
                  <button type="button" className="w-full rounded-xl px-3 py-2 text-left text-sm font-body text-charcoal/70 hover:bg-blush/20">
                    Profile
                  </button>
                  <button type="button" className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-body text-charcoal/70 hover:bg-blush/20">
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-body text-mauve hover:bg-blush/20"
                  >
                    Log Out
                  </button>
                </div>
              )}
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
                  end={Boolean(link.end)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 font-body text-sm transition ${
                      isActive
                        ? "bg-mauve/20 text-charcoal border border-mauve/40"
                        : "border border-transparent text-charcoal/70 hover:bg-mauve/10"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.label}</span>
                      {isActive && <span className="text-xs font-heading text-charcoal">♡</span>}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 rounded-[2.5rem] border border-blush/40 bg-white/95 p-6 shadow-soft">
          <Routes>
            <Route index element={<MentorDashboard />} />
            <Route path="dashboard" element={<MentorDashboard />} />
            <Route path="availability" element={<AvailabilityManager />} />
            <Route path="snapshot" element={<MentorPortalDashboard profile={profile} />} />
            <Route path="registry-support" element={<RegistrySupport />} />
            <Route path="personal-shopping" element={<PersonalShopping />} />
            <Route path="nursery-design" element={<NurseryDesign />} />
            <Route path="in-law-interface" element={<InLawInterface />} />
            <Route path="events" element={<EventsCelebrations />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notes" element={<Notes />} />
            <Route path="resources" element={<ResourceLibrary />} />
            <Route path="*" element={<MentorDashboard />} />
          </Routes>
        </main>
      </div>
      <footer className="px-4 pb-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-blush/30 bg-blush/10 px-6 py-3 text-center text-[0.65rem] font-heading uppercase tracking-[0.3em] text-charcoal/50">
          Taylor-Made Baby Co. • Confidential Concierge Communication • Protected by NDA
        </div>
      </footer>
    </div>
  );
};

const MentorPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [isOnline, setIsOnline] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const basePath = location.pathname.startsWith("/mentor") ? "/mentor" : "/mentor-portal";

  useEffect(() => {
    const token = localStorage.getItem("tm_token");
    if (!token) {
      setState({ status: "unauthorized", data: null, error: "Please sign in to access your mentor portal." });
      return;
    }

    const abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch("/api/v1/mentors/me", {
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
          throw new Error(payload?.error?.message || "Unable to load mentor profile.");
        }

        setState({ status: "ready", data: payload?.data ?? null, error: null });
      } catch (error) {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error: error.message || "Unable to load mentor profile." });
      }
    })();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    navigate("/portal");
  };

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <div className="rounded-[2.5rem] border border-blush/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-charcoal">Loading your mentor dashboard…</p>
        </div>
      </main>
    );
  }

  if (state.status === "unauthorized") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <div className="space-y-4 rounded-[2.5rem] border border-blush/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-charcoal">{state.error}</p>
          <button
            type="button"
            onClick={() => navigate("/portal")}
            className="mx-auto rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Go to Sign In
          </button>
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory px-6">
        <div className="space-y-4 rounded-[2.5rem] border border-blush/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-charcoal">{state.error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mx-auto rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <MentorPortalLayout
      profile={state.data}
      onSignOut={handleSignOut}
      isOnline={isOnline}
      setIsOnline={setIsOnline}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      basePath={basePath}
    />
  );
};

export default MentorPortal;
