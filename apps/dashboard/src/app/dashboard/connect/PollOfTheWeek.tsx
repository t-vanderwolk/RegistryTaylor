"use client";

import { useMemo, useState } from "react";
import type { PollOption, WeeklyPoll } from "./data";

type PollOfTheWeekProps = {
  poll: WeeklyPoll;
};

export default function PollOfTheWeek({ poll }: PollOfTheWeekProps) {
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    poll.options.reduce<Record<string, number>>((accumulator, option) => {
      accumulator[option.id] = option.votes;
      return accumulator;
    }, {})
  );
  const [selection, setSelection] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasSelection = Boolean(selection);

  const totalVotes = useMemo(
    () => Object.values(votes).reduce((sum, count) => sum + count, 0),
    [votes]
  );

  const sortedOptions = useMemo<PollOption[]>(
    () =>
      [...poll.options].sort((a, b) => {
        const diff = (votes[b.id] ?? 0) - (votes[a.id] ?? 0);
        return diff !== 0 ? diff : a.label.localeCompare(b.label);
      }),
    [poll.options, votes]
  );

  const handleVote = async (optionId: string) => {
    if (pending || selection) {
      return;
    }

    setPending(true);
    setErrorMessage(null);
    setSelection(optionId);
    setVotes((current) => ({
      ...current,
      [optionId]: (current[optionId] ?? 0) + 1,
    }));

    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Unable to submit vote.");
      }
    } catch (error) {
      setSelection(null);
      setVotes((current) => ({
        ...current,
        [optionId]: Math.max((current[optionId] ?? 1) - 1, 0),
      }));
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit vote.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Poll of the Week</p>
        <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">{poll.question}</h2>
        {poll.description && <p className="text-sm text-[#3E2F35]/70">{poll.description}</p>}
      </header>

      <div className="space-y-4">
        {sortedOptions.map((option) => {
          const voteCount = votes[option.id] ?? 0;
          const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isActive = selection === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleVote(option.id)}
              disabled={pending || hasSelection}
              className={[
                "w-full rounded-[1.75rem] border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0",
                isActive
                  ? "border-tm-mauve bg-tm-blush shadow-soft"
                  : "border-tm-mauve/40 bg-white/90 hover:-translate-y-0.5 hover:border-tm-hover",
              ].join(" ")}
            >
              <div className="flex items-center justify-between text-sm text-[#3E2F35]/75">
                <span>{option.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/65">
                  {percentage}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-tm-blush">
                <div
                  className={[
                    "h-full rounded-full bg-tm-mauve transition-all",
                    isActive ? "shadow-[0_8px_18px_rgba(177,132,153,0.28)]" : "",
                  ].join(" ")}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#3E2F35]/55">
                {voteCount} {voteCount === 1 ? "vote" : "votes"}
              </p>
            </button>
          );
        })}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#3E2F35]/60">
        <span className="font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">
          {poll.category}
        </span>
        <span>
          {totalVotes} total vote{totalVotes === 1 ? "" : "s"}
          {poll.closesAt && ` · Closes ${formatPollDeadline(poll.closesAt)}`}
        </span>
        {!hasSelection && !pending && (
          <span className="text-[#3E2F35]/50">Tap a prompt to add your anonymous vote.</span>
        )}
        {pending ? <span className="text-[#3E2F35]/50">Saving your vote…</span> : null}
        {errorMessage ? (
          <span className="text-[#9F3D3D]">{errorMessage}</span>
        ) : null}
      </footer>
    </section>
  );
}

function formatPollDeadline(deadline: string): string {
  const parsed = new Date(deadline);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
