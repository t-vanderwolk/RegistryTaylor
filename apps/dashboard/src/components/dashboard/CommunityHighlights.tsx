"use client";

import { useEffect, useState } from "react";
import { fetchCommunityOverview, type CommunityEvent, type CommunityHighlight } from "@/lib/community";

export default function CommunityHighlights() {
  const [highlights, setHighlights] = useState<CommunityHighlight[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchCommunityOverview().then((overview) => {
      if (!mounted) return;
      setHighlights(overview.highlights);
      setEvents(overview.events);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-soft">
        <p className="text-sm text-[#3E2F35]/70">Loading community updates…</p>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.65fr,0.35fr]">
      <section className="space-y-4 rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Community Highlights
        </p>
        {highlights.length === 0 ? (
          <p className="text-sm text-[#3E2F35]/70">No new posts yet. Check back soon!</p>
        ) : (
          <ul className="space-y-4">
            {highlights.map((highlight) => (
              <li key={highlight.id} className="rounded-2xl border border-[#EAD6DE] p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                  <span>{highlight.author}</span>
                  <span>{new Date(highlight.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">{highlight.title}</h3>
                <p className="mt-2 text-sm text-[#3E2F35]/70">{highlight.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4 rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Upcoming Events
        </p>
        {events.length === 0 ? (
          <p className="text-sm text-[#3E2F35]/70">No events scheduled.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="rounded-xl border border-[#EAD6DE] p-4 text-sm text-[#3E2F35]/80">
                <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/70">
                  {event.startsAt ? new Date(event.startsAt).toLocaleString() : "Date TBA"}
                </p>
                <p className="mt-1 font-semibold text-[#3E2F35]">{event.title}</p>
                <p className="text-xs text-[#3E2F35]/60">{event.location ?? "Virtual"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
