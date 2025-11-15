'use client';

import { useEffect, useState } from "react";
import type { ConnectEvent } from "./data";

type EventsListProps = {
  events: ConnectEvent[];
};

export default function EventsList({ events: initialEvents }: EventsListProps) {
  const [events, setEvents] = useState(initialEvents);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleRsvp = async (eventId: string) => {
    setPendingId(eventId);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status: "GOING" }),
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Unable to update RSVP.");
      }

      setEvents((current) =>
        current.map((event) => {
          if (event.id !== eventId) {
            return event;
          }
          const alreadyGoing = event.userStatus === "GOING";
          const attendeeCount = event.attendeeCount ?? 0;
          return {
            ...event,
            attendeeCount: alreadyGoing ? attendeeCount : attendeeCount + 1,
            userStatus: "GOING",
          };
        })
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update RSVP.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div
      id="events"
      className="space-y-3 rounded-[1.75rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Events</p>
          <h2 className="text-lg font-semibold tracking-tight text-[#3E2F35]">Upcoming salons</h2>
        </div>
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
          {events.length} this week
        </span>
      </div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 text-sm text-[#3E2F35]/75">
        {events.map((event) => (
          <article key={event.id} className="min-w-[280px] max-w-[320px] snap-center rounded-[1.5rem] bg-white/90 p-4 shadow-inner">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
              {formatEventTime(event)}
            </p>
            <p className="mt-2 text-base font-semibold text-[#3E2F35] line-clamp-2">{event.title}</p>
            {event.description && <p className="mt-1 text-xs leading-snug text-[#3E2F35]/70 line-clamp-2">{event.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
              {event.location ? <span>{event.location}</span> : null}
              {typeof event.attendeeCount === "number" ? <span>{event.attendeeCount} going</span> : null}
            </div>
            <button
              type="button"
              disabled={event.userStatus === "GOING" || pendingId === event.id}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tm-rose px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
              onClick={() => handleRsvp(event.id)}
            >
              {event.userStatus === "GOING"
                ? "Going"
                : pendingId === event.id
                ? "Saving..."
                : "RSVP"}
            </button>
          </article>
        ))}
      </div>
      {errorMessage ? (
        <p className="rounded-[1.5rem] border border-[#D97373]/35 bg-[#FFF5F4] px-4 py-2 text-xs text-[#5C2E2E] shadow-inner">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function formatEventTime(event: ConnectEvent): string {
  if (event.startsAtLabel) {
    return event.startsAtLabel;
  }
  if (!event.startsAt) {
    return "";
  }
  const timestamp = new Date(event.startsAt);
  if (Number.isNaN(timestamp.getTime())) {
    return "";
  }
  return timestamp.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
