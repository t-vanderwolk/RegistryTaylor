import Link from "next/link";
import type { Route } from "next";
import PageSection from "@/components/PageSection";

const PRIMARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]";

const SECONDARY_BUTTON_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition-transform duration-200 hover:scale-105 hover:bg-[#EAC9D1]/30";

const COMMUNITY_FEATURES = [
  {
    title: "Mentor salons",
    detail:
      "Weekly themed gatherings—virtual and in-person—hosted by doulas, stylists, and concierge leads to keep momentum and inspiration high.",
  },
  {
    title: "Forum threads",
    detail:
      "Private discussion spaces for registry wins, nursery reveals, birth story reflections, and thoughtful Q&As moderated by our team.",
  },
  {
    title: "Pop-up experiences",
    detail:
      "Seasonal brunches, styling sessions, and partner workshops curated to feel intimate, celebratory, and distinctly Taylor-Made.",
  },
] as const;

const SUPPORT_OFFERS = [
  "Concierge replies within 24–48 hours inside your dashboard messenger.",
  "Mentor-led small circles organized by trimester, city, or shared interests.",
  "Guest chats spanning pelvic floor care, sleep shaping, nutrition, and memory keeping.",
] as const;

export const metadata = {
  title: "Community & Mentor Salons",
  description:
    "Discover the Taylor-Made Baby Co. community—mentor salons, curated forums, and pop-up experiences designed for luxurious connection.",
};

export default function CommunityPage() {
  return (
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Taylor-Made community</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">Gather, celebrate, and feel deeply supported</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            From mentor salons to beautifully curated threads, our private community keeps every member seen, heard, and
            exquisitely prepared for the moments ahead.
          </p>
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl grid gap-6 md:grid-cols-3">
          {COMMUNITY_FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2.25rem] border border-[#C8A1B4]/30 bg-white p-8 text-left shadow-[0_8px_30px_rgba(200,161,180,0.12)]"
            >
              <h2 className="font-serif text-2xl text-[#3E2F35]">{feature.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#3E2F35]/70">{feature.detail}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-8 shadow-[0_8px_30px_rgba(200,161,180,0.12)] md:p-12">
          <h2 className="text-center font-serif text-3xl text-[#3E2F35]">Support that feels bespoke</h2>
          <ul className="mt-6 space-y-3 text-sm text-[#3E2F35]/75">
            {SUPPORT_OFFERS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[1.5rem] border border-[#D9C48E]/30 bg-[#FFFAF8] px-4 py-3 shadow-[inset_0_1px_0_rgba(217,196,142,0.15)]"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C8A1B4]/25 text-xs font-semibold text-[#3E2F35]">
                  ✧
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-md space-y-6 text-center">
          <h2 className="font-serif text-3xl text-[#3E2F35]">Your seat is waiting</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#3E2F35]/75">
            Request an invite to receive concierge onboarding, community access, and lifetime mentorship inside one beautifully
            orchestrated experience.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={"/request-invite" as Route} className={PRIMARY_BUTTON_CLASSES}>
              Request Invite
            </Link>
            <Link href={"/membership" as Route} className={SECONDARY_BUTTON_CLASSES}>
              Explore Membership
            </Link>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
