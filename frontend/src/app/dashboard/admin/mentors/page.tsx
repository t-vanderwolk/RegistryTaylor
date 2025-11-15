import { requireAdmin } from "@/lib/auth";

const MENTORS = [
  {
    id: "mia",
    name: "Mia Collins",
    specialty: "Nursery Atelier",
    mentees: 18,
    satisfaction: "4.9",
    status: "Active",
  },
  {
    id: "jordan",
    name: "Jordan Price",
    specialty: "Registry Strategy",
    mentees: 16,
    satisfaction: "4.8",
    status: "Active",
  },
  {
    id: "lola",
    name: "Lola Mercado",
    specialty: "Postpartum Doula",
    mentees: 14,
    satisfaction: "5.0",
    status: "Circle Lead",
  },
  {
    id: "asher",
    name: "Asher Beale",
    specialty: "Concierge Operations",
    mentees: 10,
    satisfaction: "4.7",
    status: "Onboarding",
  },
];

export const metadata = {
  title: "Admin · Mentors",
  description: "Manage mentor staffing and concierge coverage.",
};

export default async function AdminMentorsPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentor Team</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Coverage overview</h1>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              Align availability across journeys, track satisfaction, and coordinate hiring.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Export roster
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
            >
              Add mentor
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {MENTORS.map((mentor) => (
          <article
            key={mentor.id}
            className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(200,161,180,0.22)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">{mentor.name}</h2>
                <p className="text-sm text-[#3E2F35]/70">{mentor.specialty}</p>
              </div>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">
                {mentor.status}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4 text-center text-sm text-[#3E2F35]/75">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentees</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#3E2F35]">{mentor.mentees}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Satisfaction</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#3E2F35]">{mentor.satisfaction}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Coverage</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#3E2F35]">{Math.ceil(mentor.mentees / 3)} cohorts</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-tm-rose px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
              >
                Adjust load
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
              >
                View profile →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
