import React from "react";
import { Link } from "react-router-dom";

import PageHero from "../components/UI/PageHero";
import Button from "../components/UI/Button";
import SectionDivider from "../components/UI/SectionDivider";

import {
  membershipHeroHighlights,
  membershipTiers,
  conciergePillars,
  membershipBenefits,
} from "../data/membership";

import membershipHeroPrimary from "../assets/couple-happy.jpeg";
import membershipHeroSecondary from "../assets/belly-hug.jpeg";

const cardBaseClasses =
  "flex h-full flex-col gap-4 rounded-3xl border border-primary/20 bg-white/95 p-6 text-blueberry shadow-soft transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-dreamy";

const fadeInClass = "motion-safe:animate-fade-in-up";

const HeroHighlight = ({ icon, title, blurb }) => (
  <article className={`${cardBaseClasses} text-left`}>
    <span className="text-2xl">{icon}</span>
    <h3 className="font-heading text-lg">{title}</h3>
    <p className="text-sm leading-relaxed text-blueberry/75">{blurb}</p>
  </article>
);

const PackageCard = ({ pkg }) => (
  <article className={cardBaseClasses}>
    <header className="space-y-2">
      {pkg.tag && (
        <p className="text-[0.65rem] font-heading uppercase tracking-[0.35em] text-primary/70">{pkg.tag}</p>
      )}
      <h3 className="font-heading text-2xl text-blueberry">{pkg.name}</h3>
      {pkg.startingPrice && (
        <p className="text-xs font-heading uppercase tracking-[0.28em] text-blueberry/60">
          {pkg.startingPrice.startsWith("$") ? `Starting at ${pkg.startingPrice}` : pkg.startingPrice}
        </p>
      )}
    </header>
    <p className="text-sm leading-relaxed text-blueberry/75">{pkg.intro}</p>
    {pkg.headline && (
      <p className="text-xs font-heading uppercase tracking-[0.25em] text-primary/70">{pkg.headline}</p>
    )}
    <ul className="space-y-2 text-sm text-blueberry/75">
      {pkg.items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1 text-primary">◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <Button as="link" to="/contact" size="sm" className="mt-auto bg-primary !text-white px-6 py-3">
      Start with {pkg.name}
    </Button>
  </article>
);

const PillarCard = ({ icon, title, blurb, points }) => (
  <article className={cardBaseClasses}>
    <div className="flex items-start gap-3">
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-heading text-xl">{title}</h3>
        <p className="mt-2 text-sm text-blueberry/75">{blurb}</p>
      </div>
    </div>
    <ul className="space-y-2 text-sm text-blueberry/75">
      {points.map((point) => (
        <li key={point} className="flex items-start gap-2">
          <span className="mt-1 text-primary">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </article>
);

const MembershipBenefitCard = ({ icon, title, summary, details = [] }) => (
  <article className={cardBaseClasses}>
    <div className="flex items-center gap-3">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-heading text-xl">{title}</h3>
    </div>
    <p className="text-sm text-blueberry/75">{summary}</p>
    {details.length > 0 && (
      <ul className="space-y-2 text-sm text-blueberry/75">
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
    <div className="space-y-24 pb-28 pt-16 sm:space-y-28">
      <PageHero
        backgroundImage={membershipHeroPrimary}
        eyebrow="Concierge Membership"
        subtitle="Concierge Memberships"
        description="Memberships scale from curated registries to full celebration concierge. Your season, your pace, Taylor’s soft guidance."
        primaryCta={{ label: "Book a Consultation", to: "/contact", className: "px-9 py-3" }}
        secondaryCta={{ label: "Request Invite", href: "#request-invite", as: "a", className: "px-9 py-3" }}
      >
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-8 text-left">
            <div className="grid gap-4 sm:grid-cols-3">
              {membershipHeroHighlights.map((item) => (
                <HeroHighlight key={item.title} {...item} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6 rounded-[3rem] border border-gold/25 bg-white/90 px-5 py-5 shadow-soft backdrop-blur-sm">
              <div className="text-left">
                <p className="text-xs font-heading uppercase tracking-[0.35em] text-primary/80">Swift onboarding</p>
                <p className="mt-1 text-sm text-blueberry/75">Video consult, inspiration boards, and concierge roadmap within 72 hours.</p>
              </div>
              <Button as="link" to="/request-invite" size="sm" className="bg-primary !text-white px-6 py-3">
                Request Invite
              </Button>
            </div>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 sm:auto-rows-[200px] lg:auto-rows-[240px]">
            <figure className="sm:col-span-2 sm:row-span-2 overflow-hidden rounded-[2.75rem] border border-white/70 shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-dreamy">
              <img src={membershipHeroPrimary} alt="Expecting parents reviewing concierge plans" className="h-full w-full object-cover" loading="lazy" />
            </figure>
            <figure className="overflow-hidden rounded-[2.75rem] border border-white/70 shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-dreamy">
              <img src={membershipHeroSecondary} alt="Concierge sharing swatches" className="h-full w-full object-cover" loading="lazy" />
            </figure>
          </div>
        </div>
      </PageHero>

      <section className={`mx-auto max-w-[1200px] rounded-[3.25rem] border border-primary/25 bg-softPink/35 px-6 py-16 shadow-soft backdrop-blur-sm sm:px-10 md:px-16 ${fadeInClass}`} id="packages">
        <header className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">Packages</p>
          <h2 className="mt-3 text-3xl font-heading text-blueberry sm:text-4xl">Taylor-Made Baby Co. Packages</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-blueberry/75 sm:text-base">
            Choose a membership tier that reflects your season. Each package scales concierge support, design direction, and celebration planning — always with Taylor’s signature discretion.
          </p>
          <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30" />
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {membershipTiers.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <SectionDivider className="my-10" />
        <p className="text-center text-xs font-heading uppercase tracking-[0.3em] text-primary/80">
          Essentials anchors the must-haves · Signature delivers the dream-life ease · Bespoke remains invite-only for limitless support
        </p>
      </section>

      <section className={`mx-auto max-w-[1200px] rounded-[3.25rem] border border-primary/25 bg-white/95 px-6 py-16 shadow-soft backdrop-blur-sm sm:px-10 md:px-16 ${fadeInClass}`}>
        <header className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">Concierge Pillars</p>
          <h2 className="mt-3 text-3xl font-heading text-blueberry sm:text-4xl">Signature Concierge Services</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-blueberry/75 sm:text-base">
            These pillars shape every package. Mix, layer, and expand them as your family grows — each one personally directed by Taylor for a seamless experience.
          </p>
          <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30" />
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {conciergePillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </section>

      <section className={`mx-auto max-w-[1200px] rounded-[3.25rem] border border-primary/25 bg-softMint/40 px-6 py-16 shadow-soft backdrop-blur-sm sm:px-10 md:px-16 ${fadeInClass}`}>
        <header className="text-center">
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">Membership Moments</p>
          <h2 className="mt-3 text-3xl font-heading text-blueberry sm:text-4xl">Membership Keeps You Connected</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-blueberry/75 sm:text-base">
            Membership opens a private circle of insight, camaraderie, and ongoing touchpoints. Whether you prefer curated guides, mentor access, or white-glove discretion, you are never navigating motherhood alone.
          </p>
          <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30" />
        </header>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {membershipBenefits.map((highlight) => (
            <MembershipBenefitCard key={highlight.title} {...highlight} />
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-3 pt-8 sm:flex-row sm:justify-center">
          <Button as="link" to="/contact" size="md" className="bg-primary !text-white px-8 py-3">
            Request Membership Chat
          </Button>
          <Button as="link" to="/request-invite" size="md" variant="white" className="px-8 py-3">
            Request Invite
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Membership;
