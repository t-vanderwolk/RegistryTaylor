import Link from "next/link";
import {
  getJourneys,
  getTracks,
  getModules,
  getRegistry,
} from "../../../lib/api";
import { TMCard } from "../../../components/TMCard";

type AgendaItem = {
  journeyTitle: string;
  trackTitle: string;
  moduleCode: string;
  moduleTitle: string;
  moduleSubtitle?: string | null;
};

export default async function MentorPage() {
  const journeys = await getJourneys();

  const journeyTracks = await Promise.all(
    journeys.map(async (journey) => {
      const tracks = await getTracks(journey.slug);
      return tracks.map((track) => ({ journey, track }));
    })
  );

  const flatTracks = journeyTracks.flat();

  const modulesByTrack = await Promise.all(
    flatTracks.map(async ({ journey, track }) => ({
      journey,
      track,
      modules: await getModules(track.slug),
    }))
  );

  const agenda: AgendaItem[] = [];
  modulesByTrack.forEach(({ journey, track, modules }) => {
    const pending = modules.find((module) => !module.completed);
    if (pending) {
      agenda.push({
        journeyTitle: journey.title,
        trackTitle: track.title,
        moduleCode: pending.code,
        moduleTitle: pending.title,
        moduleSubtitle: pending.subtitle,
      });
    }
  });

  const curatedAgenda = agenda.slice(0, 3);

  const registryItems = await getRegistry();
  const registryInsights = registryItems
    .filter((item) => item.status !== "removed" && item.product)
    .slice(0, 3);

  return (
    <div className="grid gap-10">
      <section className="overflow-hidden rounded-3xl bg-blush-gold px-6 py-10 shadow-soft md:px-12 md:py-12">
        <div className="space-y-4 text-center md:text-left">
          <p className="text-lg font-display text-tmMauve">Mentor Concierge</p>
          <h1 className="font-heading text-4xl text-tmCharcoal md:text-5xl">
            Prepare for your next mentor session with clarity.
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-tmCharcoal/75 md:text-base">
            Your mentor reviews Academy progress, registry activity, and community engagement before
            each touchpoint. Use this space to gather wins, roadblocks, and decisions you want to
            calibrate together.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TMCard
          title="Suggested Session Agenda"
          subtitle="Ground your mentor sync in the modules that matter most right now."
          className="bg-white/95 px-6 py-7"
        >
          <ul className="space-y-4">
            {curatedAgenda.length === 0 && (
              <li className="rounded-2xl border border-tmBlush/50 bg-tmIvory/80 p-4 text-sm text-tmCharcoal/70">
                You’re current across all tracked modules—celebrate the momentum and choose what feels
                expanding next.
              </li>
            )}
            {curatedAgenda.map((item) => (
              <li
                key={item.moduleCode}
                className="rounded-2xl border border-tmBlush/50 bg-tmIvory/80 p-4 text-sm text-tmCharcoal/80 shadow-inner"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                  {item.journeyTitle} · {item.trackTitle}
                </p>
                <p className="mt-1 font-heading text-lg text-tmCharcoal">
                  {item.moduleTitle}
                </p>
                {item.moduleSubtitle && (
                  <p className="mt-1 text-xs text-tmCharcoal/65">
                    {item.moduleSubtitle}
                  </p>
                )}
                <Link
                  href={`/dashboard/academy/modules/${item.moduleCode}`}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-tmMauve transition hover:text-tmGold"
                >
                  Open module →
                </Link>
              </li>
            ))}
          </ul>
        </TMCard>

        <TMCard
          title="Registry Insights to Review"
          subtitle="Align on curation, budget, and fulfillment before gifting conversations."
          className="bg-white/95 px-6 py-7"
        >
          <ul className="space-y-4">
            {registryInsights.length === 0 && (
              <li className="rounded-2xl border border-tmBlush/50 bg-tmIvory/80 p-4 text-sm text-tmCharcoal/70">
                No active registry items yet. Explore the Academy suggestions or browse the affiliate
                catalog to start curating together.
              </li>
            )}
            {registryInsights.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-tmBlush/50 bg-tmIvory/80 p-4 text-sm text-tmCharcoal/80 shadow-inner"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                  {item.product?.category?.replace(/_/g, " ")}
                </p>
                <p className="mt-1 font-heading text-lg text-tmCharcoal">
                  {item.product?.brand} · {item.product?.name}
                </p>
                <p className="mt-1 text-xs text-tmCharcoal/65">
                  Current status: <span className="font-semibold">{item.status}</span>
                </p>
                {item.mentor_notes && (
                  <p className="mt-2 rounded-xl bg-white/70 p-3 text-xs text-tmCharcoal/70">
                    Mentor note: {item.mentor_notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/registry"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-tmMauve transition hover:text-tmGold"
          >
            View full registry →
          </Link>
        </TMCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <TMCard
          title="Mentor Preparation Notes"
          subtitle="Capture questions, decisions, and emotional context before you meet."
          className="bg-white/95 px-6 py-7"
        >
          <div className="grid gap-3 text-sm text-tmCharcoal/75 md:grid-cols-2">
            <div className="rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                Progress Wins
              </p>
              <p className="mt-2">
                Celebrate what’s working—highlight moments from the past week that felt calm, confident,
                or creatively aligned.
              </p>
            </div>
            <div className="rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                Challenges
              </p>
              <p className="mt-2">
                Note any friction (budget, timing, emotional load) so your mentor can arrive ready
                with options.
              </p>
            </div>
            <div className="rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                Decisions Ahead
              </p>
              <p className="mt-2">
                Outline choices you want clarity on—furniture styles, registry swaps, or community
                introductions.
              </p>
            </div>
            <div className="rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
                Support Requests
              </p>
              <p className="mt-2">
                Think through the resources or templates that would lighten your load before your
                next session.
              </p>
            </div>
          </div>
        </TMCard>
        <TMCard
          title="Book or Message Your Mentor"
          subtitle="We respond within one business day."
          className="bg-white/95 px-6 py-7"
        >
          <p className="text-sm text-tmCharcoal/70">
            Share context ahead of time so we can arrive with curated ideas and aligned energy.
            Choose the channel that feels best for you right now.
          </p>
          <div className="mt-4 grid gap-3">
            <Link
              href="mailto:mentor@taylormadebaby.co"
              className="inline-flex items-center justify-center rounded-full border border-tmMauve/40 bg-tmBlush/60 px-4 py-2 text-sm font-semibold text-tmMauve transition hover:border-tmGold hover:text-tmGold"
            >
              Email your mentor concierge
            </Link>
            <Link
              href="/dashboard/community"
              className="inline-flex items-center justify-center rounded-full border border-tmMauve/40 bg-white px-4 py-2 text-sm font-semibold text-tmMauve transition hover:border-tmGold hover:text-tmGold"
            >
              Share in community →
            </Link>
          </div>
        </TMCard>
      </section>
    </div>
  );
}
