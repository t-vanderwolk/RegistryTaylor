import Link from "next/link";
import type { Route } from "next";
import { motion, useReducedMotion } from "framer-motion";

const PRIMARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(200,161,180,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b88ca3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]";

const EXPERIENCE_STORIES = [
  {
    phase: "Learn",
    headline: "Savor cinematic lessons guided by stylists, doulas, and psychologists.",
    description:
      "Modules arrive in cadence with your trimester. Each includes a filmed lecture, downloadable atelier kit, and concierge prompts orchestrated to keep planning gentle.",
    details: ["Weekly capsules released at sunrise", "Live salons with intimate Q&A", "Mentor recap notes delivered next day"],
  },
  {
    phase: "Plan",
    headline: "Design your registry moodboard with concierge-managed gifting.",
    description:
      "Collaborate on curated lists, experience affiliate perks with MacroBaby, and enjoy gratitude prompts that keep every thank-you effortless and timely.",
    details: ["Moodboard approvals within 48 hours", "Delivery orchestration & returns", "Automatic gratitude tracking"],
  },
  {
    phase: "Connect",
    headline: "Enter candlelit salons and curated forums moderated by mentors.",
    description:
      "Private circles, micro-retreats, and seasonal pop-ups allow for meaningful connection—with every conversation thoughtfully guided.",
    details: ["Trimester & city circles", "Partner-friendly workshops", "Concierge-monitored forums"],
  },
  {
    phase: "Reflect",
    headline: "Archive every feeling inside the Taylor Journal, blurred and serene.",
    description:
      "Voice-to-text entries, mentor whispers, and printable keepsakes ensure your memories are preserved with softness and intention.",
    details: ["Guided nightly prompts", "Blurred previews for privacy", "Keepsake printing on request"],
  },
] as const;

export const metadata = {
  title: "The Taylor Experience",
  description:
    "Experience the Taylor-Made Baby Co. journey—Learn, Plan, Connect, Reflect—told through a luxurious scroll-story layout with concierge highlights.",
};

export default function ExperiencePage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F8] via-[#F3E9F2] to-[#FFFAF8]" />
        <div className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-6 py-24 text-center md:px-12 md:py-28 lg:items-start lg:text-left">
          <motion.div
            className="space-y-6 lg:max-w-3xl"
            initial={heroMotion.initial}
            animate={heroMotion.animate}
            transition={heroMotion.transition}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A1B4] shadow-[0_14px_30px_rgba(200,161,180,0.18)] backdrop-blur">
              The Taylor Experience
            </p>
            <h1 className="font-serif text-[2.4rem] leading-tight text-[#3E2F35] sm:text-[3rem] lg:text-[3.35rem]">
              A scroll-story of calm: Learn · Plan · Connect · Reflect.
            </h1>
            <p className="text-base leading-relaxed text-[#3E2F35]/75 md:text-lg">
              Journey through the concierge cadence that carries you from inspiration boards to postpartum bliss—with gold dividers,
              gentle motion, and every detail orchestrated for luxury.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href={"/request-invite" as Route} className={PRIMARY_CTA_CLASSES}>
                Request Invite
              </Link>
              <Link
                href={"/membership" as Route}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-white/40 px-7 py-3 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_26px_rgba(200,161,180,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFFAF8]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C48E]"
              >
                View Membership
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#D9C48E]/30 bg-[#FFFAF8]">
        <div className="mx-auto max-w-screen-xl px-6 py-20 md:px-12 md:py-24">
          <div className="relative">
            <span className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#D9C48E]/60 to-transparent md:block" />
            <div className="space-y-16">
              {EXPERIENCE_STORIES.map((story, index) => {
                const isEven = index % 2 === 0;
                const motionConfig = fadeIn(index * 0.05);
                return (
                  <motion.section
                    key={story.phase}
                    className={[
                      "relative flex flex-col gap-8 rounded-[3rem] border border-white/45 bg-white/75 p-8 shadow-[0_24px_50px_rgba(200,161,180,0.18)] backdrop-blur md:p-12",
                      isEven ? "md:ml-[8%] md:mr-[3%]" : "md:ml-[3%] md:mr-[8%]",
                    ].join(" ")}
                    initial={motionConfig.initial}
                    whileInView={motionConfig.whileInView}
                    transition={motionConfig.transition}
                    viewport={motionConfig.viewport}
                  >
                    <span className="absolute left-8 top-8 inline-flex items-center justify-center rounded-full border border-[#D9C48E]/60 bg-[#FFF4EA]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#D9C48E] shadow-[0_12px_24px_rgba(217,196,142,0.18)]">
                      {story.phase}
                    </span>
                    <div className="space-y-4 pt-12">
                      <h2 className="font-serif text-3xl text-[#3E2F35] md:text-[2.4rem]">{story.headline}</h2>
                      <p className="text-base leading-relaxed text-[#3E2F35]/75">{story.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-[#3E2F35]/70">
                        {story.details.map((detail) => (
                          <span
                            key={detail}
                            className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/50 bg-[#EAC9D1]/60 px-4 py-2 shadow-[0_12px_24px_rgba(200,161,180,0.18)]"
                          >
                            ✧ {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#D9C48E]/30 bg-white/70">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFAF8] via-[#F4EDF6] to-[#FFF4EA]" />
        <div className="relative mx-auto max-w-screen-xl px-6 py-20 md:px-12 md:py-24">
          <motion.div
            className="rounded-[3rem] border border-white/50 bg-white/80 p-10 text-center shadow-[0_26px_52px_rgba(200,161,180,0.18)] backdrop-blur md:p-14"
            initial={fadeIn().initial}
            whileInView={fadeIn().whileInView}
            transition={fadeIn().transition}
            viewport={fadeIn().viewport}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A1B4]">Concierge assurance</p>
            <h2 className="mt-4 font-serif text-3xl text-[#3E2F35] md:text-[2.6rem]">
              One invitation unlocks every facet of the Taylor experience.
            </h2>
            <p className="mt-4 text-base text-[#3E2F35]/75 md:max-w-3xl md:mx-auto">
              Learn, Plan, Connect, and Reflect are woven together by our mentor team. You move with intention while we hold the
              details—salons scheduled, registries updated, journal prompts queued.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={"/request-invite" as Route} className={PRIMARY_CTA_CLASSES}>
                Request Invite
              </Link>
              <Link
                href={"/community" as Route}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C48E] bg-white/40 px-7 py-3 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_26px_rgba(217,196,142,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFFAF8]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C48E]"
              >
                Meet the Mentors
              </Link>
            </div>
          </motion.div>
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
            Step into the Taylor experience.
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-[#3E2F35]/75"
            initial={fadeIn(0.04).initial}
            whileInView={fadeIn(0.04).whileInView}
            transition={fadeIn(0.04).transition}
            viewport={fadeIn(0.04).viewport}
          >
            Request an invitation for concierge onboarding, evolving member resources, registry moodboards, community salons, and the
            private journal—each crafted to feel bespoke.
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
            <Link href={"/membership" as Route} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] bg-white/40 px-7 py-3 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_26px_rgba(200,161,180,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFFAF8]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]">
              Explore Membership
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
