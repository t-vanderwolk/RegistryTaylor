"use client";

import RegistryPlanner from "./RegistryPlanner";
import type { RegistryCatalogItem, RegistryItem } from "@/types/plan";

type PlanningSectionProps = {
  items: RegistryItem[];
  catalog: RegistryCatalogItem[];
  onItemsChange: (_items: RegistryItem[]) => void;
  onRefresh: () => Promise<unknown>;
};

export default function PlanningSection({ items, catalog, onItemsChange, onRefresh }: PlanningSectionProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white/95 p-6 shadow-[0_22px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Concierge Planning</p>
        <h2 className="mt-2 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">
          Milestones, mentor guidance, and custom keepsakes
        </h2>
        <p className="mt-3 text-sm text-[#3E2F35]/70">
          Capture your next milestone, add personal treasures, and sync with concierge recommendations in one view.
        </p>
      </div>

      <RegistryPlanner items={items} catalog={catalog} onItemsChange={onItemsChange} onRefresh={onRefresh} />
    </section>
  );
}
