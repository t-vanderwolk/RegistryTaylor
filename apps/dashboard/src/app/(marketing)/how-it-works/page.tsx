const STEPS = [
  {
    title: "Receive your concierge invite",
    description:
      "Each membership begins with an invitation from our concierge team or a trusted mentor referral. Your invite unlocks onboarding that tailors every touchpoint.",
  },
  {
    title: "Complete the questionnaire",
    description:
      "Share household rhythms, design inspiration, and support priorities. We pair you with a mentor while the academy synchronizes modules to your timeline.",
  },
  {
    title: "Build momentum inside the academy",
    description:
      "Short, serene lessons guide you through nursery styling, gear confidence, and postpartum rituals—revealing curated registry items as you progress.",
  },
  {
    title: "Co-create your concierge registry",
    description:
      "Every recommendation embeds MacroBaby affiliate tracking so gifting stays streamlined. Add personal finds, and we’ll harmonize the look, budget, and fulfilment.",
  },
  {
    title: "Stay connected with mentor salons",
    description:
      "Weekly salons, community events, and journal reflections keep you supported by mentors, doulas, and fellow members—no matter where you are in the journey.",
  },
];

export const metadata = {
  title: "How It Works",
  description:
    "Discover how Taylor-Made Baby Co. guides you from invitation to bespoke concierge care with a calm, thoughtful onboarding flow.",
};

export default function HowItWorksPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">The Taylor-Made Method</p>
        <h1 className="font-[var(--font-playfair)] text-4xl text-[#3E2F35]">From invitation to calm confidence</h1>
        <p className="mx-auto max-w-3xl text-sm text-[#3E2F35]/70">
          Our concierge team syncs mentorship, curriculum, community, and registry planning into a single serene flow. Each
          step feels intentional, bespoke, and grounded in the realities of your family life.
        </p>
      </header>

      <div className="space-y-8">
        {STEPS.map((step, index) => (
          <article
            key={step.title}
            className="rounded-[2.75rem] border border-[#C8A1B4]/30 bg-white/90 p-8 shadow-[0_24px_55px_rgba(200,161,180,0.18)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_32px_65px_rgba(200,161,180,0.24)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#C8A1B4] via-[#E8C9D1] to-[#D9C48E] text-lg font-semibold text-white shadow-[0_12px_28px_rgba(200,161,180,0.32)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">{step.title}</h2>
                <p className="mt-3 text-sm text-[#3E2F35]/70">{step.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[3rem] border border-[#D9C48E]/40 bg-gradient-to-r from-[#FFFAF8] via-[#FFF3EB] to-[#E8C9D1]/45 p-10 text-center shadow-[0_28px_62px_rgba(217,196,142,0.22)]">
        <h2 className="font-[var(--font-playfair)] text-3xl text-[#3E2F35]">Ready for your invitation?</h2>
        <p className="mt-4 text-sm text-[#3E2F35]/70">
          Share a little about your family and timeline. We’ll align you with the perfect mentor and curate a welcome
          experience that feels luxurious yet grounded.
        </p>
        <a
          href="/request-invite"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_36px_rgba(200,161,180,0.35)] transition hover:-translate-y-1 hover:bg-[#B88FA6]"
        >
          Request Invite →
        </a>
      </section>
    </div>
  );
}
