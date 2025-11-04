// src/app/dashboard/learn/nursery/page.tsx

import Link from "next/link";
import Image from "next/image";
import ACADEMY_MODULES from "@/data/academyModules.json" assert { type: "json" };

export const metadata = {
  title: "Nursery Journey · Taylor-Made Baby Academy",
  description:
    "Design, organize, and nurture a peaceful nursery that supports your baby’s comfort and your calm. Explore each step in the Nursery Journey.",
};

export default function NurseryJourneyPage() {
  const nurseryModules = ACADEMY_MODULES.filter(
    (m) => m.journey === "Nursery"
  );

  return (
    <div className="space-y-16">
      {/* --- HEADER --- */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#EAC9D1]">
          Taylor-Made Baby Academy
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-[#3E2F35]">
          Nursery Journey
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
          This path turns your nursery dreams into a functional, soothing space.
          From vision boards to safety details, each module helps you prepare
          with intention and joy before baby arrives.
        </p>
      </section>

      {/* --- MODULE GRID --- */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {nurseryModules.map((module) => (
          <article
            key={module.id}
            className="group overflow-hidden rounded-[2.5rem] border border-[#EAC9D1]/30 bg-white/95 shadow-[0_10px_40px_rgba(200,161,180,0.15)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(200,161,180,0.25)]"
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
              <p className="text-xs uppercase tracking-[0.25em] text-[#EAC9D1]/80">
                Nursery Journey
              </p>
              <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
                {module.title}
              </h3>
              <p className="text-sm text-[#3E2F35]/70">{module.subtitle}</p>

              <div className="pt-3 border-t border-[#EAC9D1]/20">
                <p className="text-xs text-[#3E2F35]/60">
                  ⏱ {module.estimatedMinutes} min ·{" "}
                  {module.registryFocus || "Nursery Essentials"}
                </p>
              </div>

              <Link
                href={`/academy/${module.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#EAC9D1]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/25"
              >
                Explore Module →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="text-center rounded-[3rem] bg-gradient-to-r from-[#EAC9D1]/60 via-[#FFFAF8]/80 to-[#D9C48E]/40 p-12 shadow-[0_20px_55px_rgba(200,161,180,0.15)]">
        <h3 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
          Your Nursery, Your Way
        </h3>
        <p className="mt-3 text-sm text-[#3E2F35]/70 max-w-2xl mx-auto">
          Whether you’re designing a cozy corner or a full dream nursery, these
          modules help you balance aesthetics and practicality. Save your ideas,
          sync with your mentor, and make your space baby-ready.
        </p>
        <Link
          href="/dashboard/learn"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EAC9D1] via-[#FFFAF8] to-[#D9C48E] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_30px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(200,161,180,0.35)]"
        >
          ← Back to Learn
        </Link>
      </section>
    </div>
  );
}
