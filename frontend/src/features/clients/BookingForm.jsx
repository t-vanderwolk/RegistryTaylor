import React, { useState } from "react";

export function BookingForm({ mentorId }) {
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState({ loading: false, message: "", error: "" });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "", error: "" });
    try {
      const token = localStorage.getItem("tm_token");
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ mentorId, startsAt, endsAt, notes }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to save your booking request.");
      }
      setStatus({ loading: false, message: "Booking request sent to your concierge!", error: "" });
      setStartsAt("");
      setEndsAt("");
      setNotes("");
    } catch (error) {
      setStatus({
        loading: false,
        message: "",
        error: error.message || "Unable to send booking request.",
      });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="datetime-local"
        value={startsAt}
        onChange={(event) => setStartsAt(event.target.value)}
        className="w-full rounded-xl border border-babyPink/40 bg-white px-3 py-2 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
      />
      <input
        type="datetime-local"
        value={endsAt}
        onChange={(event) => setEndsAt(event.target.value)}
        className="w-full rounded-xl border border-babyPink/40 bg-white px-3 py-2 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
      />
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Anything we should know?"
        className="w-full rounded-xl border border-babyPink/40 bg-white px-3 py-2 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
        rows={3}
      />
      <button
        className="inline-flex w-full items-center justify-center rounded-xl bg-blueberry px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy disabled:cursor-not-allowed disabled:opacity-70"
        disabled={status.loading}
      >
        {status.loading ? "Requesting…" : "Request Booking"}
      </button>
      {status.message && <p className="text-sm text-emerald-600">{status.message}</p>}
      {status.error && <p className="text-sm text-rose-500">{status.error}</p>}
    </form>
  );
}

export default BookingForm;
