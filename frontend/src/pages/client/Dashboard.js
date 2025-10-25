import React from "react";
import { motion } from "framer-motion";
import { ClientOverview, ThreadView, BookingForm } from "../../features/clients";
import { useSafeFetch } from "../../hooks/useSafeFetch";
import EmptyState from "../../components/ui/EmptyState";

const sectionMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const {
    data: meData,
    loading: meLoading,
    error: meError,
  } = useSafeFetch("/api/me", {}, { fallback: {} });

  const {
    data: bookingsData,
    loading: bookingsLoading,
    error: bookingsError,
  } = useSafeFetch("/api/bookings", {}, { fallback: { data: [] } });

  const bookings = Array.isArray(bookingsData?.data) ? bookingsData.data : [];
  const mentorId = meData?.mentor?.id || "mentor-demo";
  const primaryThread = meData?.threads?.[0]?.id || "primary";

  return (
    <div className="space-y-8">
      <ClientOverview />

      <motion.section
        {...sectionMotion}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="space-y-4 rounded-[2.5rem] border border-babyBlue/30 bg-white/90 p-6 shadow-soft"
      >
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-darkText/50">Your Week</p>
            <h2 className="text-2xl font-serif text-blueberry">Upcoming concierge bookings</h2>
          </div>
        </header>
        {bookingsLoading && <p className="text-sm text-darkText/60">Loading bookings…</p>}
        {bookingsError && (
          <EmptyState
            title="Unable to load bookings"
            subtitle={bookingsError.message || "Please try again soon."}
          />
        )}
        {!bookingsLoading && !bookingsError && bookings.length === 0 && (
          <EmptyState
            title="No bookings yet"
            subtitle="Schedule time with your mentor to see them here."
            cta={<BookingForm mentorId={mentorId} />}
          />
        )}
        {!bookingsLoading && !bookingsError && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-babyPink/40 bg-babyPink/10 p-4 shadow-soft"
              >
                <p className="font-heading text-blueberry">
                  {booking.title || "Concierge session"}
                </p>
                {booking.startsAt && (
                  <p className="text-sm text-darkText/70">
                    {new Date(booking.startsAt).toLocaleString()}
                  </p>
                )}
                {booking.notes && (
                  <p className="mt-2 text-sm text-darkText/60">Notes: {booking.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section
        {...sectionMotion}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="space-y-4 rounded-[2.5rem] border border-babyPink/40 bg-white/90 p-6 shadow-soft"
      >
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-darkText/50">Concierge Messages</p>
            <h2 className="text-2xl font-serif text-blueberry">Chat with your mentor team</h2>
          </div>
        </header>
        {meLoading && <p className="text-sm text-darkText/60">Loading your thread…</p>}
        {meError && (
          <EmptyState
            title="Unable to load messages"
            subtitle={meError.message || "Please try again soon."}
          />
        )}
        {!meLoading && !meError && <ThreadView threadId={primaryThread} />}
      </motion.section>

      <motion.section
        {...sectionMotion}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="space-y-4 rounded-[2.5rem] border border-gold/30 bg-white/90 p-6 shadow-soft"
      >
        <h2 className="text-2xl font-serif text-blueberry">Request a new concierge session</h2>
        <p className="text-sm text-darkText/70">
          Let Taylor know when you&apos;d like to connect. She&apos;ll confirm within 24 hours.
        </p>
        <BookingForm mentorId={mentorId} />
      </motion.section>
    </div>
  );
};

export default Dashboard;
