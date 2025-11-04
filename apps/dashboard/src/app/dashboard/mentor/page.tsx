import { requireMentor } from "@/lib/auth";

const DASHBOARD_METRICS = [
  { id: "active-mentees", label: "Active mentees", value: "12", detail: "+3 this month" },
  { id: "upcoming-sessions", label: "Sessions this week", value: "8", detail: "2 salon, 6 one-on-one" },
  { id: "registry-touches", label: "Registry updates", value: "19", detail: "5 awaiting review" },
];

const PRIORITY_ITEMS = [
  {
    id: "mentee-review",
    mentee: "Nyla Chen",
    focus: "Gear Journey · Module 02",
    action: "Review Nuna vs. Doona travel system notes and confirm next steps.",
  },
  {
    id: "journal-sync",
    mentee: "Imani Brooks",
    focus: "Postpartum Journey · Rituals",
    action: "Add tea + loungewear set to registry and schedule follow-up circle.",
  },
  {
    id: "salon-prep",
    mentee: "Taylor Circle",
    focus: "Nursery Atelier Salon",
    action: "Upload member mood board highlights and finalize inspiration deck.",
  },
];

export const metadata = {
  title: "Mentor Overview",
  description: "Command center for Taylor-Made mentors supporting their member cohorts.",
};

export default async function MentorOverviewPage() {
  const user = await requireMentor();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentor Studio</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Welcome back, {user.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Mentor"}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Track every member touchpoint at a glance. Registry actions, journal syncs, and salon events roll up here so you
          can deliver concierge-level guidance without juggling spreadsheets.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {DASHBOARD_METRICS.map((metric) => (
          <div
            key={metric.id}
            className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 text-center shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/70">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#3E2F35]">{metric.value}</p>
            <p className="mt-2 text-xs text-[#3E2F35]/65">{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Priority actions</p>
            <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Concierge follow-ups</h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
          >
            View all tasks →
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {PRIORITY_ITEMS.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-[#C8A1B4]/25 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/20 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
                <span>{item.mentee}</span>
                <span>{item.focus}</span>
              </div>
              <p className="mt-3 text-sm text-[#3E2F35]/75">{item.action}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_24px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(200,161,180,0.38)]"
                >
                  Mark complete
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                >
                  Open member profile →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
