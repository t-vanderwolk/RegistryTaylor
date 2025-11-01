"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CategoryFilter from "./CategoryFilter";
import RegistryItemCard from "./RegistryItemCard";
import ConnectMyRegistryButton from "./ConnectMyRegistryButton";
import ConnectBabylistButton from "./ConnectBabylistButton";
import SilverCrossBannerSet from "@/components/affiliate/SilverCrossBannerSet";
import { getRegistrySourceMeta } from "@/lib/registryMeta";
import type { RegistryCategory, RegistryItem, RegistrySource } from "@/types/registry";

type RegistryDashboardProps = {
  userId: string;
  userName?: string | null;
};

type RegistryApiResponse = {
  items: RegistryItem[];
};

const DEFAULT_SOURCES: RegistrySource[] = ["macro", "silvercross", "awin", "cj", "myregistry", "babylist"];

export default function RegistryDashboard({ userId, userName }: RegistryDashboardProps) {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [savingNoteFor, setSavingNoteFor] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<RegistryCategory | null>(null);
  const [activeSources, setActiveSources] = useState<RegistrySource[]>(DEFAULT_SOURCES);
  const [refreshKey, setRefreshKey] = useState(0);
  const statusTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (statusTimeout.current) {
        window.clearTimeout(statusTimeout.current);
      }
    };
  }, []);

  const refreshRegistry = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const announceStatus = useCallback((message: string) => {
    setStatus(message);
    if (statusTimeout.current) {
      window.clearTimeout(statusTimeout.current);
    }
    statusTimeout.current = window.setTimeout(() => setStatus(null), 3200);
  }, []);

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeCategory) {
        params.set("category", activeCategory);
      }
      if (activeSources.length && activeSources.length !== DEFAULT_SOURCES.length) {
        params.set("source", activeSources.join(","));
      }
      params.set("userId", userId);

      const response = await fetch(`/api/registry?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Unable to load registry items right now.");
      }
      const payload = (await response.json()) as RegistryApiResponse;
      setItems(payload.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error loading registry.");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSources, userId]);

  useEffect(() => {
    void loadRegistry();
  }, [loadRegistry, refreshKey]);

  const displayedItems = items;

  const handleSourceToggle = useCallback((source: RegistrySource) => {
    setActiveSources((prev) => {
      if (prev.includes(source)) {
        const next = prev.filter((entry) => entry !== source);
        return next.length === 0 ? prev : next;
      }
      return [...prev, source];
    });
  }, []);

  const resetSources = useCallback(() => {
    setActiveSources(DEFAULT_SOURCES);
  }, []);

  const allSourcesActive = activeSources.length === DEFAULT_SOURCES.length;
  const babylistOnlyActive = !activeCategory && activeSources.length === 1 && activeSources[0] === "babylist";

  const handleBabylistShortcut = useCallback(() => {
    setActiveSources((prev) => {
      if (prev.length === 1 && prev[0] === "babylist") {
        return DEFAULT_SOURCES;
      }
      return ["babylist"];
    });
    setActiveCategory(null);
  }, []);

  const handleSaveNote = useCallback(
    async (productId: string, note: string) => {
      setSavingNoteFor(productId);
      setError(null);
      try {
        const response = await fetch("/api/registryNotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
            note,
          }),
        });

        if (!response.ok) {
          throw new Error("We couldn't save that note. Please try again.");
        }

        const data = (await response.json()) as { note: { note: string } | null };
        const nextNote = data?.note?.note ?? "";

        setItems((prev) =>
          prev.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  mentorNote: nextNote || null,
                }
              : item
          )
        );

        const message = nextNote ? "Mentor note saved." : "Mentor note cleared.";
        announceStatus(message);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save note right now.");
        throw err;
      } finally {
        setSavingNoteFor(null);
      }
    },
    [userId, announceStatus]
  );

  const greetingName = useMemo(() => userName?.split(" ")[0] ?? "Member", [userName]);

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8A1B4]/30 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Registry</p>
          <h1 className="mt-2 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">My Registry</h1>
          <p className="mt-1 text-sm text-[#3E2F35]/70">
            {greetingName}, your concierge-curated picks update as you complete modules, connect feeds, and add mentor notes.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8A1B4] hover:text-[#B98BA5]"
        >
          ← Dashboard Home
        </Link>
      </header>

      <ConnectMyRegistryButton
        onSynced={() => {
          announceStatus("MyRegistry items synced.");
          refreshRegistry();
        }}
      />

      <ConnectBabylistButton
        onSynced={() => {
          announceStatus("Babylist registry synced.");
          refreshRegistry();
        }}
      />

      <SilverCrossBannerSet />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          babylistActive={babylistOnlyActive}
          onToggleBabylist={handleBabylistShortcut}
        />
        <div className="flex flex-wrap items-center gap-2">
          {DEFAULT_SOURCES.map((source) => {
            const meta = getRegistrySourceMeta(source);
            const isActive = activeSources.includes(source);
            return (
              <button
                key={source}
                type="button"
                onClick={() => handleSourceToggle(source)}
                className={`inline-flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  isActive ? "border-[#3E2F35] bg-[#3E2F35] text-[#FFFAF8]" : "border-[#C8A1B4] text-[#3E2F35]"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={resetSources}
            disabled={allSourcesActive}
            className="inline-flex items-center gap-1 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset Sources
          </button>
        </div>
      </div>

      {status ? (
        <div className="rounded-3xl border border-[#C8A1B4]/40 bg-[#FFFAF8] p-4 text-sm text-[#3E2F35] shadow-sm">
          {status}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-[#D97373]/40 bg-[#FFF5F4] p-4 text-sm text-[#5C2E2E] shadow-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="h-64 animate-pulse rounded-[2.2rem] bg-[#EAC9D1]/20" />
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-[#C8A1B4]/60 bg-[#FFFAF8] p-10 text-center text-sm text-[#3E2F35]/70 shadow-sm">
          No registry items yet in <strong>{activeCategory ?? "any"}</strong>. Complete an academy module or ask your mentor
          for fresh recommendations.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((item) => (
            <RegistryItemCard
              key={item.id}
              item={item}
              onSaveNote={handleSaveNote}
              saving={savingNoteFor === item.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
