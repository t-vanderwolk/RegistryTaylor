import { requireMember } from "@/lib/auth";

const JOURNAL_PROMPTS = [
  {
    id: "nursery-atmosphere",
    title: "Nursery atmosphere check-in",
    prompt:
      "Describe how you want to feel when you step into the nursery at 2 AM. What senses do you want to support?",
    journey: "Nursery Journey",
  },
  {
    id: "gear-confidence",
    title: "Gear confidence rating",
    prompt:
      "On a scale of 1-5, how confident do you feel about your travel system choice after today’s module? Capture any open questions.",
    journey: "Gear Journey",
  },
  {
    id: "rituals",
    title: "Fourth trimester rituals",
    prompt:
      "List three rituals or care practices you want to protect in the fourth trimester. Which support partners can help?",
    journey: "Postpartum Journey",
  },
];

const RECENT_REFLECTIONS = [
  {
    id: "reflection-1",
    module: "Nursery Atelier 01",
    timestamp: "Yesterday · 9:45 PM",
    highlight:
      "We want the nursery to signal calm at night with warm light, a rocking rhythm playlist, and hidden charging for devices.",
  },
  {
    id: "reflection-2",
    module: "Gear Confidence 02",
    timestamp: "Monday · 7:10 PM",
    highlight:
      "Leaning toward the Nuna TRVL LX for urban maneuverability—need mentor tips on rain cover storage and gate-check strategy.",
  },
];

const MENTOR_ACTIONS = [
  {
    id: "action-1",
    title: "Concierge follow-up",
    detail: "Jordan is sourcing three lighting options that balance circadian cues with midnight feeds.",
    due: "Due tomorrow",
  },
  {
    id: "action-2",
    title: "Registry alignment",
    detail: "Reviewed your stroller shortlist—added Nuna accessories pack with MacroBaby affiliate savings for gifting.",
    due: "Completed",
  },
];

export const metadata = {
  title: "Journal",
  description: "Capture reflections and concierge action items that guide your bespoke journey.",
};

export default async function JournalPage() {
  await requireMember();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Journal</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Reflect, calibrate, and brief your mentor
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Journal prompts steady your mindset after each module while concierge notes capture what your mentor is
          handling behind the scenes. Everything syncs with your registry and learning plan for a single source of truth.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.6fr,0.4fr]">
        <div className="space-y-6">
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Today’s Prompts</p>
            <div className="mt-4 space-y-4">
              {JOURNAL_PROMPTS.map((prompt) => (
                <article key={prompt.id} className="rounded-[1.75rem] bg-white/85 p-4 shadow-inner">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
                    <span>{prompt.journey}</span>
                    <span>Save draft</span>
                  </div>
                  <h2 className="mt-3 font-[var(--font-playfair)] text-lg text-[#3E2F35]">{prompt.title}</h2>
                  <p className="mt-2 text-sm text-[#3E2F35]/70">{prompt.prompt}</p>
                  <textarea
                    className="mt-4 h-28 w-full resize-none rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 p-4 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
                    placeholder="Capture your reflections…"
                  />
                </article>
              ))}
            </div>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.4)]"
            >
              Sync reflections with mentor
            </button>
          </div>

          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Recent Highlights</p>
            <div className="mt-4 space-y-4">
              {RECENT_REFLECTIONS.map((entry) => (
                <article key={entry.id} className="rounded-[1.75rem] border border-[#C8A1B4]/25 bg-white/90 p-4">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
                    <span>{entry.module}</span>
                    <span className="text-[#3E2F35]/60">{entry.timestamp}</span>
                  </div>
                  <p className="mt-3 text-sm text-[#3E2F35]/70">{entry.highlight}</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline underline-offset-4 transition hover:text-[#D9C48E]"
                  >
                    View full entry →
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Concierge Signals</p>
            <ul className="mt-4 space-y-4 text-sm text-[#3E2F35]/75">
              {MENTOR_ACTIONS.map((action) => (
                <li key={action.id} className="rounded-[1.75rem] border border-[#C8A1B4]/20 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">{action.due}</p>
                  <p className="mt-2 font-semibold text-[#3E2F35]">{action.title}</p>
                  <p className="mt-2 text-xs text-[#3E2F35]/70">{action.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/40 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <h2 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">Capture a voice memo</h2>
            <p className="mt-3 text-sm text-[#3E2F35]/70">
              Prefer to talk it out? Record a voice note and our concierge will transcribe highlights into your journal.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Start recording →
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
