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

const MENTOR_ACTIONS = [
  {
    id: "action-1",
    title: "Registry Review",
    detail: "Mentor will double-check your registry list tomorrow and suggest any missing ‘real-life’ essentials.",
    due: "Tomorrow",
  },
  {
    id: "action-2",
    title: "Community Coffee Chat",
    detail: "Friday’s Zoom at 10 AM — theme: ‘What nobody tells you about packing the hospital bag.’",
    due: "Friday",
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
    <div className="space-y-10">
      {/* Header */}
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
          Pre-Baby Journal
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Reflect, laugh, and daydream
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          These little reflections are for the in-between moments — when you’re
          waiting, planning, over-googling, and feeling it all.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.6fr,0.4fr]">
        <div className="space-y-6">
          {/* Mood Selector */}
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
              Today’s Mood
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["😊 Peaceful", "🤰 Glowing (sort of)", "😴 Sleepy", "🌀 Nesting mode", "🥺 Sentimental"].map(
                (mood) => (
                  <button
                    key={mood}
                    type="button"
                    className="rounded-full border border-[#C8A1B4]/40 bg-white/90 px-4 py-2 text-sm text-[#3E2F35] hover:bg-[#EAC9D1]/30 transition"
                  >
                    {mood}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Prompts */}
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
              Today’s Prompts
            </p>
            <div className="mt-4 space-y-4">
              {JOURNAL_PROMPTS.map((prompt) => (
                <article
                  key={prompt.id}
                  className="rounded-[1.75rem] bg-white/85 p-4 shadow-inner"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
                    <span>Reflection</span>
                    <span>Save draft</span>
                  </div>
                  <h2 className="mt-3 font-[var(--font-playfair)] text-lg text-[#3E2F35]">
                    {prompt.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#3E2F35]/70">
                    {prompt.prompt}
                  </p>
                  <textarea
                    className="mt-4 h-28 w-full resize-none rounded-[1.5rem] border border-[#C8A1B4]/40 bg-white/95 p-4 text-sm text-[#3E2F35] outline-none focus:border-[#D9C48E] focus:shadow-[0_0_0_3px_rgba(217,196,142,0.25)]"
                    placeholder="Write your thoughts, dreams, or snack cravings…"
                  />
                </article>
              ))}
            </div>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_30px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(200,161,180,0.4)]"
            >
              Save reflections
            </button>
          </div>

          {/* Highlights */}
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
              Recent Highlights
            </p>
            <div className="mt-4 space-y-4">
              {RECENT_REFLECTIONS.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-[1.75rem] border border-[#C8A1B4]/25 bg-white/90 p-4"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/75">
                    <span>{entry.module}</span>
                    <span className="text-[#3E2F35]/60">{entry.timestamp}</span>
                  </div>
                  <p className="mt-3 text-sm text-[#3E2F35]/70">
                    {entry.highlight}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Mood Tracker */}
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <h2 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
              Your Week in Vibes
            </h2>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              You’ve logged 4 calm days, 2 sleepy days, and one full nesting
              rampage. Balance, right?
            </p>
            <div className="mt-4 flex justify-between text-2xl">
              {WEEKLY_MOODS.map((day) => (
                <div key={day.day} className="flex flex-col items-center">
                  <span>{day.mood}</span>
                  <span className="mt-1 text-xs text-[#3E2F35]/60">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions / Voice Memo */}
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/40 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <h2 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
              Record a quick thought
            </h2>
            <p className="mt-3 text-sm text-[#3E2F35]/70">
              Capture that random 3 AM thought — baby name idea or snack craving
              welcome. You’ll thank yourself later.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              🎙️ Start recording
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}