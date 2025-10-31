import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { motion, useReducedMotion } from "framer-motion";

const PRIMARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(200,161,180,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b88ca3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]";

const SECONDARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C48E] bg-white/40 px-7 py-3 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_26px_rgba(217,196,142,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFFAF8]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C48E]";

const MOODBOARD_ITEMS = [
  {
    name: "Aurora Heirloom Bassinet",
    category: "Nursery",
    description: "Hand-woven natural rattan with silk canopy ties and organic cotton lining.",
    image: "/images/academy/nursery-vision.jpg",
    tone: "#F5E4EC",
  },
  {
    name: "Serene Sound Monitor",
    category: "Gear",
    description: "Crystal-clear audio with ambient lullaby library and ivory leather strap.",
    image: "/images/academy/gear-stroller.jpg",
    tone: "#F8EEE1",
  },
  {
    name: "Midnight Feeding Chair",
    category: "Living",
    description: "Swivel base, gentle recline, and stain-resistant bouclé upholstery.",
    image: "/images/academy/postpartum-rest.jpg",
    tone: "#ECE4F4",
  },
  {
    name: "Postpartum Ritual Set",
    category: "Wellness",
    description: "Herbal steam blends, silk eye mask, and gold-foiled gratitude prompts.",
    image: "/images/academy/postpartum-feeding.jpg",
    tone: "#F6E7EC",
  },
] as const;

const MENTOR_PICKS = [
  {
    mentor: "Eliza Hart",
    role: "Lead Nursery Stylist",
    highlight:
      "Pairs painted murals with concealed storage so every photo-ready moment is also practical. Loves sourcing heirloom mobiles.",
  },
  {
    mentor: "Dr. Taye Morgan",
    role: "Perinatal Psychologist",
    highlight:
      "Crafts sensory-prompts for partners and grandparents, aligning gifts with your nervous system’s needs.",
  },
  {
    mentor: "Maya Brooks",
    role: "Registry Concierge",
    highlight:
      "Negotiates limited-edition drops, manages shipping timelines, and keeps gratitude notes auto-drafted in your dashboard.",
  },
] as const;

export const metadata = {
  title: "Plan Your Registry with Taylor Concierge",
  description:
    "Experience a moodboard-style registry, mentor picks, and concierge coordination—curated in partnership with MacroBaby.",
};

export default function PlanPage() {
  const prefersReducedMotion = useReducedMotion();

  const heroMotion = prefersReducedMotion
    ? ({
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      } as const)
    : ({
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.26 },
      } as const);

  const fadeIn = (delay = 0) =>
    prefersReducedMotion
      ? ({
          initial: { opacity: 1, y: 0 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0 },
          viewport: { once: true, margin: "-15%" },
        } as const)
      : ({
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.24, delay },
          viewport: { once: true, margin: "-15%" },
        } as const);

  return (
    <div className="bg-[#FFFAF8] text-[#3E2F35]">
      <section className="relative overflow-hidden border-b border-[#D9C48E]/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF3E9] via-[#F6E8EF] to-[#FFFAF8]" />
        <div className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-6 py-24 text-center md:px-12 md:py-28 lg:items-start lg:text-left">
          <motion.div
            className="space-y-6 lg:max-w-3xl"
            initial={heroMotion.initial}
            animate={heroMotion.animate}
            transition={heroMotion.transition}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A1B4] shadow-[0_14px_30px_rgba(200,161,180,0.18)] backdrop-blur">
              Taylor Registry Concierge
            </p>
            <h1 className="font-serif text-[2.4rem] leading-tight text-[#3E2F35] sm:text-[3rem] lg:text-[3.35rem]">
              Moodboard-style planning with a concierge keeping every gift exquisite.
            </h1>
            <p className="text-base leading-relaxed text-[#3E2F35]/75 md:text-lg">
              Collaborate on a registry that feels like an editorial spread—complete with sourcing, delivery orchestration, and
              gratitude prompts handled by your mentor team.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href={"/request-invite" as Route} className={PRIMARY_CTA_CLASSES}>
                Request Invite
              </Link>
              <Link href={"/experience" as Route} className={SECONDARY_CTA_CLASSES}>
                Explore the Experience
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
              Curated in partnership with MacroBaby · Exclusive affiliate perks
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#D9C48E]/30 bg-[#FFFAF8]/85">
        <div className="mx-auto max-w-screen-xl space-y-10 px-6 py-20 md:px-12 md:py-24">
          <header className="space-y-3 text-center lg:text-left">
            <h2 className="font-serif text-3xl text-[#3E2F35] md:text-4xl">Your registry moodboard</h2>
            <p className="text-base text-[#3E2F35]/75 md:max-w-3xl">
              Each item is styled within your palette, annotated with mentor tips, and linked to concierge-managed fulfillment.
              Hover to glimpse the registry overlay.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-4">
            {MOODBOARD_ITEMS.map((item, index) => {
              const motionConfig = fadeIn(index * 0.04);
              return (
                <motion.article
                  key={item.name}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/70 shadow-[0_22px_46px_rgba(200,161,180,0.16)] backdrop-blur"
                  initial={motionConfig.initial}
                  whileInView={motionConfig.whileInView}
                  transition={motionConfig.transition}
                  viewport={motionConfig.viewport}
                >
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0" style={{ background: item.tone }} />
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-200 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2F35]/60 via-transparent to-transparent" />
                    <div className="absolute inset-x-6 bottom-4 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#3E2F35] shadow-[0_12px_22px_rgba(200,161,180,0.18)] backdrop-blur">
                      {item.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-[#3E2F35]/65 opacity-0 transition duration-200 group-hover:opacity-100">
                      <span className="rounded-full border border-white/40 bg-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white shadow-[0_12px_24px_rgba(200,161,180,0.25)] backdrop-blur">
                        View in Registry
                      </span>
                    </div>
                  </div>
                  <div className="relative space-y-3 p-6">
                    <h3 className="font-serif text-xl text-[#3E2F35]">{item.name}</h3>
                    <p className="text-sm leading-relaxed text-[#3E2F35]/75">{item.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D9C48E]/30 bg-white/70">
        <div className="mx-auto max-w-screen-xl px-6 py-20 md:px-12 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.45fr,0.55fr] lg:items-center">
            <motion.div
              className="space-y-5 rounded-[2.5rem] border border-white/45 bg-white/80 p-8 shadow-[0_22px_46px_rgba(217,196,142,0.16)] backdrop-blur"
              initial={fadeIn().initial}
              whileInView={fadeIn().whileInView}
              transition={fadeIn().transition}
              viewport={fadeIn().viewport}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Concierge Coordination</p>
              <h2 className="font-serif text-3xl text-[#3E2F35] md:text-4xl">Mentor picks & gifting choreography</h2>
              <p className="text-base text-[#3E2F35]/75">
                We design registry drops that delight your community—complete with suggested gift pairings, wrap inspiration,
                and ready-to-send gratitude notes.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-[#3E2F35]/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D9C48E]/50 bg-[#FFF3E4]/80 px-4 py-2">
                  ✧ Delivery orchestration
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D9C48E]/50 bg-[#FFF3E4]/80 px-4 py-2">
                  ✧ Gratitude tracking
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D9C48E]/50 bg-[#FFF3E4]/80 px-4 py-2">
                  ✧ Boutique sourcing
                </span>
              </div>
            </motion.div>
            <div className="space-y-6">
              {MENTOR_PICKS.map((pick, index) => {
                const motionConfig = fadeIn(index * 0.04);
                return (
                  <motion.article
                    key={pick.mentor}
                    className="rounded-[2.25rem] border border-white/45 bg-[#FFFAF8]/90 p-6 shadow-[0_18px_44px_rgba(200,161,180,0.14)] backdrop-blur"
                    initial={motionConfig.initial}
                    whileInView={motionConfig.whileInView}
                    transition={motionConfig.transition}
                    viewport={motionConfig.viewport}
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C8A1B4]">{pick.role}</p>
                      <h3 className="font-serif text-xl text-[#3E2F35]">{pick.mentor}</h3>
                      <p className="text-sm leading-relaxed text-[#3E2F35]/75">{pick.highlight}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF6F2]">
        <div className="mx-auto max-w-screen-md space-y-6 px-6 py-20 text-center md:px-12 md:py-24">
          <motion.h2
            className="font-serif text-3xl text-[#3E2F35] md:text-4xl"
            initial={fadeIn().initial}
            whileInView={fadeIn().whileInView}
            transition={fadeIn().transition}
            viewport={fadeIn().viewport}
          >
            Ready to see your Taylor registry moodboard?
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-[#3E2F35]/75"
            initial={fadeIn(0.04).initial}
            whileInView={fadeIn(0.04).whileInView}
            transition={fadeIn(0.04).transition}
            viewport={fadeIn(0.04).viewport}
          >
            Invite the concierge team to curate your editorial-worthy registry, coordinate gifting, and celebrate with MacroBaby
            exclusive perks.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-3 sm:flex-row"
            initial={fadeIn(0.08).initial}
            whileInView={fadeIn(0.08).whileInView}
            transition={fadeIn(0.08).transition}
            viewport={fadeIn(0.08).viewport}
          >
            <Link href={"/request-invite" as Route} className={PRIMARY_CTA_CLASSES}>
              Request Invite
            </Link>
            <Link href={"/community" as Route} className={SECONDARY_CTA_CLASSES}>
              Meet Your Mentors
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
