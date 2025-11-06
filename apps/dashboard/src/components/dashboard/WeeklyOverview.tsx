'use client';

import { motion } from "framer-motion";

type WeeklyEvent = {
  id: string;
  title: string;
  startsAt: string | null;
  location: string | null;
  description: string | null;
};

type WeeklyOverviewProps = {
  events: WeeklyEvent[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Date to be announced";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date to be announced";
  }
  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WeeklyOverview({ events }: WeeklyOverviewProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-8 shadow-[0_28px_65px_rgba(200,161,180,0.18)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/55">Your Week Ahead</p>
          <h2 className="mt-2 text-2xl font-[var(--font-playfair)] text-[#3E2F35]">
            Concierge sessions & studio salons
          </h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {events.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-[#EAD6DE] bg-[#FFFAF8]/80 px-5 py-6 text-sm text-[#3E2F35]/70">
            We’ll add fresh gatherings to your calendar shortly. Check back for new salons and mentor office hours.
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="relative overflow-hidden rounded-[1.9rem] border border-[#EAD6DE] bg-[#FFF8F5] p-6 shadow-inner"
            >
              <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b from-[#EAC9D1] to-[#D9C48E]" />
              <div className="pl-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
                    {event.title}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D9C48E]">
                    {formatDate(event.startsAt)}
                  </span>
                </div>
                {event.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/70">
                    {event.description}
                  </p>
                ) : null}
                {event.location ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#3E2F35]/55">
                    {event.location}
                  </p>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}
