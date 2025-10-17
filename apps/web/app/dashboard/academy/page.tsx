import Link from "next/link";
import {
  getJourneys,
  getTracks,
  getModules,
} from "../../../lib/api";
import { ProgressRing } from "../../../components/ProgressRing";
import { TMCard } from "../../../components/TMCard";

export default async function AcademyOverviewPage() {
  const journeys = await getJourneys();

  const tracksByJourney = await Promise.all(
    journeys.map(async (journey) => ({
      journeySlug: journey.slug,
      tracks: await getTracks(journey.slug),
    }))
  );

  const flatTrackEntries = tracksByJourney.flatMap(({ tracks }) => tracks);
  const modulesByTrack = await Promise.all(
    flatTrackEntries.map(async (track) => ({
      track,
      modules: await getModules(track.slug),
    }))
  );

  let nextModule: {
    module: (typeof modulesByTrack)[number]["modules"][number];
    trackSlug: string;
  } | null = null;

  for (const { track, modules } of modulesByTrack) {
    const pending = modules.find((module) => !module.completed);
    if (pending) {
      nextModule = { module: pending, trackSlug: track.slug };
      break;
    }
  }

  if (!nextModule && modulesByTrack.length > 0) {
    const firstTrack = modulesByTrack[0];
    nextModule = {
      module: firstTrack.modules[0],
      trackSlug: firstTrack.track.slug,
    };
  }

  const continueHref = nextModule
    ? `/dashboard/academy/modules/${nextModule.module.code}`
    : "/dashboard/academy/journeys/nursery";

  return (
    <div className="grid gap-10">
      <section className="overflow-hidden rounded-3xl bg-mauve-blush px-6 py-10 text-center shadow-soft md:px-12 md:py-12">
        <p className="text-lg font-display text-tmMauve">
          Taylor-Made Baby Academy
        </p>
        <h1 className="mt-2 font-heading text-4xl text-tmCharcoal md:text-5xl">
          Curate your family’s journey with confidence
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-tmCharcoal/75 md:text-base">
          Everything you need—journeys, registry curation, and community
          wisdom—now lives inside one elegant dashboard. Track progress, pick up
          where you left off, and keep your vision aligned with every milestone.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {journeys.map((journey) => (
          <div
            key={journey.id}
            className="relative overflow-hidden rounded-2xl border border-tmBlush/60 bg-white/95 p-6 shadow-soft transition duration-200 ease-studio hover:-translate-y-1 hover:shadow-lifted"
          >
            <div className="absolute -top-12 right-6 h-24 w-24 rounded-full bg-tmBlush/35 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-10 translate-y-8 rounded-full bg-tmMauve/15 blur-3xl" />
            <div className="relative space-y-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tmBlush/70 font-heading text-xl text-tmMauve shadow-soft">
                {journey.title.substring(0, 1)}
              </span>
              <div className="space-y-2">
                <h2 className="font-heading text-2xl text-tmCharcoal">
                  {journey.title}
                </h2>
                <p className="text-sm text-tmCharcoal/65">
                  {journey.completedModules} of {journey.totalModules} modules
                  complete
                </p>
              </div>
              <ProgressRing
                label="Progress"
                value={journey.completedModules}
                total={journey.totalModules}
              />
              <Link
                href={`/dashboard/academy/journeys/${journey.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-tmMauve/50 bg-white px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold"
              >
                Explore Journey →
              </Link>
            </div>
          </div>
        ))}
      </section>

      <TMCard
        title="Continue Learning"
        subtitle="Pick up where you left off in the Academy."
        className="flex flex-col gap-8 bg-white/95 px-6 py-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex-1 space-y-3">
          <p className="max-w-xl text-sm text-tmCharcoal/70">
            Stay in flow with your personalized dashboard—your recent progress
            syncs across journeys, registry, and community.
          </p>
          {nextModule && (
            <div className="rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
                Next Module
              </p>
              <h3 className="font-heading text-2xl text-tmCharcoal">
                {nextModule.module.title}
              </h3>
              {nextModule.module.subtitle && (
                <p className="mt-2 text-sm text-tmCharcoal/70">
                  {nextModule.module.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-4">
          <Link
            href={continueHref}
            className="rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
          >
            Continue Learning
          </Link>
          <Link
            href="/dashboard/registry"
            className="text-sm font-semibold text-tmMauve transition hover:text-tmGold"
          >
            View Registry →
          </Link>
          <Link
            href="/dashboard/community"
            className="text-sm font-semibold text-tmMauve transition hover:text-tmGold"
          >
            Ask the Community →
          </Link>
        </div>
      </TMCard>

      <section className="grid gap-6 md:grid-cols-2">
        {journeys.map((journey) => (
          <TMCard
            key={journey.id}
            title={journey.title}
            subtitle={`${journey.completedModules} of ${journey.totalModules} modules complete`}
            className="bg-white/95 px-6 py-7"
          >
            <p className="text-sm text-tmCharcoal/70">
              Explore curated tracks built to guide you from the first planning
              spark to confident execution.
            </p>
            <Link
              href={`/dashboard/academy/journeys/${journey.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-tmMauve/50 bg-white px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold"
            >
              View Tracks →
            </Link>
          </TMCard>
        ))}
      </section>
    </div>
  );
}
