import AnnouncementsPanel from "./AnnouncementsPanel";
import CommunityFeed from "./CommunityFeed";
import EventsList from "./EventsList";
import PollOfTheWeek from "./PollOfTheWeek";
import { getConnectContent } from "./data";
import { requireMember } from "@/lib/auth";

export const metadata = {
  title: "Connect",
  description: "Tap into the Taylor-Made community and curated event programming.",
};

export default async function ConnectPage() {
  await requireMember();
  const { announcements, feedPosts, events, poll } = await getConnectContent();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border border-[#C8A1B4]/40 bg-white/95 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Connect</p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-3xl text-[#3E2F35] sm:text-4xl">
          Community salons, announcements, and concierge support
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-[#3E2F35]/70">
          Browse weekly announcements, RSVP to upcoming salons, and drop reflections into the member feed without leaving
          your Taylor-made hub.
        </p>
      </section>

      <AnnouncementsPanel announcements={announcements} />

      <section className="grid gap-6 lg:grid-cols-[0.66fr,0.34fr]">
        <CommunityFeed posts={feedPosts} />
        <aside className="space-y-6">
          <EventsList events={events} />
          <div className="rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/90 p-6 shadow-[0_20px_50px_rgba(200,161,180,0.18)]">
            <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">Need concierge support?</h3>
            <p className="mt-3 text-sm text-[#3E2F35]/70">
              Drop questions for your mentor anytime. We curate responses during live sessions and send personalized
              follow-ups straight to your journal.
            </p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
            >
              Message concierge →
            </button>
          </div>
        </aside>
      </section>

      <PollOfTheWeek poll={poll} />
    </div>
  );
}
