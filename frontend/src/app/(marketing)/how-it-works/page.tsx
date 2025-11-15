import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

const STEPS = [
  {
    title: "Invitation",
    detail:
      "Request your invite or receive a mentor referral. We review every family personally to preserve the boutique experience.",
  },
  {
    title: "Concierge questionnaire",
    detail:
      "Share rhythms, design direction, and support needs. We tailor your roadmap, registry milestones, and salon topics around you.",
  },
  {
    title: "Member studio welcome",
    detail:
      "A private planning studio opens with guided checklists, rituals, and resources released in a calm, concierge-paced flow.",
  },
  {
    title: "Mentor salons",
    detail:
      "Gather weekly with mentors and specialists. We summarize insights, action items, and next steps inside your dashboard journal.",
  },
  {
    title: "Registry & rituals",
    detail:
      "Concierge curates gifting lists, gratitude notes, and postpartum rituals so every detail stays organized and luxurious.",
  },
  {
    title: "Fourth-trimester support",
    detail:
      "Continue working with your mentor through recovery, welcoming visitors, and preserving the memories you want to savor.",
  },
] as const;

export const metadata = {
  title: "How It Works",
  description:
    "Discover how Taylor-Made Baby Co. guides families from invitation to bespoke concierge care with a calm, thoughtful onboarding flow.",
};

export default function HowItWorksPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">The Taylor-Made method</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">From invitation to calm confidence</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            We choreograph mentorship, design, psychology, and logistics into one serene path. Each step is intentional,
            bespoke, and paced to your season.
          </p>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-6">
          {STEPS.map((step, index) => (
            <article
              key={step.title}
              className="flex flex-col gap-4 rounded-[2.25rem] border border-[#C8A1B4]/30 bg-white p-6 text-left shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:flex-row md:items-start md:gap-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9C48E]/35 text-sm font-semibold uppercase tracking-[0.3em] text-[#3E2F35]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl text-[#3E2F35]">{step.title}</h2>
                <p className="text-sm leading-relaxed text-[#3E2F35]/70">{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <h2 className="font-serif text-3xl text-[#3E2F35]">Ready for your invitation?</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#3E2F35]/75">
            Share a few details about your family. Our concierge team will reach out with a curated welcome, mentor pairing,
            and a timeline that feels beautifully paced.
          </p>
          <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
            Request Invite
          </Link>
        </div>
      </PageSection>
    </div>
  );
}
