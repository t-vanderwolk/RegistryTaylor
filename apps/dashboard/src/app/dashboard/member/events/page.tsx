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
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/35 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Events</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Upcoming salons, sessions, and curated gatherings
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          View the week’s salons, RSVP to hold your seat, and keep mentor touchpoints close at hand. Your concierge team updates this list in real time.
        </p>
      </section>

      <EventsList events={events} />

      {mentor ? (
        <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/90 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentor Contact</p>
          <h2 className="mt-3 font-[var(--font-playfair)] text-2xl text-[#3E2F35]">Message {mentor.name ?? "your mentor"}</h2>
          <p className="mt-3 text-sm text-[#3E2F35]/70">
            Need to adjust timing or request a private check-in? Open Messages to coordinate directly with your mentor team.
          </p>
        </div>
      ) : null}
    </div>
  );
}
