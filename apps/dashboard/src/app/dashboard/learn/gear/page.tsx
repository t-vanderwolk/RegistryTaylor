// src/app/dashboard/learn/gear/page.tsx

import Link from "next/link";
import Image from "next/image";
import ACADEMY_MODULES from "@/data/academyModules.json" assert { type: "json" };

export const metadata = {
  title: "Gear Journey · Taylor-Made Baby Academy",
  description:
    "Master essential baby gear with confidence — from stroller systems to travel safety and beyond. Explore every step of the Gear Journey.",
};

export default function GearJourneyPage() {
  const gearModules = ACADEMY_MODULES.filter((m) => m.journey === "Gear");

  return (
    <div className="space-y-16">
      {/* --- HEADER --- */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
          Taylor-Made Baby Academy
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-[#3E2F35]">
          Gear Journey
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
          Learn how to select, test, and integrate essential baby gear into your
          daily routine. Each module brings you closer to mastering travel,
          feeding, and safety solutions that fit your lifestyle perfectly.
        </p>
      </section>

      {/* --- MODULE GRID --- */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {gearModules.map((module) => (
          <article
            key={module.id}
            className="group overflow-hidden rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white/95 shadow-[0_10px_40px_rgba(200,161,180,0.15)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(200,161,180,0.25)]"
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
              <p className="text-xs uppercase tracking-[0.25em] text-[#C8A1B4]/80">
                Gear Journey
              </p>
              <h3 className="font-[var(--font-playfair)] text-lg text-[#3E2F35]">
                {module.title}
              </h3>
              <p className="text-sm text-[#3E2F35]/70">{module.subtitle}</p>

              <div className="pt-3 border-t border-[#C8A1B4]/20">
                <p className="text-xs text-[#3E2F35]/60">
                  ⏱ {module.estimatedMinutes} min ·{" "}
                  {module.registryFocus || "Gear Essentials"}
                </p>
              </div>

              <Link
                href={`/academy/${module.slug}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#C8A1B4]/25"
              >
                Explore Module →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="text-center rounded-[3rem] bg-gradient-to-r from-[#C8A1B4]/60 via-[#FFFAF8]/80 to-[#D9C48E]/40 p-12 shadow-[0_20px_55px_rgba(200,161,180,0.15)]">
        <h3 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
          Gear Up With Confidence
        </h3>
        <p className="mt-3 text-sm text-[#3E2F35]/70 max-w-2xl mx-auto">
          These modules help you decode the gear world — so you can make smart,
          safe, and stylish choices for your family. From car seats to carriers,
          your mentor’s guidance ensures every decision fits your lifestyle.
        </p>
        <Link
          href="/dashboard/learn"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_30px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(200,161,180,0.35)]"
        >
          ← Back to Learn
        </Link>
      </section>
    </div>
  );
}
