"use client";

export function ExploreCard({ explore }: { explore: string }) {
  return (
    <section className="rounded-3xl border border-tmBlush/60 bg-white/95 px-6 py-7 shadow-soft md:px-10 md:py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
        Explore
      </p>
      <p className="mt-3 text-base leading-relaxed text-tmCharcoal/85 md:text-lg">
        {explore}
      </p>
    </section>
  );
}
