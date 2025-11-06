import React from "react";
import { useSafeFetch } from "../../hooks/useSafeFetch";
<<<<<<< HEAD
import EmptyState from "../../components/ui/EmptyState";
=======
import EmptyState from "../../components/UI/EmptyState";
>>>>>>> heroku/main

export default function MentorDashboard() {
  const { data, loading, error } = useSafeFetch("/api/bookings/me", {}, { fallback: { data: [] } });
  const bookings = Array.isArray(data?.data) ? data.data : [];

  if (loading) {
<<<<<<< HEAD
    return <p className="text-sm text-charcoal/70">Loading bookings…</p>;
=======
    return <p className="text-sm text-darkText/70">Loading bookings…</p>;
>>>>>>> heroku/main
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load bookings"
        subtitle={error.message || "Please try again soon."}
      />
    );
  }

  if (!bookings.length) {
    return (
      <EmptyState
        title="No bookings yet"
        subtitle="Clients will appear here once they book you."
      />
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
<<<<<<< HEAD
          className="rounded-2xl border border-blush/40 bg-white/80 p-4 shadow-soft"
        >
          <p className="font-medium text-charcoal">
            Session with {booking.client?.firstName || "Client"}
          </p>
          {booking.startsAt && (
            <p className="text-sm text-charcoal/70">
=======
          className="rounded-2xl border border-babyPink/40 bg-white/80 p-4 shadow-soft"
        >
          <p className="font-medium text-blueberry">
            Session with {booking.client?.firstName || "Client"}
          </p>
          {booking.startsAt && (
            <p className="text-sm text-darkText/70">
>>>>>>> heroku/main
              {new Date(booking.startsAt).toLocaleString()}
            </p>
          )}
          {booking.notes && (
<<<<<<< HEAD
            <p className="mt-2 text-sm text-charcoal/60">Notes: {booking.notes}</p>
=======
            <p className="mt-2 text-sm text-darkText/60">Notes: {booking.notes}</p>
>>>>>>> heroku/main
          )}
        </div>
      ))}
    </div>
  );
}
