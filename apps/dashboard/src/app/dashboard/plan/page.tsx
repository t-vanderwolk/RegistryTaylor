import type { Metadata } from "next";
import { requireMember } from "@/lib/auth";
import PlanHub from "./PlanHub";

export const metadata: Metadata = {
  title: "Plan & Registry Hub",
  description: "Merge concierge planning milestones with your bespoke registry in one village view.",
};

export default async function PlanPage() {
  const user = await requireMember();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Plan &amp; Registry</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Village hub for your bespoke baby plan
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Flow between milestones, mentor notes, and curated registry pieces in one place. Sync feeds, add keepsakes,
          and celebrate every concierge-crafted moment.
        </p>
      </section>

      <PlanHub userId={user.id} userName={user.name ?? user.email ?? null} />
    </div>
  );
}
