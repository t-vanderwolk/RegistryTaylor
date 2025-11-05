"use client";

import { useCallback, useMemo, useState } from "react";
import PlanningSection from "@/components/plan/PlanningSection";
import RegistrySection from "@/components/plan/RegistrySection";
import usePlanData from "@/hooks/usePlanData";
import type { PlanData, RegistryItem, RegistryNote } from "@/types/plan";

type PlanHubProps = {
  userId: string;
  userName?: string | null;
};

function applyNoteToItems(items: RegistryItem[], productId: string, note: RegistryNote | null) {
  return items.map((item) =>
    item.id === productId
      ? {
          ...item,
          mentorNote: note?.note?.trim() ? note.note : null,
        }
      : item
  );
}

export default function PlanHub({ userId, userName }: PlanHubProps) {
  const { data, loading, error, refresh, mutate } = usePlanData();
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const planData: PlanData | null = useMemo(() => data ?? null, [data]);

  const handleItemsChange = useCallback(
    (items: RegistryItem[]) => {
      void mutate(
        (current) => {
          if (!current) {
            return current;
          }
          return {
            ...current,
            owned: items,
          };
        },
        false
      );
    },
    [mutate]
  );

  const handleSaveNote = useCallback(
    async (productId: string, note: string) => {
      setSavingNoteId(productId);
      try {
        const response = await fetch("/api/registryNotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId,
            note,
          }),
        });

        if (!response.ok) {
          const message = (await response.json())?.error ?? "Unable to save note.";
          throw new Error(message);
        }

        const payload = (await response.json()) as { note: RegistryNote | null };
        const entry = payload.note;

        await mutate(
          (current) => {
            if (!current) {
              return current;
            }
            const nextNotes = entry
              ? [...current.notes.filter((candidate) => candidate.productId !== productId), entry]
              : current.notes.filter((candidate) => candidate.productId !== productId);

            return {
              ...current,
              curated: applyNoteToItems(current.curated, productId, entry),
              owned: applyNoteToItems(current.owned, productId, entry),
              notes: nextNotes,
            };
          },
          false
        );

        await refresh();
      } finally {
        setSavingNoteId(null);
      }
    },
    [mutate, refresh, userId]
  );

  if (loading && !planData) {
    return (
      <div className="grid gap-8 lg:grid-cols-[0.5fr,0.5fr]">
        <div className="h-[28rem] animate-pulse rounded-[2.75rem] bg-[#EAC9D1]/20" />
        <div className="h-[28rem] animate-pulse rounded-[2.75rem] bg-[#EAC9D1]/20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2.5rem] border border-[#D97373]/40 bg-[#FFF5F4] p-8 text-sm text-[#5C2E2E] shadow-sm">
        {error.message}
      </div>
    );
  }

  if (!planData) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.48fr,0.52fr]">
      <PlanningSection items={planData.owned} catalog={planData.catalog} onItemsChange={handleItemsChange} onRefresh={refresh} />

      <RegistrySection
        userId={userId}
        userName={userName}
        initialItems={planData.curated}
        metaSources={planData.meta.sources}
        onRefresh={refresh}
        onSaveNote={handleSaveNote}
        savingNoteId={savingNoteId}
      />
    </div>
  );
}
