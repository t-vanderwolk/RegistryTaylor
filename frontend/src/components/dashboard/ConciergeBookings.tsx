'use client';

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequestSessionForm from "./RequestSessionForm";

type Booking = {
  id: string;
  title: string;
  startsAt: string | null;
  location: string | null;
  status: "GOING" | "INTERESTED" | "DECLINED" | null;
};

type ConciergeBookingsProps = {
  bookings: Booking[];
  mentorId: string | null;
  mentorName: string;
  memberName: string;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Date to be confirmed";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date to be confirmed";
  }
  return parsed.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ConciergeBookings({
  bookings,
  mentorId,
  mentorName,
  memberName,
}: ConciergeBookingsProps) {
  const [showModal, setShowModal] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const upcoming = useMemo(() => bookings.slice(0, 4), [bookings]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-8 shadow-[0_28px_65px_rgba(200,161,180,0.18)]"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/55">Concierge Sessions</p>
          <h2 className="mt-2 text-2xl font-[var(--font-playfair)] text-[#3E2F35]">
            Your bookings with {mentorName}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => (mentorId ? setShowModal(true) : undefined)}
          disabled={!mentorId}
          className="inline-flex items-center justify-center rounded-full border border-[#C8A1B4]/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] transition hover:bg-[#FFFAF8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Request New Session
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {upcoming.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-[#EAD6DE] bg-[#FFFAF8] px-5 py-6 text-sm text-[#3E2F35]/70">
            Your mentor will confirm upcoming sessions soon. Use “Request New Session” to share timing that works for
            you.
          </div>
        ) : (
          upcoming.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[1.9rem] border border-[#EAD6DE] bg-[#FFFFFF] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
                    {booking.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.32em] text-[#D9C48E]">
                    {formatDate(booking.startsAt)}
                  </p>
                  {booking.location ? (
                    <p className="mt-1 text-xs text-[#3E2F35]/60">{booking.location}</p>
                  ) : null}
                </div>
                {booking.status ? (
                  <span className="rounded-full bg-gradient-to-r from-[#EAC9D1]/40 to-[#C8A1B4]/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                    {booking.status === "GOING" ? "Confirmed" : booking.status.toLowerCase()}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {requestSuccess ? (
        <div className="mt-5 rounded-[1.6rem] border border-[#D9C48E]/45 bg-[#FFFAF8] px-4 py-3 text-xs text-[#3E2F35]/70">
          Your concierge team received the request. They’ll reply in Messages with next steps.
        </div>
      ) : null}

      <AnimatePresence>
        {showModal && mentorId ? (
          <RequestSessionForm
            mentorId={mentorId}
            mentorName={mentorName}
            memberName={memberName}
            onClose={() => setShowModal(false)}
            onSuccess={() => setRequestSuccess(true)}
          />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
