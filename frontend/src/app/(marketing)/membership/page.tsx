import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

const MEMBERSHIP_BENEFITS = [
  "Personal concierge guidance with weekly touchpoints and bespoke roadmap adjustments",
  "Member-for-life promise with re-entry support for future pregnancies and celebrations",
  "Dynamic registry maintenance with gifting etiquette prompts and gratitude tracking",
  "Mentor-to-member circles, live salons, and curated community rituals that expand monthly",
  "Fourth-trimester care plans, partner-friendly to-do guides, and on-call question support",
] as const;

export const metadata = {
  title: "Membership",
  description:
    "Explore the Taylor-Made Baby Co. concierge membership and discover the luxury experience available to our families.",
};

export default function MembershipPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Membership</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">Concierge Membership · $500 Lifetime Welcome</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            One invitation unlocks the Taylor-Made ecosystem—design consultation, registry curation, mentor salons, and an
            evolving community grounded in emotional luxury. Pay once, stay supported for every season ahead.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link
              href={"/how-it-works" as Route}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition-transform duration-200 hover:scale-105 hover:bg-[#EAC9D1]/30"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl grid gap-8 rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:grid-cols-[0.45fr,0.55fr] md:p-12">
          <div className="space-y-5">
            <h2 className="font-serif text-3xl text-[#3E2F35]">What lifetime membership delivers</h2>
            <p className="text-sm leading-relaxed text-[#3E2F35]/75">
              Paying once reserves concierge support for every present and future pregnancy, plus the seasons beyond. Families
              receive bespoke planning kits, expert coordination, and a private digital home for every detail you want to keep
              beautifully organized.
            </p>
            <p className="text-sm leading-relaxed text-[#3E2F35]/75">
              We accept a limited number of families per season to ensure each mentor relationship remains personal and timely.
              Your membership evolves with you—new rituals, new resources, and a community that grows alongside your family.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-[#3E2F35]/75">
            {MEMBERSHIP_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-[1.5rem] border border-[#D9C48E]/30 bg-[#FFFAF8] px-4 py-3 shadow-[inset_0_1px_0_rgba(217,196,142,0.15)]"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C8A1B4]/25 text-xs font-semibold text-[#3E2F35]">
                  ✧
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto grid max-w-screen-xl gap-6 rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_12px_40px_rgba(200,161,180,0.12)] md:grid-cols-3 md:p-12">
          <article className="space-y-4 rounded-[2rem] border border-[#EAC9D1]/50 bg-[#FFFAF8] p-6 text-left shadow-[inset_0_1px_0_rgba(200,161,180,0.2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Member for life</p>
            <h3 className="font-serif text-2xl text-[#3E2F35]">A forever concierge relationship</h3>
            <p className="text-sm leading-relaxed text-[#3E2F35]/70">
              Your lifetime membership means we’re here for the next baby shower, sibling arrival, or nursery refresh. Step
              back in anytime for updated plans, etiquette scripts, and registry refreshes—no additional fees, ever.
            </p>
          </article>
          <article className="space-y-4 rounded-[2rem] border border-[#EAC9D1]/50 bg-[#FFFAF8] p-6 text-left shadow-[inset_0_1px_0_rgba(200,161,180,0.2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Member-to-mentor</p>
            <h3 className="font-serif text-2xl text-[#3E2F35]">Grow into the guide you needed</h3>
            <p className="text-sm leading-relaxed text-[#3E2F35]/70">
              Our mentor pathway invites seasoned members to share wisdom through moderated salons and one-on-one conversations.
              We provide training, facilitation, and honorariums—so your story helps the next family feel steadier.
            </p>
          </article>
          <article className="space-y-4 rounded-[2rem] border border-[#EAC9D1]/50 bg-[#FFFAF8] p-6 text-left shadow-[inset_0_1px_0_rgba(200,161,180,0.2)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Living community</p>
            <h3 className="font-serif text-2xl text-[#3E2F35]">An evolving circle, always expanding</h3>
            <p className="text-sm leading-relaxed text-[#3E2F35]/70">
              From local meetups and traveling supper clubs to digital studio circles, you’ll tap into a living community that
              grows with each member’s rituals and lessons. Expect new experiences every quarter, curated with exquisite care.
            </p>
          </article>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <h2 className="font-serif text-3xl text-[#3E2F35]">Ready for your bespoke welcome?</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#3E2F35]/75">
            Share a few details about your family, timeline, and vision. Our concierge team will reach out within two
            business days with next steps and your tailored onboarding itinerary.
          </p>
          <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
            Request Invite
          </Link>
        </div>
      </PageSection>
    </div>
  );
}
