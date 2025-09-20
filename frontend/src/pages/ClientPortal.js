// src/pages/ClientPortal.js
import React, { useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

const conciergeHighlights = [
  { id: 1, title: "Nursery install", detail: "White-glove setup scheduled for October 4 at 9:00 AM." },
  { id: 2, title: "Registry refresh", detail: "Morgan added 5 curated travel picks based on your babymoon plans." },
];

const conciergeChecklist = [
  "Review stroller accessories list",
  "Upload hospital bag preferences",
  "Confirm grandparent sleepover dates",
];

const conciergeMessages = [
  { sender: "Morgan (Mentor)", message: "Sent over the baby monitor comparison chart—let’s hop on Zoom!", time: "Today, 8:10 AM" },
  { sender: "Concierge Team", message: "Your Sip & See inspiration deck is ready for review.", time: "Yesterday, 6:45 PM" },
];

const Topbar = ({ clientName, onSignOut }) => (
  <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Client Portal</p>
        <p className="font-playful text-2xl text-blueberry">Taylor-Made Lounge</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed in</p>
          <p className="text-sm font-semibold text-blueberry">{clientName}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-babyBlue/30 text-blueberry">
          {clientName.charAt(0)}
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-full border border-babyPink/60 bg-babyPink/10 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:bg-babyPink/20"
        >
          Log Out
        </button>
      </div>
    </div>
  </header>
);

/* --- Dashboard --- */
const Dashboard = () => (
  <div className="space-y-8">
    <section className="grid gap-6 md:grid-cols-2">
      <article className="rounded-3xl border border-babyBlue/40 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-xl text-blueberry">Upcoming Support</h2>
        <ul className="mt-4 space-y-4 text-sm">
          {conciergeHighlights.map((item) => (
            <li key={item.id} className="rounded-2xl border border-babyBlue/30 bg-babyBlue/10 px-4 py-3">
              <p className="font-semibold">{item.title}</p>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </article>
      <article className="rounded-3xl border border-babyPink/40 bg-white p-6 shadow-soft">
        <h2 className="font-heading text-xl text-blueberry">Concierge Checklist</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {conciergeChecklist.map((task) => (
            <li key={task} className="flex items-start gap-3 rounded-2xl border border-babyPink/30 bg-babyPink/10 px-4 py-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-babyPink">★</span>
              <p>{task}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
    <section className="rounded-3xl border border-pastelPurple/40 bg-white p-6 shadow-soft">
      <h2 className="font-heading text-xl text-blueberry">Messages & Updates</h2>
      <div className="mt-4 space-y-4 text-sm">
        {conciergeMessages.map((msg, idx) => (
          <div key={idx} className="rounded-2xl border border-pastelPurple/30 bg-pastelPurple/10 px-5 py-4">
            <p className="font-semibold">{msg.sender}</p>
            <p className="mt-1">{msg.message}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{msg.time}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

/* --- Registry --- */
const RegistryPage = () => (
  <div className="space-y-6">
    <h2 className="font-heading text-xl text-blueberry">Your Registry</h2>
    <p className="text-sm text-darkText/70">Curated picks, shoppable links, and space for your own notes.</p>
    <div className="rounded-3xl border border-babyBlue/40 bg-white p-6 shadow-soft">
      <ul className="space-y-3">
        <li>🛒 Nuna MIXX Next Stroller</li>
        <li>🍼 Comotomo Bottles (2-pack)</li>
        <li>👶 Hatch Rest+ Sound Machine</li>
      </ul>
      <button className="mt-4 rounded-full bg-babyPink/20 px-5 py-2 text-xs font-semibold text-blueberry">
        Add Item
      </button>
    </div>
  </div>
);

/* --- Nursery --- */
const NurseryPage = () => (
  <div className="space-y-6">
    <h2 className="font-heading text-xl text-blueberry">Nursery Design</h2>
    <p className="text-sm text-darkText/70">Mood boards, swatches, and design approvals.</p>
    <div className="rounded-3xl border border-babyPink/40 bg-white p-6 shadow-soft">
      <p>🎨 Upload design inspiration or browse swatch samples here.</p>
      <button className="mt-4 rounded-full bg-babyBlue/20 px-5 py-2 text-xs font-semibold text-blueberry">
        Upload Swatch
      </button>
    </div>
  </div>
);

/* --- Mentor --- */
const MentorPage = () => (
  <div className="space-y-6">
    <h2 className="font-heading text-xl text-blueberry">Your Mentor</h2>
    <p className="text-sm text-darkText/70">Book sessions, send messages, review past chats.</p>
    <div className="rounded-3xl border border-pastelPurple/40 bg-white p-6 shadow-soft">
      <p>💬 Chat placeholder</p>
      <button className="mt-4 rounded-full bg-babyPink/20 px-5 py-2 text-xs font-semibold text-blueberry">
        Book Session
      </button>
    </div>
  </div>
);

/* --- Resources --- */
const ResourcesPage = () => (
  <div className="space-y-6">
    <h2 className="font-heading text-xl text-blueberry">Resources</h2>
    <p className="text-sm text-darkText/70">Guides, checklists, and downloads for your journey.</p>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-babyBlue/30 bg-white p-5 shadow-soft">Hospital Bag Checklist (PDF)</div>
      <div className="rounded-2xl border border-babyPink/30 bg-white p-5 shadow-soft">Stroller Comparison Guide (PDF)</div>
      <div className="rounded-2xl border border-pastelPurple/30 bg-white p-5 shadow-soft">Sleep Training Basics (PDF)</div>
    </div>
  </div>
);

/* --- Progress --- */
const ProgressPage = () => (
  <div className="space-y-6">
    <h2 className="font-heading text-xl text-blueberry">Your Progress</h2>
    <p className="text-sm text-darkText/70">Track milestones and completion %.</p>
    <div className="rounded-3xl border border-babyBlue/40 bg-white p-6 shadow-soft">
      <p>📅 Nursery ready: 70%</p>
      <p>🛍 Registry curated: 85%</p>
      <p>📖 Classes booked: 40%</p>
    </div>
  </div>
);

const ClientPortal = () => {
  const navigate = useNavigate();
  const profile = useMemo(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return { name: "Client" };
    try {
      return JSON.parse(stored);
    } catch {
      return { name: "Client" };
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    navigate("/portal");
  };

  return (
    <div className="min-h-screen bg-cream/40 text-darkText">
      <Topbar clientName={profile.name} onSignOut={handleSignOut} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 lg:px-10">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="registry" element={<RegistryPage />} />
          <Route path="nursery" element={<NurseryPage />} />
          <Route path="mentor" element={<MentorPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>
      </main>
    </div>
  );
};

export default ClientPortal;