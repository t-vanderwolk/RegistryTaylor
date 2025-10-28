import { requireMember } from "@/lib/auth";

export const metadata = {
  title: "Registry Planner",
  description: "Curate a concierge-level registry with Taylor’s dynamic recommendations.",
};

export default async function PlanPage() {
  await requireMember();

  return (
    <div className="space-y-8 rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Dynamic Registry</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">Plan coming soon</h1>
      </div>
      <p className="text-sm text-[#3E2F35]/70">
        We are curating the full registry experience. Check back shortly for personalized item cards, MacroBaby affiliate
        links, and gifting coordination tools—everything a Taylor concierge uses behind the scenes.
      </p>
    </div>
  );
}
