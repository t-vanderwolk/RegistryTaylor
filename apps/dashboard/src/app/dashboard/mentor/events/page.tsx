import { requireMentor } from "@/lib/auth";

const EVENTS = [
  {
    id: "salon",
    title: "Nursery Atelier Salon",
    datetime: "Tuesday · 11:00 AM ET",
    location: "Virtual · Gather Studio",
    attendees: 18,
    notes: "Spotlight Nyla’s lighting plan and collect palette swatches.",
  },
  {
    id: "gear-drop-in",
    title: "Gear Journey Drop-In",
    datetime: "Wednesday · 7:30 PM ET",
    location: "Zoom",
    attendees: 12,
    notes: "Feature Nuna TRVL vs. Uppababy Vista experience clips from members.",
  },
  {
    id: "circle",
    title: "Fourth Trimester Care Circle",
    datetime: "Sunday · 4:00 PM ET",
    location: "Virtual · Slow Studio",
    attendees: 15,
    notes: "Guided journaling with Lola, incorporate member breathwork playlist.",
  },
];

const TASKS = [
  {
    id: "prep-mia",
    title: "Send Mia the updated nursery inspiration deck",
    due: "Due tonight",
  },
  {
    id: "confirm-rsvp",
    title: "Confirm invites for Nuna product specialist",
    due: "Due tomorrow",
  },
  {
    id: "post-event",
    title: "Schedule 1:1 follow-ups for attendees with open registry questions",
    due: "After Gear Drop-In",
  },
];

export const metadata = {
  title: "Mentor Events",
  description: "Coordinate mentor salons, drop-ins, and circles in one place.",
};

export default async function MentorEventsPage() {
  await requireMentor();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Events</p>
            <h1 className="mt-2 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Community programming</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
              Run your salons with clarity—see attendee counts, prep notes, and concierge actions aligned to each event.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_25px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(200,161,180,0.4)]"
          >
            Create new event
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.6fr,0.4fr]">
        <div className="space-y-5">
          {EVENTS.map((event) => (
            <article
              key={event.id}
              className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/30 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
                <span>{event.datetime}</span>
                <span>{event.location}</span>
              </div>
              <h2 className="mt-3 font-[var(--font-playfair)] text-xl text-[#3E2F35]">{event.title}</h2>
              <p className="mt-3 text-sm text-[#3E2F35]/70">{event.notes}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#3E2F35]/60">
                <span className="rounded-full bg-white/90 px-3 py-1 font-semibold uppercase tracking-[0.3em]">
                  {event.attendees} RSVPs
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-3 py-1.5 font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                >
                  Manage
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-3 py-1.5 font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                >
                  Share agenda
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Action queue</p>
            <ul className="mt-4 space-y-4 text-sm text-[#3E2F35]/75">
              {TASKS.map((task) => (
                <li key={task.id} className="rounded-[1.75rem] border border-[#C8A1B4]/20 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/25 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/70">{task.due}</p>
                  <p className="mt-2 font-semibold text-[#3E2F35]">{task.title}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_25px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(200,161,180,0.4)]"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                    >
                      Reassign
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-gradient-to-br from-[#FFFAF8] via-white to-[#EAC9D1]/40 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <h2 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">Need concierge backup?</h2>
            <p className="mt-3 text-sm text-[#3E2F35]/70">
              Loop in the admin team to coordinate surprise-and-delight packages or guest mentor appearances.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Request support →
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
