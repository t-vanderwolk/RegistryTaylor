import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

const JOURNEYS = [
  {
    title: "Nursery atelier",
    detail:
      "Transform inspiration into a serene nursery with spatial planning, lighting schemes, vendor lists, and heirloom-ready styling guides.",
  },
  {
    title: "Gear confidence",
    detail:
      "Compare concierge-tested essentials, track purchases, and understand the must-haves versus nice-to-haves for your lifestyle.",
  },
  {
    title: "Postpartum rituals",
    detail:
      "Design recovery stations, nourishment plans, and partner-friendly checklists that carry you through the fourth trimester.",
  },
] as const;

const SUPPORT_ELEMENTS = [
  {
    label: "Concierge prompts",
    description:
      "Weekly notes summarize progress, next steps, and registry updates so you never wonder what to tackle first.",
  },
  {
    label: "Mentor reflections",
    description:
      "Short audio and journal prompts keep you connected to your mentor between salons and help capture the memories you want to keep.",
  },
  {
    label: "Workbook uploads",
    description:
      "Save mood boards, photos, and inspiration directly in your dashboard to reference during consultations.",
  },
] as const;

export const metadata = {
  title: "Learn with Taylor Academy",
  description:
    "Preview the Taylor-Made Baby Co. academy—calm, luxurious modules for Nursery, Gear, and Postpartum journeys.",
};

export default function LearnPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Taylor Academy</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">Learn · Prepare · Connect</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            Your personal roadmap through pregnancy, gear planning, and postpartum wellness. Choose a journey below to begin
            your guided path with mentor support and concierge orchestration.
          </p>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl grid gap-8 md:grid-cols-3">
          {JOURNEYS.map((journey) => (
            <article
              key={journey.title}
              className="rounded-[2.25rem] border border-[#C8A1B4]/30 bg-white p-8 text-left shadow-[0_8px_30px_rgba(200,161,180,0.12)]"
            >
              <h2 className="font-serif text-2xl text-[#3E2F35]">{journey.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#3E2F35]/70">{journey.detail}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:p-12">
          <h2 className="text-center font-serif text-3xl text-[#3E2F35]">What supports every module?</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SUPPORT_ELEMENTS.map((support) => (
              <div
                key={support.label}
                className="rounded-[1.75rem] border border-[#D9C48E]/30 bg-[#FFFAF8] px-6 py-5 text-left shadow-[inset_0_1px_0_rgba(217,196,142,0.15)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">{support.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/70">{support.description}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-md space-y-6 text-center">
          <h2 className="font-serif text-3xl text-[#3E2F35]">Ready to experience the full cadence?</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#3E2F35]/75">
            Request your invitation to unlock the Taylor Academy, dynamic registry access, and mentor-led community in one
            beautifully orchestrated space.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link
              href={"/community" as Route}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition-transform duration-200 hover:scale-105 hover:bg-[#EAC9D1]/30"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
