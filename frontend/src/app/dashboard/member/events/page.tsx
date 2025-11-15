import EventsList from "../../connect/EventsList";
import { getConnectContent } from "../../connect/data";
import { requireMember } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Member Events",
  description: "RSVP to Taylor-Made salons, mentor sessions, and member-only gatherings.",
};

export default async function MemberEventsPage() {
  await requireMember();
  const { events, mentor } = await getConnectContent();

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-2xl border border-mauve-200/60 bg-white/95 p-5 shadow-mauve-card md:rounded-[2rem] md:p-8">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">Events</p>
        <h1 className="mt-2 font-[var(--font-playfair)] text-3xl text-charcoal-700">
          Salons + mentor sessions
        </h1>
        <p className="mt-2 text-sm leading-snug text-charcoal-500">
          Swipe through this week’s gatherings, RSVP in one tap, and keep mentor touchpoints close at hand.
        </p>
      </section>

      <EventsList events={events} />

      {mentor ? (
        <div className="rounded-2xl border border-mauve-200/60 bg-gradient-to-br from-ivory via-blush-100 to-white p-5 shadow-mauve-card">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-mauve-500">Mentor contact</p>
          <h2 className="mt-2 font-[var(--font-playfair)] text-2xl text-charcoal-700">Message {mentor.name ?? "your mentor"}</h2>
          <p className="mt-2 text-sm leading-snug text-charcoal-500">
            Need to adjust timing or request a private check-in? Open Messages to coordinate directly with your mentor team.
          </p>
        </div>
      ) : null}
    </div>
  );
}
