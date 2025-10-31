import Link from "next/link";
import type { Route } from "next";
import { motion, useReducedMotion } from "framer-motion";

const PRIMARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(200,161,180,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b88ca3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]";

const SECONDARY_CTA_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C48E] bg-white/40 px-7 py-3 text-sm font-semibold text-[#3E2F35] shadow-[0_12px_26px_rgba(217,196,142,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FFFAF8]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9C48E]";

const MENTORS = [
  {
    name: "Eliza Hart",
    title: "Lead Nursery Stylist",
    location: "Los Angeles",
    initials: "EH",
  },
  {
    name: "Janelle Rivers",
    title: "Doula & Salons Host",
    location: "Austin",
    initials: "JR",
  },
  {
    name: "Maya Brooks",
    title: "Registry Concierge",
    location: "Chicago",
    initials: "MB",
  },
  {
    name: "Dr. Taye Morgan",
    title: "Perinatal Psychologist",
    location: "New York",
    initials: "TM",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "The salons felt like stepping into a hush-toned living room—every conversation was guided, intimate, and wildly helpful.",
    name: "Sienna · Charter Member",
  },
  {
    quote:
      "Mentors anticipated my needs before I could voice them. The prompts and reflections kept me grounded through every milestone.",
    name: "Priya · Registry Client",
  },
  {
    quote: "I still revisit the journal notes from postpartum circles. It felt like friendship wrapped in concierge care.",
    name: "Jordan · Postpartum Cohort",
  },
] as const;

const EVENTS = [
  {
    title: "Ivory Hour Salon",
    date: "Thurs · 7:30 PM CST",
    description: "A candlelit virtual gathering for third-trimester rituals led by Janelle and Dr. Taye.",
  },
  {
    title: "Nursery Atelier Walkthrough",
    date: "Sun · 11:00 AM PST",
    description: "Live styling session broadcasting from a Taylor-curated nursery with palette Q&A.",
  },
  {
    title: "MacroBaby Partner Pop-Up",
    date: "Sat · 2:00 PM EST",
    description: "In-person gifting suite preview with exclusive affiliate perks and mentor fittings.",
  },
] as const;

export const metadata = {
  title: "Community & Mentor Salons",
  description:
    "Discover the Taylor-Made Baby Co. community—mentor salons, curated forums, and pop-up experiences designed for luxurious connection.",
};

export default function CommunityPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F4] via-[#F2E7EE] to-[#FFFAF8]" />
        <div className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-6 py-24 text-center md:px-12 md:py-28 lg:items-start lg:text-left">
          <motion.div
            className="space-y-6 lg:max-w-3xl"
            initial={heroMotion.initial}
            animate={heroMotion.animate}
            transition={heroMotion.transition}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A1B4] shadow-[0_14px_30px_rgba(200,161,180,0.18)] backdrop-blur">
              Taylor-Made Community
            </p>
            <h1 className="font-serif text-[2.4rem] leading-tight text-[#3E2F35] sm:text-[3rem] lg:text-[3.35rem]">
              Connect with mentors, savor intimate salons, and feel luxuriously supported.
            </h1>
            <p className="text-base leading-relaxed text-[#3E2F35]/75 md:text-lg">
              From concierge-moderated forums to candlelit gatherings, the Taylor community is designed for meaningful connection
              that respects your pace and privacy.
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
        <div className="mx-auto max-w-screen-xl space-y-10 px-6 py-20 md:px-12 md:py-24">
          <header className="space-y-3 text-center lg:text-left">
            <h2 className="font-serif text-3xl text-[#3E2F35] md:text-4xl">Meet the mentors</h2>
            <p className="text-base text-[#3E2F35]/75 md:max-w-3xl">
              Your personal concierge team spans stylists, doulas, psychologists, and registry experts—ready for one-on-one
              messages and small-circle salons.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-4">
            {MENTORS.map((mentor, index) => {
              const motionConfig = fadeIn(index * 0.04);
              return (
                <motion.article
                  key={mentor.name}
                  className="rounded-[2.5rem] border border-white/45 bg-white/70 p-6 text-center shadow-[0_22px_48px_rgba(200,161,180,0.16)] backdrop-blur"
                  initial={motionConfig.initial}
                  whileInView={motionConfig.whileInView}
                  transition={motionConfig.transition}
                  viewport={motionConfig.viewport}
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A1B4]/30 bg-[#EAC9D1]/60 text-lg font-semibold text-[#C8A1B4] shadow-[0_12px_24px_rgba(200,161,180,0.22)]">
                    {mentor.initials}
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-[#3E2F35]">{mentor.name}</h3>
                  <p className="text-sm text-[#3E2F35]/70">{mentor.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#3E2F35]/60">{mentor.location}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#D9C48E]/30 bg-white/70">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFAF8] via-[#F4EDF6] to-[#FFF4EA]" />
        <div className="relative mx-auto max-w-screen-xl px-6 py-20 md:px-12 md:py-24">
          <div className="grid gap-8 md:grid-cols-[0.45fr,0.55fr] md:items-center">
            <motion.div
              className="space-y-5 rounded-[2.5rem] border border-white/45 bg-white/70 p-8 shadow-[0_22px_48px_rgba(200,161,180,0.16)] backdrop-blur"
              initial={fadeIn().initial}
              whileInView={fadeIn().whileInView}
              transition={fadeIn().transition}
              viewport={fadeIn().viewport}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Testimonials</p>
              <h2 className="font-serif text-3xl text-[#3E2F35] md:text-4xl">Whispers from the Taylor Collective</h2>
              <p className="text-base text-[#3E2F35]/75">
                Small circles, moderated threads, and private reflections give members space to feel held, celebrated, and
                exquisitely prepared.
              </p>
              <Link
                href={"/journal" as Route}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3E2F35] transition-colors duration-200 hover:text-[#C8A1B4]"
              >
                Preview the journal →
              </Link>
            </motion.div>
            <div className="space-y-6">
              {TESTIMONIALS.map((testimonial, index) => {
                const motionConfig = fadeIn(index * 0.04);
                return (
                  <motion.blockquote
                    key={testimonial.name}
                    className="rounded-[2.25rem] border border-white/45 bg-[#FFFAF8]/90 p-6 shadow-[0_20px_44px_rgba(200,161,180,0.16)] backdrop-blur"
                    initial={motionConfig.initial}
                    whileInView={motionConfig.whileInView}
                    transition={motionConfig.transition}
                    viewport={motionConfig.viewport}
                  >
                    <p className="font-serif text-lg text-[#3E2F35]">“{testimonial.quote}”</p>
                    <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#3E2F35]/60">
                      {testimonial.name}
                    </footer>
                  </motion.blockquote>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D9C48E]/30 bg-[#FFFAF8]">
        <div className="mx-auto max-w-screen-xl space-y-10 px-6 py-20 md:px-12 md:py-24">
          <header className="space-y-3 text-center lg:text-left">
            <h2 className="font-serif text-3xl text-[#3E2F35] md:text-4xl">Upcoming salons & gatherings</h2>
            <p className="text-base text-[#3E2F35]/75 md:max-w-3xl">
              Reserve your seat at virtual salons, in-person rituals, and partner pop-ups designed to keep your journey intentional.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {EVENTS.map((event, index) => {
              const motionConfig = fadeIn(index * 0.04);
              return (
                <motion.article
                  key={event.title}
                  className="rounded-[2.5rem] border border-white/45 bg-white/70 p-6 shadow-[0_20px_44px_rgba(217,196,142,0.16)] backdrop-blur"
                  initial={motionConfig.initial}
                  whileInView={motionConfig.whileInView}
                  transition={motionConfig.transition}
                  viewport={motionConfig.viewport}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">{event.date}</p>
                  <h3 className="mt-3 font-serif text-xl text-[#3E2F35]">{event.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/75">{event.description}</p>
                  <Link
                    href={"/request-invite" as Route}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3E2F35] transition-colors duration-200 hover:text-[#C8A1B4]"
                  >
                    Hold my seat →
                  </Link>
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
            Your private Taylor-Made circle is ready.
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-base text-[#3E2F35]/75"
            initial={fadeIn(0.04).initial}
            whileInView={fadeIn(0.04).whileInView}
            transition={fadeIn(0.04).transition}
            viewport={fadeIn(0.04).viewport}
          >
            Request an invitation to access the community, salons, and concierge care that weave support through every moment.
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
            <Link href={"/membership" as Route} className={SECONDARY_CTA_CLASSES}>
              View Membership
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
