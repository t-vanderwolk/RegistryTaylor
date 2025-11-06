'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

type MessagesPanelProps = {
  mentorId: string | null;
  mentorName: string;
  memberName: string;
};

const fetcher = async (url: string): Promise<Message[]> => {
  const response = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.error ?? "Unable to load messages.");
  }
  return (await response.json()) as Message[];
};

function formatTimestamp(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesPanel({ mentorId, mentorName, memberName }: MessagesPanelProps) {
  const { data, mutate, error } = useSWR<Message[]>(
    mentorId ? `/api/messages/${mentorId}` : null,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => data ?? [], [data]);
  const hasMentor = Boolean(mentorId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, pending]);

  const timeline = useMemo(() => messages.slice(-10), [messages]);

  const handleSend = async () => {
    if (!hasMentor || !text.trim() || pending) {
      return;
    }
    setPending(true);
    setSendError(null);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: mentorId,
          content: text.trim(),
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Unable to send message.");
      }
      setText("");
      await mutate();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="flex h-full flex-col rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-8 text-[#3E2F35] shadow-[0_28px_65px_rgba(200,161,180,0.18)]"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/55">
            Chat with your mentor team
          </p>
          <h2 className="text-2xl font-[var(--font-playfair)] text-[#3E2F35]">
            Messages with {mentorName}
          </h2>
        </div>
      </div>

      {!hasMentor ? (
        <div className="mt-6 rounded-[1.8rem] border border-dashed border-[#EAD6DE] bg-[#FFFAF8] px-5 py-6 text-sm text-[#3E2F35]/70">
          We’re matching you with the perfect concierge mentor. Messaging unlocks the moment we
          introduce you.
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="mt-6 flex-1 overflow-y-auto rounded-[1.8rem] border border-[#F0DFE6] bg-gradient-to-br from-[#FFFAF8] via-white to-[#F7E9EF] px-5 py-6 shadow-inner"
          >
            <div className="space-y-4">
              {error ? (
                <div className="rounded-[1.6rem] border border-[#D97373]/35 bg-[#FFF5F4] px-4 py-3 text-xs text-[#5C2E2E]">
                  {error.message}
                </div>
              ) : timeline.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-[#EAD6DE] bg-white/80 px-4 py-3 text-sm text-[#3E2F35]/65">
                  Say hello! Let your mentor know what you’re focusing on this week.
                </div>
              ) : (
                timeline.map((message) => {
                  const incoming = message.senderId === mentorId;
                  return (
                    <div
                      key={message.id}
                      className={`max-w-xs rounded-[1.6rem] px-4 py-3 text-sm leading-relaxed shadow-[0_12px_25px_rgba(200,161,180,0.18)] ${
                        incoming
                          ? "bg-[#F6EDF0] text-[#3E2F35]"
                          : "ml-auto bg-gradient-to-r from-[#C8A1B4] to-[#EAC9D1] text-[#3E2F35]"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="mt-2 block text-right text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-[#D9C48E]">
                        {formatTimestamp(message.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={`Share an update, ${memberName}…`}
              rows={3}
              className="w-full resize-none rounded-[1.6rem] border border-[#EAD6DE] bg-white/95 px-4 py-3 text-sm text-[#3E2F35] shadow-inner focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]/70"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#3E2F35]/55">
                Mentor responses appear in real time with soft gold accents.
              </span>
              <button
                type="button"
                onClick={handleSend}
                disabled={pending || !text.trim()}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-6 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] shadow-[0_20px_40px_rgba(200,161,180,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(200,161,180,0.42)] disabled:translate-y-0 disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send"}
              </button>
            </div>
            {sendError ? (
              <p className="rounded-[1.5rem] border border-[#D97373]/35 bg-[#FFF5F4] px-4 py-2 text-xs text-[#5C2E2E]">
                {sendError}
              </p>
            ) : null}
          </div>
        </>
      )}
    </motion.section>
  );
}
