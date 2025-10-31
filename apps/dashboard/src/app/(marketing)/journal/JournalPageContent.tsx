import Link from "next/link";
import type { Route } from "next";
import { motion, useReducedMotion } from "framer-motion";

const PRIMARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(200,161,180,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b88ca3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]";

const SECONDARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C48E] bg-white/40 px-7 py-3 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_26px_rgba(217,196,142,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFFAF8]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C48E]";

const REFLECTION_PROMPTS = [
  "What moment felt like pure softness today?",
  "Which mentor whisper or note stayed with you?",
  "How will you thank your future self this week?",
] as const;

const JOURNAL_FEATURES = [
  {
    title: "Blurred privacy",
    detail: "Entries stay softly blurred on shared screens until you choose to reveal them.",
  },
  {
    title: "Voice-to-text",
    detail: "Late-night reflections are automatically transcribed into your keepsake archive.",
  },
  {
    title: "Concierge tags",
    detail: "Mentors can leave gentle tags for follow-up support, keeping care threads connected.",
  },
] as const;

export const metadata = {
  title: "Taylor Journal Preview",
  description:
    "Peek inside the Taylor-Made Baby Co. journal—private reflections, mentor prompts, and blurred entries crafted for luxury calm.",
};

export default function JournalPage() {
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
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.24, delay },
          viewport: { once: true, margin: "-15%" },
        } as const);

  return (
    <div className="bg-[#FFFAF8] text-[#3E2F35]">
      <section className="relative overflow-hidden border-b border-[#D9C48E]/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF4F8] via-[#F0E9F3] to-[#FFFAF8]" />
        <div className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-6 py-24 text-center md:px-12 md:py-28 lg:items-start lg:text-left">
          <motion.div
            className="space-y-6 lg:max-w-3xl"
            initial={heroMotion.initial}
            animate={heroMotion.animate}
            transition={heroMotion.transition}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A1B4] shadow-[0_14px_30px_rgba(200,161,180,0.18)] backdrop-blur">
              Taylor Journal
            </p>
            <h1 className="font-serif text-[2.4rem] leading-tight text-[#3E2F35] sm:text-[3rem] lg:text-[3.35rem]">
              Preserve the moments that feel like velvet—privately, beautifully, and on your terms.
            </h1>
            <p className="text-base leading-relaxed text-[#3E2F35]/75 md:text-lg">
              Guided prompts, voice-to-text reflections, and mentor tags transform each entry into a keepsake—blurred until you
              choose to reveal it.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href={"/request-invite" as Route} className={PRIMARY_CTA_CLASSES}>
                Request Invite
              </Link>
              <Link href={"/experience" as Route} className={SECONDARY_CTA_CLASSES}>
                Explore the Experience
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#D9C48E]/30 bg-[#FFFAF8]/85">
        <div className="mx-auto max-w-screen-xl px-6 py-20 md:px-12 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.55fr,0.45fr] lg:items-center">
            <motion.div
              className="space-y-5 rounded-[2.75rem] border border-white/45 bg-white/70 p-8 shadow-[0_24px_48px_rgba(200,161,180,0.16)] backdrop-blur"
              initial={fadeIn().initial}
              whileInView={fadeIn().whileInView}
              transition={fadeIn().transition}
              viewport={fadeIn().viewport}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Blurred preview</p>
              <div className="overflow-hidden rounded-[2rem] border border-[#C8A1B4]/30 bg-[#FFFAF8]/90 p-6 shadow-inner">
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#3E2F35]/55">
                    <span>Week 32 · Evening Reflection</span>
                    <span>Private</span>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#D9C48E]/30 bg-[#FFF6F2]/70 px-5 py-4 text-sm text-[#3E2F35]/75 blur-sm">
                    Tonight I watched the nursery glow in amber light. The mobile caught the breeze and I felt the first flutter in
                    hours. I whispered the lullaby Eliza taught me and imagined our first night home.
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/50 bg-[#EAC9D1]/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_24px_rgba(200,161,180,0.22)]"
                  >
                    Reveal entry
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-[#3E2F35]/75">
                Preview how blurred entries safeguard your reflections—even when you hand your device to a loved one. A single tap
                unlocks full text for your eyes only.
              </p>
            </motion.div>
            <motion.div
              className="space-y-5 rounded-[2.5rem] border border-white/40 bg-[#FFF4EA]/70 p-8 text-left shadow-[0_22px_46px_rgba(217,196,142,0.16)] backdrop-blur"
              initial={fadeIn(0.05).initial}
              whileInView={fadeIn(0.05).whileInView}
              transition={fadeIn(0.05).transition}
              viewport={fadeIn(0.05).viewport}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Tonight&apos;s prompt</p>
              <ul className="space-y-4 text-sm text-[#3E2F35]/75">
                {REFLECTION_PROMPTS.map((prompt) => (
                  <li key={prompt} className="rounded-[1.5rem] border border-[#D9C48E]/40 bg-white/70 px-5 py-4 shadow-[0_12px_24px_rgba(217,196,142,0.18)]">
                    {prompt}
                  </li>
                ))}
              </ul>
              <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
                Prompts rotate weekly · Mentor responses within 24h
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D9C48E]/30 bg-white/70">
        <div className="mx-auto max-w-screen-xl space-y-8 px-6 py-20 md:px-12 md:py-24">
          <header className="space-y-3 text-center lg:text-left">
            <h2 className="font-serif text-3xl text-[#3E2F35] md:text-4xl">Concierge touches inside your journal</h2>
            <p className="text-base text-[#3E2F35]/75 md:max-w-3xl">
              Each entry is paired with meticulous support—from mentor whispers to archival printing for your keepsake box.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {JOURNAL_FEATURES.map((feature, index) => {
              const motionConfig = fadeIn(index * 0.04);
              return (
                <motion.article
                  key={feature.title}
                  className="rounded-[2.25rem] border border-white/45 bg-[#FFFAF8]/90 p-7 shadow-[0_22px_44px_rgba(200,161,180,0.16)] backdrop-blur"
                  initial={motionConfig.initial}
                  whileInView={motionConfig.whileInView}
                  transition={motionConfig.transition}
                  viewport={motionConfig.viewport}
                >
                  <h3 className="font-serif text-xl text-[#3E2F35]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/75">{feature.detail}</p>
                </motion.article>
              );
            })}
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
            Your private Taylor-Made Journal awaits.
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-[#3E2F35]/75"
            initial={fadeIn(0.04).initial}
            whileInView={fadeIn(0.04).whileInView}
            transition={fadeIn(0.04).transition}
            viewport={fadeIn(0.04).viewport}
          >
            Request an invite to unlock blurred entries, mentor prompts, and concierge-tagged reflections woven through your Learn,
            Plan, and Connect journey.
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
              Meet the Community
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
