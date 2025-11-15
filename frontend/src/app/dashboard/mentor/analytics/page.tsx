import { requireMentor } from "@/lib/auth";

const ANALYTICS_CARDS = [
  {
    id: "satisfaction",
    title: "Member satisfaction",
    metric: "4.9 / 5",
    detail: "Rolling 30-day mentor feedback",
  },
  {
    id: "module-progress",
    title: "Average module completion",
    metric: "82%",
    detail: "Across active mentees",
  },
  {
    id: "registry-conversions",
    title: "Registry conversions",
    metric: "74%",
    detail: "Items added after mentor recommendations",
  },
];

const TREND_LINES = [
  { id: "journey-progress", label: "Journey progress", value: "+18% vs. last month" },
  { id: "event-attendance", label: "Event attendance", value: "92% RSVP to show rate" },
  { id: "journal-engagement", label: "Journal engagement", value: "+12 concierge replies" },
];

export const metadata = {
  title: "Mentor Analytics",
  description: "Performance insights highlighting mentor impact across cohorts.",
};

export default async function MentorAnalyticsPage() {
  await requireMentor();

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Analytics</p>
        <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Mentor impact pulse</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
          Track how your guidance is resonating with members—from academy progress to registry conversions and
          concierge delight signals.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {ANALYTICS_CARDS.map((card) => (
          <div
            key={card.id}
            className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-[#3E2F35]">{card.metric}</p>
            <p className="mt-2 text-xs text-[#3E2F35]/65">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Momentum</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-xl text-[#3E2F35]">How your cohort is trending</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            Export insights
          </button>
        </div>
        <ul className="mt-6 space-y-4 text-sm text-[#3E2F35]/75">
          {TREND_LINES.map((trend) => (
            <li key={trend.id} className="rounded-[1.8rem] border border-[#C8A1B4]/20 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-semibold text-[#3E2F35]">{trend.label}</span>
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
                  {trend.value}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
