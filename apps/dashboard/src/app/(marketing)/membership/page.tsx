const TIERS = [
  {
    name: "Concierge Foundations",
    price: "$249 / month",
    description: "Perfect for families seeking weekly guidance, journal reflections, and curated registry unlocks.",
    features: [
      "Full Taylor Academy access with bespoke unlock cadence",
      "Dynamic registry planning with MacroBaby affiliate tracking",
      "Monthly mentor salon access + community announcements",
      "Concierge inbox with 48-hour response time",
    ],
  },
  {
    name: "Concierge Signature",
    price: "$449 / month",
    description: "Our most loved experience for parents-to-be wanting proactive concierge outreach and event priority.",
    features: [
      "Everything in Foundations",
      "Bi-weekly 1:1 mentor sessions",
      "Quarterly nursery styling reviews and registry refresh",
      "Priority access to Taylor salons, circles, and pop-ups",
    ],
  },
  {
    name: "Concierge Bespoke",
    price: "Custom investment",
    description: "Design-forward families and public figures choose Bespoke for full-service planning and gifting.",
    features: [
      "Dedicated concierge lead with on-call availability",
      "In-home nursery styling coordination & vendor management",
      "White-glove registry sourcing, tracking, and thank-you assistance",
      "Custom experiences for showers, announcements, and postpartum care",
    ],
  },
];

export const metadata = {
  title: "Membership",
  description:
    "Explore Taylor-Made Baby Co. membership tiers featuring concierge mentorship, registry planning, and curated community experiences.",
};

export default function MembershipPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Membership</p>
        <h1 className="font-[var(--font-playfair)] text-4xl text-[#3E2F35]">Choose the concierge care that fits you</h1>
        <p className="mx-auto max-w-3xl text-sm text-[#3E2F35]/70">
          Every Taylor-Made membership begins with a private invitation. Select the experience that aligns with your
          support needs—we’ll pair you with a mentor and craft a bespoke welcome.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.name}
            className="flex flex-col rounded-[2.75rem] border border-[#C8A1B4]/35 bg-white/90 p-8 text-sm text-[#3E2F35]/70 shadow-[0_26px_60px_rgba(200,161,180,0.2)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_34px_70px_rgba(200,161,180,0.26)]"
          >
            <div>
              <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">{tier.name}</h2>
              <p className="mt-2 text-xl font-semibold text-[#C8A1B4]">{tier.price}</p>
              <p className="mt-3 leading-relaxed">{tier.description}</p>
            </div>
            <ul className="mt-6 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="rounded-[1.75rem] border border-[#E8C9D1]/50 bg-[#FFFAF8]/70 px-4 py-3 text-[#3E2F35] shadow-inner">
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/request-invite"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_36px_rgba(200,161,180,0.35)] transition hover:-translate-y-1 hover:bg-[#B88FA6]"
            >
              Request Invite →
            </a>
          </article>
        ))}
      </div>

      <section className="rounded-[3rem] border border-[#D9C48E]/40 bg-gradient-to-r from-[#FFFAF8] via-[#FFF3EB] to-[#E8C9D1]/45 p-10 text-center shadow-[0_28px_62px_rgba(217,196,142,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">What’s included</p>
        <h2 className="mt-4 font-[var(--font-playfair)] text-3xl text-[#3E2F35]">Every membership includes</h2>
        <div className="mt-6 grid gap-6 text-sm text-[#3E2F35]/70 sm:grid-cols-2">
          {[
            "Taylor Academy access to the Learn · Plan · Connect curriculum",
            "Concierge-maintained registry with MacroBaby affiliate tracking",
            "Mentor salons, circles, and community announcements",
            "Warm onboarding flow with questionnaire, profile, and dashboard setup",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[2rem] border border-[#C8A1B4]/30 bg-white/80 px-6 py-4 shadow-inner"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
