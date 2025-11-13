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
    <section className="space-y-4">
      <div className="rounded-[1.5rem] border border-[#C8A1B4]/30 bg-white/95 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Concierge planning</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#3E2F35]">
          Milestones, mentor guidance, and custom keepsakes
        </h2>
        <p className="mt-2 text-sm leading-snug text-[#3E2F35]/70">
          Capture your next milestone, add personal treasures, and sync with concierge recommendations in one view.
        </p>
      </div>

      <RegistryPlanner items={items} catalog={catalog} onItemsChange={onItemsChange} onRefresh={onRefresh} />
    </section>
  );
}
