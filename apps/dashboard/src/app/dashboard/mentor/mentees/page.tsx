import { requireMentor } from "@/lib/auth";

const MENTEES = [
  {
    id: "nyla",
    name: "Nyla Chen",
    journey: "Nursery Journey",
    stage: "Module 03 · Lighting Atelier",
    lastTouchpoint: "Yesterday",
    status: "Awaiting feedback",
  },
  {
    id: "imani",
    name: "Imani Brooks",
    journey: "Postpartum Journey",
    stage: "Circle 02 · Rituals",
    lastTouchpoint: "2 days ago",
    status: "Gifting prep",
  },
  {
    id: "leo",
    name: "Leo & Harper",
    journey: "Gear Journey",
    stage: "Module 04 · On-the-Go",
    lastTouchpoint: "Today",
    status: "Registry review",
  },
  {
    id: "sloane",
    name: "Sloane Rivera",
    journey: "Concierge",
    stage: "Custom nursery mood board",
    lastTouchpoint: "3 days ago",
    status: "Scheduling salon",
  },
];

export const metadata = {
  title: "Mentees",
  description: "Snapshot of every member you support with at-a-glance concierge signals.",
};

export default async function MentorMenteesPage() {
  await requireMentor();

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentees</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Member roster</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Filter journeys
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_25px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(200,161,180,0.4)]"
            >
              Add mentee
            </button>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <table className="min-w-full divide-y divide-[#C8A1B4]/30 text-sm text-[#3E2F35]">
          <thead className="bg-[#FFFAF8] text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/65">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">
                Member
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Journey focus
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Current stage
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Last touchpoint
              </th>
              <th scope="col" className="px-6 py-4 text-left">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C8A1B4]/20">
            {MENTEES.map((mentee) => (
              <tr key={mentee.id} className="transition hover:bg-[#FFFAF8]">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-semibold">{mentee.name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{mentee.journey}</td>
                <td className="whitespace-nowrap px-6 py-4">{mentee.stage}</td>
                <td className="whitespace-nowrap px-6 py-4">{mentee.lastTouchpoint}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-full bg-gradient-to-r from-[#C8A1B4]/15 via-[#EAC9D1]/25 to-[#FFFAF8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                    {mentee.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]">
                    Open profile →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
