"use client";

import { useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";

type MentorOverviewPayload = {
  events: Array<{ id: string; title: string; startsAt: string | null; location?: string | null }>;
  announcements: Array<{ id: string; title: string; body: string; createdAt: string }>;
};

type MentorOverviewProps = {
  user: AuthenticatedUser;
};

export default function MentorOverview({ user }: MentorOverviewProps) {
  const [snapshot, setSnapshot] = useState<MentorOverviewPayload>({ events: [], announcements: [] });

  useEffect(() => {
    let mounted = true;

    fetch("/api/mentor/overview", { cache: "no-store", credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("mentor overview failed"))))
      .then((payload: MentorOverviewPayload) => {
        if (!mounted) return;
        setSnapshot({
          events: payload.events ?? [],
          announcements: payload.announcements ?? [],
        });
      })
      .catch((error) => console.error(error));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Mentor Studio
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">
          Welcome, {user.name ?? user.email}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Here’s what needs your attention across events, salon invites, and concierge requests.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[#3E2F35]">Upcoming Events</h2>
          <p className="text-sm text-[#3E2F35]/70">Stay ready for salons, office hours, and check-ins.</p>
          <ul className="mt-4 space-y-3">
            {snapshot.events.length === 0 ? (
              <li className="text-sm text-[#3E2F35]/70">No events on the calendar.</li>
            ) : (
              snapshot.events.slice(0, 4).map((event) => (
                <li key={event.id} className="rounded-xl border border-[#EAD6DE] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                    {event.startsAt ? new Date(event.startsAt).toLocaleString() : "TBA"}
                  </p>
                  <p className="mt-2 font-semibold text-[#3E2F35]">{event.title}</p>
                  <p className="text-xs text-[#3E2F35]/60">{event.location ?? "Virtual"}</p>
                </li>
              ))
            )}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[#3E2F35]">Announcements to review</h2>
          <p className="text-sm text-[#3E2F35]/70">
            Share updates with members or pin the latest concierge prompts.
          </p>
          <ul className="mt-4 space-y-3">
            {snapshot.announcements.length === 0 ? (
              <li className="text-sm text-[#3E2F35]/70">No announcements found.</li>
            ) : (
              snapshot.announcements.slice(0, 4).map((announcement) => (
                <li key={announcement.id} className="rounded-xl border border-[#EAD6DE] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 font-semibold text-[#3E2F35]">{announcement.title}</p>
                  <p className="text-xs text-[#3E2F35]/60">{announcement.body}</p>
                </li>
              ))
            )}
          </ul>
        </article>
      </section>
    </div>
  );
}
