export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireUser } from "@/lib/auth";
import CommunityHighlights from "@/components/dashboard/CommunityHighlights";

export default async function CommunityPage() {
  const user = await requireUser();

  return (
    <div className="space-y-8">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Community</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">
          Welcome back, {user.name ?? user.email}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Catch up on salon invites, forum highlights, and support activity in one place.
        </p>
      </section>

      <CommunityHighlights />
    </div>
  );
}
