// ✅ Only import metadata (not default)
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Learn · Taylor-Made Baby Academy",
  description:
    "Explore each Taylor-Made Baby Academy journey — Nursery, Gear, and Postpartum — to prepare with confidence and calm.",
};

// --- Main Categories ---
const JOURNEYS = [
  {
    id: "nursery",
    title: "Nursery Journey",
    description:
      "Design, organize, and nurture a peaceful space for baby and you — from vision to functionality.",
    color: "#EAC9D1",
    image: "/images/academy/nursery-vision.jpg",
    href: "/dashboard/learn/nursery",
  },
  {
    id: "gear",
    title: "Gear Journey",
    description:
      "Master essential baby gear with confidence — strollers, car seats, highchairs, and everything in between.",
    color: "#C8A1B4",
    image: "/images/academy/gear-stroller.jpg",
    href: "/dashboard/learn/gear",
  },
  {
    id: "postpartum",
    title: "Postpartum Journey",
    description:
      "Support your recovery, emotional wellness, and self-care as you transition into parenthood.",
    color: "#D9C48E",
    image: "/images/academy/postpartum-rest.jpg",
    href: "/dashboard/learn/postpartum",
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-16">
      {/* --- PAGE HEADER --- */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
          Taylor-Made Baby Academy
        </p>
        <h1 className="mt-3 font-[var(--font-playfair)] text-4xl text-[#3E2F35]">
          Learn · Prepare · Connect
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#3E2F35]/70">
          Your personal roadmap through pregnancy, gear planning, and postpartum
          wellness. Choose a journey below to begin your guided path with your
          mentor’s support.
        </p>
      </section>

      {/* --- JOURNEY CARDS --- */}
      <section className="grid gap-8 md:grid-cols-3">
        {JOURNEYS.map((journey) => (
          <article
            key={journey.id}
            className="group overflow-hidden rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white/95 shadow-[0_10px_40px_rgba(200,161,180,0.15)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(200,161,180,0.25)]"
          >
            {/* --- Hero Image --- */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={journey.image}
                alt={journey.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            {/* --- Text Content --- */}
            <div className="p-6 space-y-3">
              <h3
                className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]"
                style={{ color: journey.color }}
              >
                {journey.title}
              </h3>
              <p className="text-sm text-[#3E2F35]/70">{journey.description}</p>
              <Link
                href={journey.href}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#3E2F35] transition hover:bg-[#EAC9D1]/20"
              >
                View Modules →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="text-center rounded-[3rem] bg-gradient-to-r from-[#EAC9D1]/60 via-[#FFFAF8]/80 to-[#D9C48E]/40 p-12 shadow-[0_20px_55px_rgba(200,161,180,0.15)]">
        <h3 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">
          Continue Your Journey
        </h3>
        <p className="mt-3 text-sm text-[#3E2F35]/70">
          Your mentor will help you navigate each stage — from designing your nursery
          to embracing postpartum recovery. You’re already creating something
          beautiful.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_10px_30px_rgba(200,161,180,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(200,161,180,0.35)]"
        >
          Return to Dashboard
        </Link>
      </section>
    </div>
  );
}