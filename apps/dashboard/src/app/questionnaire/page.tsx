import type { Metadata } from "next";
import Link from "next/link";

type QuestionnairePageProps = {
  searchParams: {
    code?: string;
    role?: string;
  };
};

export const metadata: Metadata = {
  title: "Onboarding Questionnaire",
  description: "Share preferences so Taylor-Made can tailor your experience.",
};

const JOURNEY_OPTIONS = [
  "Nursery atmosphere",
  "Gear confidence",
  "Fourth trimester care",
  "Concierge support",
];

export default function QuestionnairePage({ searchParams }: QuestionnairePageProps) {
  const inviteCode = searchParams.code?.toUpperCase();
  const roleLabel = searchParams.role ? searchParams.role.replace(/^\w/, (char) => char.toUpperCase()) : "Member";

  return (
    <div className="mx-auto max-w-4xl space-y-8 rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-10 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <header className="space-y-3 text-[#3E2F35]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Questionnaire</p>
        <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl">Let’s tailor your {roleLabel.toLowerCase()} flow</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Answer a few prompts so our concierge team can personalize modules, registry picks, and mentor touchpoints.
        </p>
      </header>

      <form action="/create-profile" method="get" className="space-y-6">
        <input type="hidden" name="code" value={inviteCode ?? ""} />
        <input type="hidden" name="role" value={roleLabel.toLowerCase()} />

        <section className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-inner">
          <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Family snapshot</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Preferred name</span>
              <input
                type="text"
                name="preferredName"
                required
                placeholder="Taylor"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Due date</span>
              <input
                type="date"
                name="dueDate"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Household notes</span>
              <textarea
                name="householdNotes"
                rows={3}
                placeholder="Share names, pets, or favorite rituals we should know about."
                className="w-full resize-none rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-inner">
          <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Where do you want extra support?</h2>
          <p className="mt-2 text-sm text-[#3E2F35]/70">
            Select the journeys you want concierge energy focused on during the first month.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {JOURNEY_OPTIONS.map((option) => (
              <label
                key={option}
                className="group flex items-center gap-3 rounded-[1.75rem] border border-[#C8A1B4]/30 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/20 px-4 py-3 text-sm text-[#3E2F35]/75 transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
              >
                <input
                  type="checkbox"
                  name="journeys"
                  value={option}
                  className="h-5 w-5 rounded border-[#C8A1B4]/50 text-[#C8A1B4] focus:ring-[#D9C48E]"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/35 p-6 shadow-inner">
          <h2 className="font-[var(--font-playfair)] text-xl text-[#3E2F35]">Communication vibes</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">How should we reach you?</span>
              <select
                name="contactPreference"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              >
                <option>Email + dashboard</option>
                <option>SMS nudges</option>
                <option>Mentor calls</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-[#3E2F35]/70">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">Preferred mentor availability</span>
              <select
                name="availability"
                className="w-full rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
              >
                <option>Weekday mornings</option>
                <option>Evenings</option>
                <option>Weekend circle</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#3E2F35]/60">
            {inviteCode ? (
              <span>
                Invite code <strong className="font-mono text-[#3E2F35]">{inviteCode}</strong> verified.
              </span>
            ) : (
              <span>
                No invite code?{" "}
                <Link href="/request-invite" className="font-semibold text-[#C8A1B4] underline underline-offset-4">
                  Request one here
                </Link>
                .
              </span>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.4)]"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
