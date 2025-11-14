import { requireMember } from "@/lib/auth";

const JOURNAL_PROMPTS = [
  {
    id: "nursery-nesting",
    title: "Nesting energy check",
    prompt:
      "Describe what ‘nesting’ looks like for you right now. Are you deep-cleaning the silverware drawer or buying 14 identical swaddles… just in case?",
  },
  {
    id: "imagine-first-night",
    title: "Picture the first night home",
    prompt:
      "Close your eyes and imagine your first night with baby. What do you hear, smell, or hope to feel in that moment?",
  },
  {
    id: "advice-filter",
    title: "Unsolicited advice filter",
    prompt:
      "What’s the best (or funniest) piece of advice you’ve heard so far — and which ones are you kindly ignoring?",
  },
  {
    id: "partner-moments",
    title: "Little partner moments",
    prompt:
      "How is your partner or support person showing up for you right now? Write down a small gesture that made you feel seen or loved.",
  },
  {
    id: "future-self",
    title: "Note to future you",
    prompt:
      "Write a short letter to your post-baby self. What do you want her to remember when everything feels a little wild?",
  },
];

const RECENT_REFLECTIONS = [
  {
    id: "reflection-1",
    module: "Nursery Vision",
    timestamp: "Yesterday · 9:45 PM",
    highlight:
      "Hung the mobile today — stared at it for ten minutes imagining her tiny eyes following it. Immediate tears.",
  },
  {
    id: "reflection-2",
    module: "Baby Shower Brainstorm",
    timestamp: "Monday · 6:10 PM",
    highlight:
      "Discovered you can rent a chocolate fountain for $40. Honestly… tempting.",
  },
];

const WEEKLY_MOODS = [
  { day: "Mon", mood: "😊" },
  { day: "Tue", mood: "😴" },
  { day: "Wed", mood: "💪" },
  { day: "Thu", mood: "🤰" },
  { day: "Fri", mood: "🥰" },
  { day: "Sat", mood: "🛋️" },
  { day: "Sun", mood: "☕" },
];

export const metadata = {
  title: "Journal",
  description: "A pre-baby reflection space — calm, funny, honest, and beautifully real.",
};

export default async function JournalPage() {
  await requireMember();

  return (
    <div className="space-y-6 text-charcoal-600 md:space-y-8">
      {/* Header */}
      <section className="rounded-[1.75rem] border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">
          Pre-Baby Journal
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-charcoal-700">
          Reflect, laugh, and daydream
        </h1>
        <p className="mt-2 text-sm leading-snug text-charcoal-500">
          These little reflections are for the in-between moments — when you’re
          waiting, planning, over-googling, and feeling it all.
        </p>
        <p className="mt-2 text-xs text-charcoal-400">
          Academy workbook prompts stay inside each learning module—this Member Journal is your separate, personal space.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.6fr,0.4fr] md:gap-8">
        <div className="space-y-5">
          {/* Mood Selector */}
          <div className="rounded-[1.5rem] border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">
              Today’s Mood
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["😊 Peaceful", "🤰 Glowing (sort of)", "😴 Sleepy", "🌀 Nesting mode", "🥺 Sentimental"].map(
                (mood) => (
                  <button
                    key={mood}
                    type="button"
                    className="rounded-full border border-mauve-200/60 bg-white/90 px-3 py-1.5 text-sm text-charcoal-700 hover:bg-blush-100/70 transition"
                  >
                    {mood}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Prompts */}
          <div className="rounded-[1.5rem] border border-mauve-200/60 bg-gradient-to-br from-ivory via-white to-blush-100/70 p-5 shadow-mauve-card">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">
              Today’s Prompts
            </p>
            <div className="mt-3 space-y-3">
              {JOURNAL_PROMPTS.map((prompt) => (
                <article
                  key={prompt.id}
                  className="rounded-[1.25rem] bg-white/85 p-4 shadow-inner"
                >
                  <div className="flex items-center justify-between gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500/80">
                    <span>Reflection</span>
                    <span>Save draft</span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-charcoal-700">
                    {prompt.title}
                  </h2>
                  <p className="mt-1 text-sm text-charcoal-500">
                    {prompt.prompt}
                  </p>
                  <textarea
                    className="mt-3 h-24 w-full resize-none rounded-[1rem] border border-mauve-200/60 bg-white/95 p-3 text-sm text-charcoal-700 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40"
                    placeholder="Write your thoughts, dreams, or snack cravings…"
                  />
                </article>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tm-rose px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tm-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-tm-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tm-focus"
            >
              Save reflections
            </button>
          </div>

          {/* Highlights */}
          <div className="rounded-[1.5rem] border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">
              Recent Highlights
            </p>
            <div className="mt-3 space-y-3">
              {RECENT_REFLECTIONS.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[1.25rem] border border-mauve-200/40 bg-white/90 p-4"
                >
                  <div className="flex items-center justify-between gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500/80">
                    <span>{entry.module}</span>
                    <span className="text-charcoal-400">{entry.timestamp}</span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-charcoal-500">
                    {entry.highlight}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-5">
          {/* Mood Tracker */}
          <div className="rounded-[1.5rem] border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card">
            <h2 className="text-lg font-semibold tracking-tight text-charcoal-700">
              Your Week in Vibes
            </h2>
            <p className="mt-2 text-sm leading-snug text-charcoal-500">
              You’ve logged 4 calm days, 2 sleepy days, and one full nesting
              rampage. Balance, right?
            </p>
            <div className="mt-4 flex justify-between text-2xl">
              {WEEKLY_MOODS.map((day) => (
                <div key={day.day} className="flex flex-col items-center">
                  <span>{day.mood}</span>
                  <span className="mt-1 text-xs text-charcoal-400">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions / Voice Memo */}
          <div className="rounded-[1.5rem] border border-mauve-200/60 bg-gradient-to-br from-ivory via-white to-blush-100 p-5 shadow-mauve-card">
            <h2 className="text-lg font-semibold tracking-tight text-charcoal-700">
              Record a quick thought
            </h2>
            <p className="mt-2 text-sm leading-snug text-charcoal-500">
              Capture that random 3 AM thought — baby name idea or snack craving
              welcome. You’ll thank yourself later.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-mauve-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal-700 transition hover:-translate-y-0.5 hover:border-gold"
            >
              🎙️ Start recording
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
