import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";
import InviteCodeForm from "@/components/InviteCodeForm";
import HeroHeading from "@/components/marketing/HeroHeading";
import HeroInviteForm from "@/components/marketing/HeroInviteForm";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition-transform duration-200 hover:scale-105 hover:bg-[#EAC9D1]/30";

const HOW_IT_WORKS = [
  {
    title: "Concierge Intake",
    description:
      "Share your story and vision. We listen, map milestones, and assemble the right stylists, doulas, and mentors for your family.",
  },
  {
    title: "Tailored Planning",
    description:
      "Receive a living roadmap with registry guidance, etiquette scripts, and beautifully organized checklists that shift with you.",
  },
  {
    title: "Community & Mentors",
    description:
      "Join salons, message mentors, and step into curated gatherings. Every touchpoint feels intimate, moderated, and emotionally warm.",
  },
] as const;

const MEMBERSHIP_PILLARS = [
  {
    name: "Member-for-Life Promise",
    detail:
      "Re-enter anytime for new pregnancies, sibling celebrations, or refreshes. The concierge team remains on call without additional fees.",
  },
  {
    name: "Mentor-to-Member Pathway",
    detail:
      "Seasoned members can train with our concierge team to host salons and share wisdom—your lived experience becomes part of the circle.",
  },
  {
    name: "Evolving Community Fabric",
    detail:
      "Expect new rituals, pop-ups, and digital studios every quarter. The community grows with you, celebrating every milestone together.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Taylor-Made took the overwhelm out of planning. Every module arrived right on time and felt like a calm conversation with a friend.",
    name: "Sienna · Los Angeles",
  },
  {
    quote:
      "Our registry looked like it came from a boutique editorial. Friends kept asking who designed it for us.",
    name: "Priya · Chicago",
  },
  {
    quote:
      "Mentor salons reminded me I wasn’t doing this alone. The community is small, thoughtful, and beautifully moderated.",
    name: "Jordan · Austin",
  },
] as const;

export const metadata = {
  title: "Concierge Birth and Baby Planning",
  description:
    "Taylor-Made Baby Co. offers calm, curated support for growing families with bespoke concierge planning, registry mastery, and an evolving member community.",
};

export default function MarketingHomePage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-12 lg:grid lg:grid-cols-[0.6fr,0.4fr] lg:items-center">
          <div className="space-y-6 text-center lg:text-left">
            <HeroHeading />
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
                Request Invite
              </Link>
              <Link href={"/membership" as Route} className={SECONDARY_BUTTON_CLASSES}>
                View Membership
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <HeroInviteForm />
          </div>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">How it works</p>
            <h2 className="mt-3 font-serif text-3xl text-[#3E2F35]">A calm, concierge-led journey</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <article
                key={item.title}
                className="rounded-[2.25rem] border border-[#D9C48E]/25 bg-white p-6 text-left shadow-[0_8px_30px_rgba(200,161,180,0.12)]"
              >
                <h3 className="font-serif text-xl text-[#3E2F35]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Membership pillars</p>
            <h2 className="mt-3 font-serif text-3xl text-[#3E2F35]">Lifetime support woven with community</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {MEMBERSHIP_PILLARS.map((pillar) => (
              <article
                key={pillar.name}
                className="rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 text-left shadow-[0_8px_30px_rgba(200,161,180,0.12)]"
              >
                <h3 className="font-serif text-2xl text-[#3E2F35]">{pillar.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#3E2F35]/70">{pillar.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-10">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Loved by modern families</p>
            <h2 className="mt-3 font-serif text-3xl text-[#3E2F35]">Words from the Taylor collective</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((entry) => (
              <figure
                key={entry.name}
                className="rounded-[2.25rem] border border-[#C8A1B4]/25 bg-white p-6 text-left shadow-[0_8px_30px_rgba(200,161,180,0.12)]"
              >
                <blockquote className="font-serif text-lg text-[#3E2F35]">“{entry.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#3E2F35]/70">
                  {entry.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto grid max-w-screen-xl gap-10 rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:grid-cols-[0.55fr,0.45fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Request your invitation</p>
            <h2 className="font-serif text-3xl text-[#3E2F35]">Concierge onboarding begins here</h2>
            <p className="text-sm leading-relaxed text-[#3E2F35]/75">
              Share your timeline and we’ll craft a bespoke welcome, pairing you with the mentor, rituals, and community
              cadence that fits your lifestyle.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-[#D9C48E]/30 bg-[#FFFAF8] p-6 shadow-inner">
            <InviteCodeForm />
          </div>
        </div>
      </PageSection>
    </div>
  );
}
