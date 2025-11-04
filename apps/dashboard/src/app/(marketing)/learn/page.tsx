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
          <Link
            href="/dashboard/learn/welcome"
            className="block rounded-2xl bg-ivory p-6 text-center shadow transition hover:shadow-md"
          >
            <h2 className="font-playfair text-2xl mb-2 text-[#3E2F35]">Taylor-Made Baby Academy</h2>
            <p className="text-gray-600">Learn, prepare, and grow — at your own pace.</p>
          </Link>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col gap-8 rounded-[2.75rem] border border-[#E8E3E1] bg-[#FFFAF8] px-8 py-10 shadow-[0_24px_60px_rgba(200,161,180,0.14)] md:flex-row md:items-center md:justify-between md:px-14 md:py-12">
            <div className="space-y-5 text-left md:max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-[#F2D6DF] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]">
                Taylor-Made Baby Academy
              </span>
              <h2 className="font-serif text-3xl leading-tight text-[#3E2F35] md:text-[2.75rem]">
                Concierge lessons that move with your season
              </h2>
              <p className="text-base leading-relaxed text-[#3E2F35]/80">
                Explore immersive modules for Nursery, Gear, and Postpartum designed by Taylor’s concierge team. Each chapter pairs editorial storytelling with rituals you can apply immediately—synced to your workbook and mentor notes.
              </p>
              <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]/65">
                {["Nursery Atelier", "Gear Confidence", "Postpartum Rituals"].map((label) => (
                  <span key={label} className="inline-flex rounded-full bg-white px-3 py-1 text-[#3E2F35] shadow-[0_8px_20px_rgba(200,161,180,0.12)]">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-5 rounded-[2.25rem] border border-[#EED6D3] bg-white/90 px-7 py-6 shadow-[0_18px_40px_rgba(200,161,180,0.18)] md:max-w-sm">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#3E2F35]/70">
                  What you receive
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/75">
                  Workbook reflections, registry prompts, mentor insights, and printable rituals—saved to your dashboard the moment you complete a lesson.
                </p>
              </div>
              <Link
                href={"/dashboard/learn/welcome" as Route}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-8 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] shadow-[0_16px_35px_rgba(200,161,180,0.26)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#C29AAD] hover:text-white"
              >
                Enter Academy
              </Link>
              <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/55">Member access · Progress syncs automatically</p>
            </div>
          </div>
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
