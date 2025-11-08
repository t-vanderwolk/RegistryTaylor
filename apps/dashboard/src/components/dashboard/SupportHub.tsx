"use client";

import { useEffect, useState } from "react";
import type { AuthenticatedUser } from "@/lib/auth";
import {
  fetchSupportOverview,
  type SupportAnnouncement,
  type SupportPoll,
} from "@/lib/support";

type SupportHubProps = {
  user: AuthenticatedUser;
};

export default function SupportHub({ user }: SupportHubProps) {
  const [announcements, setAnnouncements] = useState<SupportAnnouncement[]>([]);
  const [polls, setPolls] = useState<SupportPoll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchSupportOverview().then((overview) => {
      if (!mounted) return;
      setAnnouncements(overview.announcements);
      setPolls(overview.polls);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-[#C8A1B4]/80">Support Hub</p>
        <p className="mt-4 text-sm text-[#3E2F35]/70">Checking concierge requests…</p>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Support Hub
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">
          Hi {user.name ?? user.email}, here's what's on deck
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Track concierge announcements, mentor polls, and open requests that need a response.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.6fr,0.4fr]">
        <div className="space-y-4 rounded-[2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
            Recent Announcements
          </p>
          {announcements.length === 0 ? (
            <p className="text-sm text-[#3E2F35]/70">No open announcements. Enjoy the calm!</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="rounded-xl border border-[#EAD6DE] p-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/80">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </div>
                  <h3 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">
                    {announcement.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#3E2F35]/70">{announcement.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-4 rounded-[2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
            Active Polls
          </p>
          {polls.length === 0 ? (
            <p className="text-sm text-[#3E2F35]/70">No active polls right now.</p>
          ) : (
            <ul className="space-y-3">
              {polls.map((poll) => (
                <li key={poll.id} className="rounded-xl border border-[#EAD6DE] p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                    {poll.category}
                  </p>
                  <p className="mt-2 font-semibold text-[#3E2F35]">{poll.question}</p>
                  {poll.closesAt ? (
                    <p className="mt-1 text-xs text-[#3E2F35]/60">
                      Closes {new Date(poll.closesAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </div>
  );
}
