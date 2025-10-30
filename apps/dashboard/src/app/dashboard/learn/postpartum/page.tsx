// src/app/dashboard/learn/postpartum/page.tsx

import Link from "next/link";
import Image from "next/image";
import ACADEMY_MODULES from "@/data/academyModules.json" assert { type: "json" };

export const metadata = {
  title: "Postpartum Journey · Taylor-Made Baby Academy",
  description:
    "Honor your healing, connection, and transition into parenthood with grace. Explore the Postpartum Journey modules for real recovery and emotional wellness.",
};

export default function PostpartumJourneyPage() {
  const postpartumModules = ACADEMY_MODULES.filter(
    (m) => m.journey === "Postpartum"
  );

  return (
    <div className="space-y-16">
      {/* --- HEADER --- */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D9C48E]">
          Taylor-Made Baby Academy
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-[#3E2F35]">
          Postpartum Journey
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
          This journey focuses on your well-being as you recover, adjust, and
          rediscover balance. Learn how to nurture both your body and your
          emotions as you prepare for life with baby.
        </p>
      </section>

      {/* --- MODULE GRID --- */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {postpartumModules.map((module) => (
          <article
            key={module.id}
            className="group overflow-hidden rounded-[2.5rem] border border-[#D9C48E]/30 bg-white/95 shadow-[0_10px_40px_rgba(217,196,142,0.25)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(217,196,142,0.3)]"
          >
            {/* --- Hero Image --- */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={module.heroImage}
                alt={module.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            {/* --- Text Content --- */}
            <div className="p-6 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D9C48E]/80">
                Postpartum Journey
              </p>
              <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
                {module.title}
              </h3>
              <p className="text-sm text-[#3E2F35]/70">{module.subtitle}</p>

              <div className="pt-3 border-t border-[#D9C48E]/20">
                <p className="text-xs text-[#3E2F35]/60">
                  ⏱ {module.estimatedMinutes} min ·{" "}
                  {module.registryFocus || "Postpartum Essentials"}
                </p>
              </div>

              <Link
                href={`/dashboard/academy/modules/${module.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D9C48E]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#D9C48E]/25"
              >
                Explore Module →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="text-center rounded-[3rem] bg-gradient-to-r from-[#D9C48E]/60 via-[#FFFAF8]/80 to-[#EAC9D1]/40 p-12 shadow-[0_20px_55px_rgba(200,161,180,0.15)]">
        <h3 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
          Rest · Recover · Reconnect
        </h3>
        <p className="mt-3 text-sm text-[#3E2F35]/70 max-w-2xl mx-auto">
          These modules honor your body’s healing timeline and emotional journey.
          Learn to rebuild strength, nurture self-compassion, and embrace this
          new season of life at your own pace — no pressure, no perfection.
        </p>
        <Link
          href="/dashboard/learn"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D9C48E] via-[#FFFAF8] to-[#EAC9D1] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_30px_rgba(217,196,142,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(217,196,142,0.35)]"
        >
          ← Back to Learn
        </Link>
      </section>
    </div>
  );
}