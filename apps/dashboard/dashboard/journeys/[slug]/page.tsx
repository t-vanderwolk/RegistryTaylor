import Link from "next/link";
import { notFound } from "next/navigation";
import { getJourneys, getTracks } from "../../../../lib/api";
import { TMCard } from "../../../../components/TMCard";
import { cn } from "../../../../lib/utils";

export default async function JourneyPage({
  params,
}: {
  params: { slug: string };
}) {
  const journeys = await getJourneys();
  const journey = journeys.find((item) => item.slug === params.slug);
  if (!journey) {
    notFound();
  }

  const tracks = await getTracks(journey.slug);

  return (
    <div className="grid gap-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
          Journey
        </p>
        <h1 className="font-heading text-4xl text-tmCharcoal">{journey.title}</h1>
        <p className="max-w-2xl text-sm text-tmCharcoal/70">
          Each track deepens your Taylor-made foundation. Move through modules in order or drop into the topic that best supports your current phase—your progress stays synced across the Academy.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {tracks.map((track) => {
          const isComplete = track.totalModules > 0 && track.completedModules >= track.totalModules;
          const progressLabel = isComplete ? "Completed" : "In Progress";
          return (
            <TMCard
              key={track.id}
              title={track.title}
              subtitle={`${track.completedModules} of ${track.totalModules} modules`}
              className="bg-white/95 px-6 py-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                    isComplete
                      ? "bg-tmGold/70 text-tmCharcoal"
                      : "bg-tmBlush/60 text-tmMauve"
                  )}
                >
                  {isComplete ? "✓ Completed" : "• In progress"}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-tmMauve/70">
                  Track
                </span>
              </div>
              <Link
                href={`/dashboard/tracks/${track.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-tmMauve/50 bg-white px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold"
              >
                View Modules →
              </Link>
            </TMCard>
          );
        })}
      </div>
    </div>
  );
}
