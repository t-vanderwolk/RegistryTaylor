"use client";

import { useEffect, useState } from "react";
import type { RegistryItem } from "@/types/registry";

type ConnectMyRegistryButtonProps = {
  onSynced?: (items: RegistryItem[]) => void;
};

type ConnectionState = {
  connected: boolean;
  username?: string | null;
};

export default function ConnectMyRegistryButton({ onSynced }: ConnectMyRegistryButtonProps) {
  const [connection, setConnection] = useState<ConnectionState>({ connected: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const response = await fetch("/api/myregistry/connect", {
          cache: "no-store",
        });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as {
          connected: boolean;
          connection?: { username?: string };
        };
        if (isMounted) {
          setConnection({
            connected: data.connected,
            username: data.connection?.username ?? undefined,
          });
        }
      } catch {
        // ignore
      }
    };

    void checkConnection();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = `demo-token-${Date.now()}`;
      const username = "Taylor-Made Registry";

      const connectResponse = await fetch("/api/myregistry/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username }),
      });

      if (!connectResponse.ok) {
        throw new Error("Unable to connect MyRegistry right now.");
      }

      const syncResponse = await fetch("/api/myregistry/sync", { cache: "no-store" });
      if (!syncResponse.ok) {
        throw new Error("Connected, but sync failed. Try again shortly.");
      }

      const payload = (await syncResponse.json()) as { items: RegistryItem[] };
      setConnection({ connected: true, username });
      setMessage("MyRegistry connected. Latest items imported.");
      onSynced?.(payload.items);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to connect MyRegistry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#C8A1B4]/40 bg-[#FFFAF8] p-5 shadow-[0_18px_36px_rgba(200,161,180,0.16)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Universal Sync</p>
          <h3 className="mt-1 font-[var(--font-playfair)] text-xl text-[#3E2F35]">
            {connection.connected ? "MyRegistry Connected" : "Connect MyRegistry"}
          </h3>
          <p className="mt-1 text-sm text-[#3E2F35]/70">
            {connection.connected
              ? `Syncing with ${connection.username ?? "your MyRegistry account"}`
              : "Import existing wishes and keep mentor notes aligned across registries."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleConnect}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#3E2F35] px-5 py-2 text-sm font-semibold text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#C8A1B4] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Connecting…" : connection.connected ? "Refresh Sync" : "Connect MyRegistry"}
        </button>
      </div>
      {message ? <p className="mt-3 text-xs text-[#3E2F35]/70">{message}</p> : null}
    </div>
  );
}
