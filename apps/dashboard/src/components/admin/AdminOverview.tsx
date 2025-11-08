"use client";

import { useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";

type AdminOverviewPayload = {
  events: { id: string; title: string; startsAt: string | null }[];
  announcements: { id: string; title: string; createdAt: string }[];
  mentors: { id: string; email: string }[];
  posts: { id: string; title: string; createdAt: string }[];
};

type AdminOverviewProps = {
  user: AuthenticatedUser;
};

export default function AdminOverview({ user }: AdminOverviewProps) {
  const [data, setData] = useState<AdminOverviewPayload>({
    events: [],
    announcements: [],
    mentors: [],
    posts: [],
  });

  useEffect(() => {
    let mounted = true;

    fetch("/api/admin/overview", { cache: "no-store", credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Admin overview failed"))))
      .then((payload: AdminOverviewPayload) => {
        if (!mounted) return;
        setData({
          events: payload.events ?? [],
          announcements: payload.announcements ?? [],
          mentors: payload.mentors ?? [],
          posts: payload.posts ?? [],
        });
      })
      .catch((error) => console.error(error));

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = [
    { label: "Mentors", value: data.mentors.length },
    { label: "Announcements", value: data.announcements.length },
    { label: "Open Events", value: data.events.length },
    { label: "Community Posts", value: data.posts.length },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Admin Control Center
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">
          Operational snapshot for {user.name ?? user.email}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Review high-level metrics, unblock mentors, and keep Taylor-Made humming.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[#EAD6DE] bg-white/95 p-5 text-center shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/80">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[#3E2F35]">Latest Announcements</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#3E2F35]/80">
            {data.announcements.slice(0, 4).map((announcement) => (
              <li key={announcement.id} className="rounded-xl border border-[#EAD6DE] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-1 font-semibold text-[#3E2F35]">{announcement.title}</p>
              </li>
            ))}
            {data.announcements.length === 0 ? <li>No announcements found.</li> : null}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-[#3E2F35]">Active Events</h2>
          <ul className="mt-4 space-y-3 text-sm text-[#3E2F35]/80">
            {data.events.slice(0, 4).map((event) => (
              <li key={event.id} className="rounded-xl border border-[#EAD6DE] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                  {event.startsAt ? new Date(event.startsAt).toLocaleString() : "Date TBD"}
                </p>
                <p className="mt-1 font-semibold text-[#3E2F35]">{event.title}</p>
              </li>
            ))}
            {data.events.length === 0 ? <li>No events scheduled.</li> : null}
          </ul>
        </article>
      </section>
    </div>
  );
}
