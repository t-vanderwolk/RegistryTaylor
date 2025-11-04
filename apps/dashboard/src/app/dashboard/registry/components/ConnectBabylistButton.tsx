"use client";

import { useState } from "react";
import type { RegistryItem } from "@/types/registry";

type ConnectBabylistButtonProps = {
  onSynced?: (_items: RegistryItem[]) => void;
};

export default function ConnectBabylistButton({ onSynced }: ConnectBabylistButtonProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSync = async () => {
    if (!username.trim()) {
      setMessage("Add your Babylist username to sync.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/babylist/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Unable to sync your Babylist registry right now.");
      }
      const payload = (await response.json()) as { items: RegistryItem[] };
      setMessage("Babylist registry imported.");
      onSynced?.(payload.items ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error syncing Babylist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[#C8A1B4]/40 bg-[#FFFAF8] p-5 shadow-[0_18px_36px_rgba(200,161,180,0.16)]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Babylist Sync</p>
          <h3 className="mt-1 font-[var(--font-playfair)] text-xl text-[#3E2F35]">Bring in your Babylist picks</h3>
          <p className="mt-1 text-sm text-[#3E2F35]/70">
            Import your Babylist registry so mentor notes and concierge curation stay unified.
          </p>
        </div>
      </header>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Babylist username"
          className="flex-1 rounded-full border border-[#C8A1B4]/40 bg-white px-4 py-2 text-sm text-[#3E2F35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A1B4]"
        />
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#3E2F35] px-5 py-2 text-sm font-semibold text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#C8A1B4] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Syncing…" : "Connect Babylist"}
        </button>
      </div>
      {message ? <p className="mt-3 text-xs text-[#3E2F35]/70">{message}</p> : null}
    </section>
  );
}
