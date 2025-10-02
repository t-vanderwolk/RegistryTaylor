import React from "react";
import { Link } from "react-router-dom";
import {
  membershipHeroHighlights,
  membershipTiers,
  conciergePillars,
  membershipBenefits,
} from "../data/membership";
import membershipHeroPrimary from "../assets/couple-happy.jpeg";
import membershipHeroSecondary from "../assets/belly-hug.jpeg";

const previewHighlights = [
  {
    icon: "🎀",
    title: "Curated Starter Collections",
    blurb:
      "Browse registry essentials and nursery mood boards tailored to your family’s style before committing to a package.",
  },
  {
    icon: "💬",
    title: "Direct Concierge Messaging",
    blurb:
      "Chat with Taylor or your mentor, share inspiration, and preview how concierge guidance flows inside the portal.",
  },
  {
    icon: "📋",
    title: "Guided Intake",
    blurb:
      "Complete a light onboarding that captures your timeline, support needs, and design vibe—so your full concierge plan starts strong.",
  },
];

const previewTimeline = [
  {
    phase: "01",
    title: "Request Preview Access",
    description: "Receive a 7-day invite to explore the Taylor-Made portal and curated starter content.",
  },
  {
    phase: "02",
    title: "Sample Concierge Touchpoints",
    description: "Message Taylor, review starter collections, and see how mentoring and planning align with your family.",
  },
  {
    phase: "03",
    title: "Choose Your Concierge Path",
    description: "Upgrade to Essentials, Signature, or Bespoke when you’re ready—or select à la carte concierge services.",
  },
];

const previewFaqs = [
  {
    question: "Is the preview complimentary?",
    answer:
      "Yes. The concierge preview is invite-only but free. It lets you try the planning suite before you commit to a membership tier.",
  },
  {
    question: "How long do I have access?",
    answer:
      "You have seven days from your invite to explore. Most families upgrade within the first 48 hours once they see how tailored the concierge flow feels.",
  },
  {
    question: "Can I book services without a full membership?",
    answer:
      "Absolutely. After previewing, you can upgrade to a tier or pick à la carte offerings—registry builds, nursery design, events, and more.",
  },
];

const HeroHighlight = ({ icon, title, blurb }) => (
  <article className="surface-card flex flex-col items-start gap-3 text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
    <span className="text-2xl">{icon}</span>
    <h3 className="font-serif text-lg">{title}</h3>
    <p className="text-sm leading-relaxed text-neutral-600">{blurb}</p>
  </article>
);

const PackageCard = ({ pkg }) => (
  <article className="surface-card flex h-full flex-col gap-4 text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
    <header className="space-y-2">
      {pkg.tag && (
        <p className="text-[0.65rem] uppercase tracking-[0.32em] text-primary/70">{pkg.tag}</p>
      )}
      <h3 className="font-serif text-2xl text-blueberry">{pkg.name}</h3>
      {pkg.startingPrice && (
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          {pkg.startingPrice.startsWith("$") ? `Starting at ${pkg.startingPrice}` : pkg.startingPrice}
        </p>
      )}
    </header>
    <p className="text-sm leading-relaxed text-neutral-600">{pkg.intro}</p>
    {pkg.headline && (
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
        {pkg.headline}
      </p>
    )}
    <ul className="space-y-2 text-sm text-neutral-600">
      {pkg.items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1 text-primary">◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <Link
      to="/contact"
      className="mt-auto inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.25em] text-primary transition hover:-translate-y-0.5 hover:scale-105 hover:bg-softPink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      Start with {pkg.name}
    </Link>
  </article>
);

const PillarCard = ({ icon, title, blurb, points }) => (
  <article className="surface-card flex flex-col gap-3 text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
    <div className="flex items-start gap-3">
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-serif text-xl">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{blurb}</p>
      </div>
    </div>
    <ul className="space-y-2 text-sm text-neutral-600">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2">
          <span className="mt-1 text-primary">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </article>
);

const MembershipCard = ({ icon, title, summary, details = [] }) => (
  <article className="surface-card flex flex-col gap-3 text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-serif text-xl">{title}</h3>
    </div>
    <p className="text-sm text-neutral-600">{summary}</p>
    {details.length > 0 && (
      <ul className="space-y-2 text-sm text-neutral-600">
        {details.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <span className="mt-1 text-primary">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    )}
  </article>
);

const Membership = () => {
  return (
    <div className="relative space-y-16 pb-24 pt-16 sm:space-y-20">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[3.75rem] border border-primary/30 bg-gradient-to-br from-softPink/45 via-white/92 to-softMint/40 px-6 py-16 shadow-soft backdrop-blur-lg motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-softPink/50 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 right-12 h-80 w-80 rounded-full bg-softMint/45 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Invite-Only Concierge</p>
            <h1 className="flex flex-col items-center gap-2 text-4xl text-blueberry sm:text-5xl md:text-6xl">
              <span className="font-cursive text-primary drop-shadow-sm sm:text-6xl md:text-7xl">Taylor-Made</span>
              <span className="font-serif text-neutral-700">Concierge Memberships</span>
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              Every Taylor-Made client is welcomed with a personal invitation, a bespoke plan, and concierge-level execution. From the first whisper of registry ideas to the final nursery reveal, each detail is choreographed with gentle precision.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
              >
                Request Invitation
              </Link>
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-primary shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink/45"
              >
                View Packages
              </a>
            </div>
          </div>
          <div className="relative hidden h-full w-full justify-end lg:flex">
            <div className="relative flex w-full max-w-md flex-col gap-5">
              <div className="overflow-hidden rounded-[3rem] border border-white/80 shadow-dreamy">
                <img
                  src={membershipHeroPrimary}
                  alt="Expecting parents reviewing concierge plans"
                  className="h-80 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="ml-auto w-3/4 overflow-hidden rounded-[2.5rem] border border-white/70 shadow-soft">
                <img
                  src={membershipHeroSecondary}
                  alt="Concierge sharing swatches with a couple"
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {membershipHeroHighlights.map((item) => (
            <HeroHighlight key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-[3.5rem] border border-primary/25 bg-white/92 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Try Before You Join</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">Taylor-Made Concierge Preview</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Sample the concierge suite with a guided preview. Explore curated collections, message Taylor, and experience concierge touchpoints before selecting your membership tier.
          </p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewHighlights.map((item) => (
            <HeroHighlight key={item.title} {...item} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {previewTimeline.map(({ phase, title, description }) => (
            <article key={title} className="surface-card h-full text-left text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
              <span className="text-xs font-heading uppercase tracking-[0.6em] text-primary/70">{phase}</span>
              <h3 className="mt-3 font-serif text-lg text-blueberry">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
            </article>
          ))}
        </div>
        <div className="space-y-4">
          {previewFaqs.map(({ question, answer }) => (
            <article key={question} className="surface-card text-left text-blueberry transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md">
              <h3 className="text-sm font-heading uppercase tracking-[0.3em] text-primary/70">{question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{answer}</p>
            </article>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 text-center text-sm text-neutral-600">
          <p>Ready to explore? Request your preview invite and spend a week inside the concierge suite before you choose a membership.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/request-invite" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md">
              Request Preview Invite
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-primary shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink/45">
              Discuss Your Options
            </Link>
          </div>
        </div>
      </section>

      <section id="packages" className="mx-auto max-w-6xl space-y-10 rounded-[3.5rem] border border-primary/25 bg-softPink/35 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Packages</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">Taylor-Made Baby Co. Packages</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Choose a membership tier that reflects your season. Each package scales concierge support, design direction, and celebration planning—always with Taylor’s signature discretion.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {membershipTiers.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-primary/80">
          Essentials anchors the must-haves · Signature delivers the dream-life ease · Bespoke remains invite-only for limitless support
        </p>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-[3.5rem] border border-primary/25 bg-white/92 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Concierge Pillars</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">Signature Concierge Services</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            These pillars shape every package. Mix, layer, and expand them as your family grows—each one personally directed by Taylor for a seamless experience.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {conciergePillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-[3.5rem] border border-primary/25 bg-softMint/40 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Membership Moments</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">Membership Keeps You Connected</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Membership opens a private circle of insight, camaraderie, and ongoing touchpoints. Whether you prefer curated guides, mentor access, or white-glove discretion, you are never navigating motherhood alone.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {membershipBenefits.map((highlight) => (
            <MembershipCard key={highlight.title} {...highlight} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-3 text-center text-sm text-neutral-600">
          <p>Ready to step inside? Share your details and Taylor will confirm invitation availability within 24 hours.</p>
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md">
            Request Membership Chat
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Membership;
