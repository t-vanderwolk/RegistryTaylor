import { requireAdmin } from "@/lib/auth";

const OVERVIEW_CARDS = [
  { id: "members", label: "Active members", value: "148", detail: "+12 this week" },
  { id: "mentors", label: "Active mentors", value: "9", detail: "2 onboarding" },
  { id: "registry-value", label: "Registry GMV (30d)", value: "$186k", detail: "+18% MoM" },
];

const OPERATIONS_FEED = [
  {
    id: "invite-approval",
    title: "Invite approvals pending",
    detail: "4 concierge invites awaiting review from mentoring team.",
    cta: "Review invites",
  },
  {
    id: "registry-health",
    title: "Registry sync",
    detail: "MacroBaby API latency detected—retry queued for 3 members.",
    cta: "Open status board",
  },
  {
    id: "mentor-hiring",
    title: "Mentor hiring pipeline",
    detail: "2 interviews scheduled this week. Finalize role templates and welcome kit.",
    cta: "View pipeline",
  },
];

export const metadata = {
  title: "Admin Overview",
  description: "Admin control center for Taylor-Made Baby Co.",
};

export default async function AdminOverviewPage() {
  const user = await requireAdmin();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Admin</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Hello, {user.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Stay ahead of operations across invites, mentor staffing, and registry health. Every concierge signal routes
          here so the full experience stays bespoke at scale.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {OVERVIEW_CARDS.map((card) => (
          <div
            key={card.id}
            className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#3E2F35]">{card.value}</p>
            <p className="mt-2 text-xs text-[#3E2F35]/65">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Operations queue</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">What needs attention</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            View workflows
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {OPERATIONS_FEED.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-[#C8A1B4]/20 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5"
            >
              <h3 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">{item.title}</h3>
              <p className="mt-2 text-sm text-[#3E2F35]/70">{item.detail}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]"
              >
                {item.cta} →
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
