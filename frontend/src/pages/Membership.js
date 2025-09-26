import React from "react";
import { Link } from "react-router-dom";
import {
  membershipHeroHighlights,
  membershipTiers,
  conciergePillars,
  membershipBenefits,
} from "../data/membership";

const HeroHighlight = ({ icon, title, blurb }) => (
  <article className="surface-card flex flex-col items-start gap-3 text-blueberry">
    <span className="text-2xl">{icon}</span>
    <h3 className="font-heading text-lg">{title}</h3>
    <p className="text-sm leading-relaxed text-midnight/75">{blurb}</p>
  </article>
);

const PackageCard = ({ pkg }) => (
  <article className="surface-card flex h-full flex-col gap-4 text-blueberry">
    <header className="space-y-2">
      {pkg.tag && (
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-blueberry/50">{pkg.tag}</p>
      )}
      <h3 className="font-heading text-2xl text-blueberry">{pkg.name}</h3>
      {pkg.startingPrice && (
        <p className="text-xs uppercase tracking-[0.3em] text-blueberry/60">
          {pkg.startingPrice.startsWith("$") ? `Starting at ${pkg.startingPrice}` : pkg.startingPrice}
        </p>
      )}
    </header>
    <p className="text-sm leading-relaxed text-midnight/80">{pkg.intro}</p>
    {pkg.headline && (
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blueberry/60">
        {pkg.headline}
      </p>
    )}
    <ul className="space-y-2 text-sm text-midnight/75">
      {pkg.items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1 text-babyBlue">◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <Link
      to="/contact"
      className="mt-auto inline-flex items-center justify-center rounded-full border border-babyBlue/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.25em] text-blueberry transition hover:-translate-y-0.5 hover:bg-babyPink/40 focus:outline:none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
    >
      Start with {pkg.name}
    </Link>
  </article>
);

const PillarCard = ({ icon, title, blurb, points }) => (
  <article className="surface-card flex flex-col gap-3 text-blueberry">
    <div className="flex items-start gap-3">
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-heading text-xl">{title}</h3>
        <p className="mt-2 text-sm text-midnight/70">{blurb}</p>
      </div>
    </div>
    <ul className="space-y-2 text-sm text-midnight/75">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2">
          <span className="mt-1 text-babyBlue">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </article>
);

const MembershipCard = ({ icon, title, summary, details = [] }) => (
  <article className="surface-card flex flex-col gap-3 text-blueberry">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-heading text-xl">{title}</h3>
    </div>
    <p className="text-sm text-midnight/75">{summary}</p>
    {details.length > 0 && (
      <ul className="space-y-2 text-sm text-midnight/70">
        {details.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <span className="mt-1 text-babyBlue">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    )}
  </article>
);

const Membership = () => {
  return (
    <main className="space-y-10 pb-24 sm:space-y-16">
      <section className="surface-panel text-center text-blueberry">
        <p className="text-xs font-heading uppercase tracking-[0.45em] text-blueberry/60">
          Invite-Only Concierge
        </p>
        <h1 className="mt-3 text-3xl font-heading sm:text-4xl">Your Inner-Circle Concierge</h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-midnight/80 sm:text-base">
          Every Taylor-Made client is welcomed with a personal invitation, a bespoke plan, and concierge-level execution. From the first whisper of registry ideas to the final nursery reveal, every detail is curated discreetly and delivered with ease.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/contact" className="btn-primary px-8 py-3 text-xs sm:text-sm">
            Request Invitation
          </Link>
          <a
            href="#packages"
            className="btn-secondary px-8 py-3 text-xs sm:text-sm"
          >
            View Packages
          </a>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {membershipHeroHighlights.map((item) => (
            <HeroHighlight key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section id="packages" className="surface-panel text-blueberry">
        <header className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/60">
            Packages
          </p>
          <h2 className="mt-3 text-3xl font-heading">Taylor-Made Baby Co. Packages</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-midnight/75">
            Choose a membership tier that reflects the season you are in. Each package scales the level of concierge support, design, and celebration while keeping Taylor’s signature discretion.
          </p>
        </header>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {membershipTiers.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-blueberry/60">
          Essentials anchors the must-haves · Signature delivers the dream-life ease · Bespoke remains invite-only for limitless support
        </p>
      </section>

      <section className="surface-panel text-blueberry">
        <header className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/60">
            Concierge Pillars
          </p>
          <h2 className="mt-3 text-3xl font-heading">Signature Concierge Services</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-midnight/75">
            These pillars shape every package. Mix, layer, and expand them as your family grows — each one personally directed by Taylor for a seamless experience.
          </p>
        </header>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {conciergePillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>

      <section className="surface-panel text-blueberry">
        <header className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.35em] text-blueberry/60">
            Membership Moments
          </p>
          <h2 className="mt-3 text-3xl font-heading">Membership Keeps You Connected</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-midnight/75">
            Membership opens a private circle of insight, camaraderie, and ongoing touchpoints. Whether you prefer curated guides, mentor access, or white-glove discretion, you are never navigating motherhood alone.
          </p>
        </header>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {membershipBenefits.map((highlight) => (
            <MembershipCard key={highlight.title} {...highlight} />
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 text-center text-sm text-midnight/70">
          <p>Ready to step inside? Share your details and Taylor will confirm invitation availability within 24 hours.</p>
          <Link to="/contact" className="btn-primary px-8 py-3 text-xs sm:text-sm">
            Request Membership Chat
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Membership;
