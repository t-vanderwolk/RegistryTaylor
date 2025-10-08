import React from "react";
import { ThreadView } from "../../features/clients";
import { useSafeFetch } from "../../hooks/useSafeFetch";
import EmptyState from "../../components/UI/EmptyState";

const Messages = () => {
  const { data, loading, error } = useSafeFetch("/api/me", {}, { fallback: {} });
  const threadId = data?.threads?.[0]?.id || "primary";
  const mentorNames = Array.isArray(data?.mentor?.team) ? data.mentor.team : [];

  if (loading) {
    return <p className="text-sm text-darkText/70">Loading your thread…</p>;
  }

  if (error) {
    return (
      <EmptyState
        title="We couldn’t load your messages"
        subtitle={error.message || "Please try again soon."}
      />
    );
  }

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-babyPink/40 bg-white/90 p-6 shadow-soft">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-darkText/50">Concierge messages</p>
        <h1 className="mt-2 text-3xl font-serif text-blueberry">Stay in touch with Taylor</h1>
        {mentorNames.length > 0 && (
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-darkText/50">
            Mentor team: {mentorNames.join(", ")}
          </p>
        )}
      </header>
      <ThreadView threadId={threadId} />
    </section>
  );
};

export default Messages;
