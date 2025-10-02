import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const conciergeTouches = [
  { id: 1, title: "Nursery Reveal Timeline", detail: "Taylor scheduled walkthrough + scent layering", status: "in-progress" },
  { id: 2, title: "Registry Polishing", detail: "Mentor added VIP vendor exclusives", status: "completed" },
  { id: 3, title: "Family Welcome Plan", detail: "Custom in-law scripts drafted", status: "next" },
];

const upcomingMoments = [
  { id: 11, label: "Sip & See Planning Session", date: "Sep 22", time: "3:00 PM" },
  { id: 12, label: "Concierge Check-In", date: "Sep 25", time: "12:00 PM" },
  { id: 13, label: "Registry Walkthrough", date: "Oct 1", time: "9:00 AM" },
];

const wishlist = [
  { id: 21, item: "Stokke Flexi Bath Bundle", status: "Reserved" },
  { id: 22, item: "Maison Deux Cloud Rug", status: "Added to registry" },
  { id: 23, item: "Cybex Cloud Q Car Seat", status: "Awaiting approval" },
];

const notes = [
  { id: 31, mentor: "Morgan Ellis", message: "Travel-ready nursery staging confirmed. Finalize scent layering palette.", timestamp: "Today" },
  { id: 32, mentor: "Registry With Taylor", message: "VIP retailer has new drop next Monday—recommend early reservation.", timestamp: "Yesterday" },
];

const BlogSection = () => (
  <section className="space-y-4">
    <header className="space-y-1">
      <h2 className="font-heading text-lg text-blueberry">Taylor-Made Blog</h2>
      <p className="text-sm font-body text-darkText/70">Seasonal reminders, registry highlights, and concierge notes tailored to your due date.</p>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      {conciergeTouches.map((touch) => (
        <article key={touch.id} className="rounded-3xl border border-babyBlue/30 bg-white px-5 py-4 shadow-soft">
          <p className="font-heading text-blueberry">{touch.title}</p>
          <p className="mt-2 text-sm font-body text-darkText/75">{touch.detail}</p>
          <span className="mt-3 inline-block rounded-full bg-babyBlue/20 px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            {touch.status}
          </span>
        </article>
      ))}
    </div>
  </section>
);

const Schedule = () => (
  <section className="space-y-4">
    <header className="space-y-1">
      <h2 className="font-heading text-lg text-blueberry">Upcoming Moments</h2>
      <p className="text-sm font-body text-darkText/70">Everything is coordinated—just peek, breathe, and show up glam-ready.</p>
    </header>
    <div className="rounded-3xl border border-babyPink/30 bg-white shadow-soft">
      <ul className="divide-y divide-babyPink/20">
        {upcomingMoments.map((moment) => (
          <li key={moment.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-heading text-blueberry">{moment.label}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-darkText/60">{moment.date}</p>
            </div>
            <span className="rounded-full bg-babyPink/20 px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
              {moment.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const Wishlist = () => (
  <section className="space-y-4">
    <header className="space-y-1">
      <h2 className="font-heading text-lg text-blueberry">Wishlist & Registry Highlights</h2>
      <p className="text-sm font-body text-darkText/70">Preview what Taylor and your mentor have curated—no decision fatigue needed.</p>
    </header>
    <div className="grid gap-4 md:grid-cols-2">
      {wishlist.map((item) => (
        <article key={item.id} className="rounded-3xl border border-pastelPurple/40 bg-white px-5 py-4 shadow-soft">
          <p className="font-heading text-blueberry">{item.item}</p>
          <span className="mt-3 inline-block rounded-full bg-pastelPurple/20 px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-blueberry">
            {item.status}
          </span>
        </article>
      ))}
    </div>
  </section>
);

const MentorNotes = () => (
  <section className="space-y-4">
    <header className="space-y-1">
      <h2 className="font-heading text-lg text-blueberry">Mentor Notes</h2>
      <p className="text-sm font-body text-darkText/70">Your concierge circle keeps every detail confidential and curated just for you.</p>
    </header>
    <div className="space-y-3">
      {notes.map((note) => (
        <article key={note.id} className="rounded-3xl border border-babyBlue/30 bg-white px-5 py-4 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="font-heading text-blueberry">{note.mentor}</p>
            <span className="text-xs uppercase tracking-[0.3em] text-darkText/60">{note.timestamp}</span>
          </div>
          <p className="mt-2 text-sm font-body text-darkText/80">{note.message}</p>
        </article>
      ))}
    </div>
  </section>
);

const UserPortal = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    const token = localStorage.getItem("tm_token");
    if (!token) {
      setState({ status: "unauthorized", data: null, error: "Please sign in to peek inside your concierge portal." });
      return;
    }

    const abortController = new AbortController();

    (async () => {
      try {
        const response = await fetch("/api/v1/profile/me", {
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
          throw new Error(payload?.error?.message || "Unable to load your concierge dashboard.");
        }

        if (payload?.data?.role !== 'client') {
          setState({ status: "unauthorized", data: null, error: "This portal is reserved for clients." });
          return;
        }

        setState({ status: "ready", data: payload.data, error: null });
      } catch (error) {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error: error.message || "Unable to load your concierge dashboard." });
      }
    })();

    return () => abortController.abort();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    navigate("/portal");
  };

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 px-8 py-10 text-center shadow-soft">
          <p className="font-heading text-blueberry">Curating your Taylor-Made experience…</p>
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

  const user = state.data;

  return (
    <div className="min-h-screen bg-cream text-darkText">
      <header className="sticky top-0 z-40 border-b border-babyPink/30 bg-white/90 backdrop-blur shadow-soft">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-darkText/60">Taylor-Made Concierge</span>
            <span className="font-playful text-2xl text-blueberry">Member Lounge</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-babyPink/40 px-4 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-soft hover:-translate-y-1 hover:shadow-dreamy"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 px-6 py-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-darkText/60">Welcome Home</p>
          <h1 className="mt-2 font-playful text-3xl text-blueberry">Hi {user?.name || 'Lovely Family'} 💕</h1>
          <p className="mt-3 max-w-2xl font-body text-sm text-darkText/75">
            Your mentor circle and Taylor are orchestrating every detail—registry, design, and celebrations. Peek below for what’s already polished and what’s up next.
          </p>
        </section>

        <BlogSection />
        <Schedule />
        <Wishlist />
        <MentorNotes />
      </main>

      <footer className="px-4 pb-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-babyPink/30 bg-babyPink/10 px-6 py-3 text-center text-[0.65rem] font-heading uppercase tracking-[0.3em] text-darkText/50">
          Taylor-Made Baby Co. • Confidential Concierge Experience • NDA Protected
        </div>
      </footer>
    </div>
  );
};

export default UserPortal;
