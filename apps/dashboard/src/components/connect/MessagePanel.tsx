"use client";

import { useState } from "react";
import useSWR from "swr";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

const fetcher = async (url: string): Promise<Message[]> => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error ?? "Unable to load messages.");
  }
  return (await response.json()) as Message[];
};

type MessagePanelProps = {
  participantId: string;
};

export default function MessagePanel({ participantId }: MessagePanelProps) {
  const { data, mutate, error } = useSWR<Message[]>(
    participantId ? `/api/messages/${participantId}` : null,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messages = data ?? [];

  const handleSend = async () => {
    if (!text.trim() || pending) {
      return;
    }
    setPending(true);
    setSendError(null);
    const payload = {
      receiverId: participantId,
      content: text.trim(),
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.error ?? "Unable to send message.");
      }
      setText("");
      await mutate();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setPending(false);
    }
  };

  if (!participantId) {
    return (
      <div className="rounded-[2rem] border border-[#C8A1B4]/30 bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]/70">
        Select a mentor to begin messaging.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-[#C8A1B4]/30 bg-[#FFFAF8] p-4 shadow-[0_18px_40px_rgba(200,161,180,0.18)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentor Messages</p>
          <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">Private chat</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {error ? (
            <div className="rounded-2xl border border-[#D97373]/40 bg-[#FFF5F4] p-3 text-xs text-[#5C2E2E]">
              {error.message}
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#C8A1B4]/40 bg-white/80 p-3 text-sm text-[#3E2F35]/60">
              Start the conversation with your mentor. They’ll reply here.
            </div>
          ) : (
            messages.map((message) => {
              const isMentor = message.senderId === mentorId;
              return (
                <div
                  key={message.id}
                  className={`max-w-xs rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                    isMentor ? "bg-[#C8A1B4]/20 text-[#3E2F35]" : "ml-auto bg-[#EAC9D1] text-[#3E2F35]"
                  }`}
                >
                  {message.content}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-2xl border border-[#C8A1B4]/40 bg-white/90 px-3 py-2 text-sm text-[#3E2F35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A1B4]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={pending || !text.trim()}
          className="inline-flex items-center rounded-2xl bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#B98BA5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
      {sendError ? <p className="mt-2 text-xs text-[#9F3D3D]">{sendError}</p> : null}
    </div>
  );
}
