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
    <div className="space-y-6 text-charcoal-600 md:space-y-8">
      <section className="rounded-2xl border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card md:rounded-[2rem] md:p-8">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">Plan &amp; Registry</p>
        <h1 className="mt-2 font-[var(--font-playfair)] text-3xl text-charcoal-700">
          Village hub for your bespoke baby plan
        </h1>
        <p className="mt-2 text-sm leading-snug text-charcoal-500">
          Flow between milestones, mentor notes, and curated registry pieces in one place. Sync feeds, add keepsakes, and
          celebrate every concierge-crafted moment.
        </p>
      </section>

      <PlanHub userId={user.id} userName={user.name ?? user.email ?? null} />
    </div>
  );
}
