import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import {
  membershipHeroHighlights,
  membershipTiers,
  conciergePillars,
  membershipBenefits,
} from "../data/membership";

const packageAccents = [
  "from-babyBlue/50 via-white to-softGold/25",
  "from-pastelPurple/40 via-white to-softGold/30",
  "from-pastelGreen/45 via-white to-softGold/25",
];

const HeroHighlight = ({ icon, title, blurb }) => (
  <div className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <div className="flex items-center gap-3 text-deepSlate">
      <span className="text-2xl">{icon}</span>
      <h3 className="font-serif text-lg">{title}</h3>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-cozyGray/75">{blurb}</p>
  </div>
);

const PackageCard = ({ pkg, accent }) => (
  <article className="group relative overflow-hidden rounded-3xl border border-softGold/30 bg-white/90 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60 transition duration-500 group-hover:opacity-80`} />
    <div className="absolute inset-0 bg-white/20 mix-blend-lighten" />
    <div className="relative flex h-full flex-col p-6 sm:p-8">
      <header className="mb-4">
        <div className="text-[0.65rem] uppercase tracking-[0.35em] text-deepSlate/70">{pkg.tag}</div>
        <h3 className="mt-2 font-serif text-3xl text-deepSlate">{pkg.name}</h3>
      </header>
      {pkg.startingPrice && (
        <p className="text-xs uppercase tracking-[0.3em] text-softGold">
          {pkg.startingPrice.startsWith("$") ? `Starting at ${pkg.startingPrice}` : pkg.startingPrice}
        </p>
      )}
      <p className="text-sm leading-relaxed text-deepSlate/80">{pkg.intro}</p>
      {pkg.headline && (
        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-deepSlate/60">
          {pkg.headline}
        </p>
      )}
      <ul className="mt-4 space-y-2 text-sm text-deepSlate/80">
        {pkg.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 text-deepSlate/50">◆</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-1 flex-col justify-end">
        <Link
          to="/contact"
          className="mt-auto inline-flex items-center justify-center rounded-full border border-deepSlate/20 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-deepSlate transition hover:border-deepSlate/40 hover:bg-white"
        >
          Start with {pkg.name}
        </Link>
      </div>
    </div>
  </article>
);

const PillarCard = ({ icon, title, blurb, points }) => (
  <article className="group relative overflow-hidden rounded-3xl border border-softGold/25 bg-white/85 p-5 sm:p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <div className="flex items-start gap-3 text-deepSlate">
      <span className="text-3xl leading-none">{icon}</span>
      <div>
        <h3 className="font-serif text-xl">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cozyGray/75">{blurb}</p>
      </div>
    </div>
    <ul className="mt-4 space-y-2 text-sm text-cozyGray/80">
      {points.map((point, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="mt-1 text-softGold">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </article>
);

const MembershipCard = ({ icon, title, summary, details = [] }) => (
  <article className="relative overflow-hidden rounded-3xl border border-softGold/25 bg-white/85 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <div className="flex items-center gap-3 text-deepSlate">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-serif text-xl">{title}</h3>
    </div>
    <p className="mt-3 text-sm leading-relaxed text-cozyGray/80">{summary}</p>
    {details.length > 0 && (
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cozyGray/75">
        {details.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 text-softGold">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    )}
  </article>
);

const Membership = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section
        title="Your Inner-Circle Concierge"
        tightTop
        compact
        center
        className="bg-gradient-to-br from-babyBlue/40 via-white to-softGold/30"
      >
        <div className="space-y-8">
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-cozyGray/75">
            Every Taylor-Made client is welcomed with a personal invitation, a bespoke plan, and concierge-level execution. From the first whisper of registry ideas to the final nursery reveal, every detail is curated discreetly and delivered with ease.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm">
              Request Invitation
            </Link>
            <a
              href="#packages"
              className="btn-secondary px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm"
            >
              View Packages
            </a>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {membershipHeroHighlights.map((item) => (
              <HeroHighlight key={item.title} {...item} />
            ))}
          </div>
        </div>
      </Section>
      <Section title="Taylor-Made Baby Co. Packages" compact className="bg-alt-pink">
        <div id="packages" className="space-y-10">
          <div className="mx-auto max-w-3xl text-center text-cozyGray/75">
            <p className="leading-relaxed">
              Choose a membership tier that reflects the season you are in. Each package keeps the signature Taylor-Made discretion while scaling the level of concierge support, design, and celebration you crave.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {membershipTiers.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} accent={packageAccents[index % packageAccents.length]} />
            ))}
          </div>
          <div className="text-center text-sm italic text-cozyGray/70">
            Essentials anchors the must-haves, Signature delivers the dream-life ease, and Bespoke remains an invite-only tier for limitless, confidential support.
          </div>
        </div>
      </Section>
      <Section title="Signature Concierge Services" tightTop compact className="bg-alt-blue">
        <div className="space-y-10">
          <div className="mx-auto max-w-3xl text-center text-cozyGray/80">
            <p className="text-lg leading-relaxed">
              These pillars shape every package. Mix, layer, and expand them as your family grows — each one personally directed by Taylor for a seamless experience.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {conciergePillars.map((pillar) => (
              <PillarCard key={pillar.title} {...pillar} />
            ))}
          </div>
        </div>
      </Section>
      <Section title="Membership Keeps You Connected" compact className="bg-alt-green">
        <div className="space-y-10">
          <div className="mx-auto max-w-3xl text-center text-cozyGray/75">
            <p className="leading-relaxed">
              Membership opens a private circle of insight, camaraderie, and ongoing touchpoints. Whether you prefer curated guides, mentor access, or white-glove discretion, you are never navigating motherhood alone.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {membershipBenefits.map((highlight) => (
              <MembershipCard key={highlight.title} {...highlight} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 text-center text-sm text-cozyGray/70">
            <p>
              Ready to step inside? Share your details and I’ll confirm invitation availability within 24 hours.
            </p>
            <Link to="/contact" className="btn-primary px-7 py-2 text-xs sm:text-sm">
              Request Membership Chat
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Membership;
