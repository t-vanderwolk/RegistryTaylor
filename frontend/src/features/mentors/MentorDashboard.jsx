import React from "react";
import { useSafeFetch } from "../../hooks/useSafeFetch";
import EmptyState from "../../components/UI/EmptyState";

export default function MentorDashboard() {
  const { data, loading, error } = useSafeFetch("/api/bookings/me", {}, { fallback: { data: [] } });
  const bookings = Array.isArray(data?.data) ? data.data : [];

  if (loading) {
    return <p className="text-sm text-darkText/70">Loading bookings…</p>;
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
          className="rounded-2xl border border-babyPink/40 bg-white/80 p-4 shadow-soft"
        >
          <p className="font-medium text-blueberry">
            Session with {booking.client?.firstName || "Client"}
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
  );
}
