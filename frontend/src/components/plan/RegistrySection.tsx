"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CategoryFilter from "./registry/CategoryFilter";
import RegistryItemCard from "./registry/RegistryItemCard";
import ConnectMyRegistryButton from "./registry/ConnectMyRegistryButton";
import ConnectBabylistButton from "./registry/ConnectBabylistButton";
import SilverCrossBannerSet from "@/components/affiliate/SilverCrossBannerSet";
import { getRegistrySourceMeta } from "@/lib/registryMeta";
import type { RegistryCategory, RegistryItem, RegistrySource } from "@/types/plan";

type RegistrySectionProps = {
  userId: string;
  userName?: string | null;
  initialItems: RegistryItem[];
  metaSources: RegistrySource[];
  onRefresh: () => Promise<unknown>;
  onSaveNote: (_productId: string, _note: string) => Promise<void>;
  savingNoteId: string | null;
};

type RegistryApiResponse = {
  items: RegistryItem[];
};

const DEFAULT_SOURCES: RegistrySource[] = ["macro", "silvercross", "awin", "cj", "myregistry", "babylist"];

export default function RegistrySection({
  userId,
  userName,
  initialItems,
  metaSources,
  onRefresh,
  onSaveNote,
  savingNoteId,
}: RegistrySectionProps) {
  const [items, setItems] = useState<RegistryItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<RegistryCategory | null>(null);
  const [activeSources, setActiveSources] = useState<RegistrySource[]>(
    metaSources.length ? metaSources : DEFAULT_SOURCES
  );
  const statusTimeout = useRef<number | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (metaSources.length) {
      setActiveSources(metaSources);
    }
  }, [metaSources]);

  useEffect(() => {
    return () => {
      if (statusTimeout.current) {
        window.clearTimeout(statusTimeout.current);
      }
    };
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
        credentials: "include",
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
  }, [loadRegistry]);

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

  const handleBabylistShortcut = useCallback(() => {
    setActiveSources((prev) => {
      if (prev.length === 1 && prev[0] === "babylist") {
        return DEFAULT_SOURCES;
      }
      return ["babylist"];
    });
    setActiveCategory(null);
  }, []);

  const greetingName = useMemo(() => userName?.split(" ")[0] ?? "Member", [userName]);
  const displayedItems = items;
  const allSourcesActive = activeSources.length === DEFAULT_SOURCES.length;
  const babylistOnlyActive = !activeCategory && activeSources.length === 1 && activeSources[0] === "babylist";

  const handleRefresh = async (message: string) => {
    announceStatus(message);
    await onRefresh();
    await loadRegistry();
  };

  return (
    <section className="space-y-5 rounded-[1.5rem] border border-[#C8A1B4]/35 bg-white/95 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]">
      <header className="space-y-2 border-b border-[#C8A1B4]/30 pb-4">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Registry</p>
        <h2 className="text-xl font-semibold tracking-tight text-[#3E2F35]">My registry</h2>
        <p className="text-sm leading-snug text-[#3E2F35]/70">
          {greetingName}, your concierge-curated picks update as you complete modules and add mentor notes.
        </p>
        <Link
          href="/dashboard/member"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]"
        >
          ← Home
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <ConnectMyRegistryButton
          onSynced={() => {
            void handleRefresh("MyRegistry items synced.");
          }}
        />

        <ConnectBabylistButton
          onSynced={() => {
            void handleRefresh("Babylist registry synced.");
          }}
        />
      </div>

      <SilverCrossBannerSet />

      <div className="space-y-3">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          babylistActive={babylistOnlyActive}
          onToggleBabylist={handleBabylistShortcut}
        />
        <div className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto pb-1">
          {DEFAULT_SOURCES.map((source) => {
            const isActive = activeSources.includes(source);
            const meta = getRegistrySourceMeta(source);
            return (
              <button
                key={source}
                type="button"
                onClick={() => handleSourceToggle(source)}
                className={`inline-flex min-w-[6.5rem] snap-center items-center gap-1 rounded-full border px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] transition ${
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
            className="inline-flex items-center gap-1 rounded-full border border-[#C8A1B4] px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset Sources
          </button>
        </div>
      </div>

      {status ? (
        <div className="rounded-2xl border border-[#C8A1B4]/40 bg-[#FFFAF8] p-3 text-sm text-[#3E2F35] shadow-sm">
          {status}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-[#D97373]/40 bg-[#FFF5F4] p-3 text-sm text-[#5C2E2E] shadow-sm">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="h-56 animate-pulse rounded-[1.5rem] bg-[#EAC9D1]/20" />
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-[#C8A1B4]/60 bg-[#FFFAF8] p-6 text-center text-sm text-[#3E2F35]/70 shadow-sm">
          No registry items yet in <strong>{activeCategory ?? "any"}</strong>. Complete an academy module or ask your
          mentor for fresh recommendations.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedItems.map((item) => (
            <RegistryItemCard
              key={item.id}
              item={item}
              onSaveNote={onSaveNote}
              saving={savingNoteId === item.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
