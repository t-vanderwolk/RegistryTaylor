import type { ConnectEvent } from "./data";

type EventsListProps = {
  events: ConnectEvent[];
};

export default function EventsList({ events }: EventsListProps) {
  return (
    <div
      id="events"
      className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Events</p>
      <h2 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">Upcoming salons & circles</h2>
      <ul className="mt-5 space-y-5 text-sm text-[#3E2F35]/75">
        {events.map((event) => (
          <li key={event.id} className="rounded-[1.75rem] bg-white/85 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
              {formatEventTime(event)}
            </p>
            <p className="mt-2 font-semibold text-[#3E2F35]">{event.title}</p>
            {event.description && <p className="mt-2 text-xs text-[#3E2F35]/70">{event.description}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              {event.location && (
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/60">
                  {event.location}
                </span>
              )}
              {typeof event.attendeeCount === "number" && (
                <span className="rounded-full bg-[#C8A1B4]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                  {event.attendeeCount} going
                </span>
              )}
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_20px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,161,180,0.45)]"
            >
              RSVP
            </button>
          </li>
        ))}
      </ul>
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
