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
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-[#C8A1B4]/35 bg-white/95 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Events</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#3E2F35]">
          Salons + mentor sessions
        </h1>
        <p className="mt-2 text-sm leading-snug text-[#3E2F35]/70">
          Swipe through this week’s gatherings, RSVP in one tap, and keep mentor touchpoints close at hand.
        </p>
      </section>

      <EventsList events={events} />

      {mentor ? (
        <div className="rounded-[1.75rem] border border-[#C8A1B4]/35 bg-white/90 p-5 shadow-[0_18px_45px_rgba(200,161,180,0.18)]">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Mentor contact</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#3E2F35]">Message {mentor.name ?? "your mentor"}</h2>
          <p className="mt-2 text-sm leading-snug text-[#3E2F35]/70">
            Need to adjust timing or request a private check-in? Open Messages to coordinate directly with your mentor team.
          </p>
        </div>
      ) : null}
    </div>
  );
}
