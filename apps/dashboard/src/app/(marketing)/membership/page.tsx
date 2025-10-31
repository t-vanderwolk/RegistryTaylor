import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

const MEMBERSHIP_BENEFITS = [
  "Personal concierge lead with weekly check-ins and tailored roadmap adjustments",
  "Full Taylor Academy access with trimester-paced unlocks and mentor reflections",
  "Dynamic registry maintenance with gifting etiquette prompts and thank-you tracking",
  "Private mentor salons, curated community threads, and seasonal pop-up invitations",
  "Fourth-trimester rituals, recovery planning, and partner-friendly to-do guides",
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
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Membership</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">Concierge Membership · $500 Lifetime Access</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            One invitation unlocks the entire Taylor-Made experience—from design consultations and registry planning to
            mentor salons, postpartum rituals, and celebratory pop-ups.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link
              href={"/how-it-works" as Route}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition-transform duration-200 hover:scale-105 hover:bg-[#EAC9D1]/30"
            >
              View Membership Flow
            </Link>
          </div>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl grid gap-8 rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:grid-cols-[0.45fr,0.55fr] md:p-12">
          <div className="space-y-5">
            <h2 className="font-serif text-3xl text-[#3E2F35]">What lifetime membership delivers</h2>
            <p className="text-sm leading-relaxed text-[#3E2F35]/75">
              Paying once reserves concierge support for the entirety of your pregnancy journey and the fourth trimester.
              Families receive bespoke planning kits, expert coordination, and a private digital home for every detail.
            </p>
            <p className="text-sm leading-relaxed text-[#3E2F35]/75">
              We accept a limited number of families per season to ensure every touchpoint remains personal, timely, and
              beautifully executed.
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
