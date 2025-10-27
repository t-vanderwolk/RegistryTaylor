import Link from "next/link";
import { notFound } from "next/navigation";
import { getJourneys, getTracks, getModules } from "../../../../lib/api";
import { TMCard } from "../../../../components/TMCard";
import { cn } from "../../../../lib/utils";

export default async function TrackPage({
  params,
}: {
  params: { slug: string };
}) {
  const journeys = await getJourneys();
  let track = null;
  let journeyTitle = "";

  for (const journey of journeys) {
    const tracks = await getTracks(journey.slug);
    const match = tracks.find((item) => item.slug === params.slug);
    if (match) {
      track = match;
      journeyTitle = journey.title;
      break;
    }
  }

  if (!track) {
    notFound();
  }

  const modules = await getModules(track.slug);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
          {journeyTitle}
        </p>
        <h1 className="font-heading text-4xl text-tmCharcoal">{track.title}</h1>
        <p className="text-sm text-tmCharcoal/70">
          {track.completedModules} of {track.totalModules} modules complete
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {modules.map((module) => {
          const statusLabel = module.completed ? "Completed" : "In Progress";
          return (
            <TMCard
              key={module.id}
              title={module.title}
              subtitle={module.subtitle ?? undefined}
              className="bg-white/95 px-6 py-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-widest text-tmMauve/70">
                <span>Module {module.order_idx}</span>
                <span>{module.est_minutes} minutes</span>
              </div>
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                  module.completed
                    ? "bg-tmGold/70 text-tmCharcoal"
                    : "bg-tmBlush/60 text-tmMauve"
                )}
              >
                {module.completed ? "✓" : "•"} {statusLabel}
              </span>
              <Link
                href={`/dashboard/modules/${module.code}`}
                className="inline-flex items-center gap-2 rounded-full border border-tmMauve/50 bg-white px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold"
              >
                Open Module →
              </Link>
            </TMCard>
          );
        })}
      </div>
    </div>
  );
}
