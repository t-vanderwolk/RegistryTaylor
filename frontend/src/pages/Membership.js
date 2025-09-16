import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";

const heroHighlights = [
  {
    icon: "🔐",
    title: "Invite-Only Access",
    blurb: "Every journey begins with a personal invitation and unique authorization code for total discretion.",
  },
  {
    icon: "🪄",
    title: "Concierge Expertise",
    blurb: "From registry to nursery reveals, Taylor anticipates what’s next so you can stay present.",
  },
  {
    icon: "🤍",
    title: "Signature Finish",
    blurb: "Each milestone is styled, scheduled, and delivered with the warmth of a trusted confidante.",
  },
];

const packageAccents = [
  "from-babyBlue/50 via-white to-softGold/25",
  "from-pastelPurple/40 via-white to-softGold/30",
  "from-pastelGreen/45 via-white to-softGold/25",
];

const pillars = [
  {
    icon: "🗂️",
    title: "Registry & Gear Curation",
    blurb: "I discreetly build, manage, and maintain your registry across every retailer you love.",
    points: [
      "Tailored registries across Target, Amazon, Pottery Barn Kids, Nordstrom, and more",
      "Private access to hard-to-find or luxury products",
      "You approve — I handle every update, return, and exchange",
    ],
  },
  {
    icon: "🛍️",
    title: "Personal Shopping & Concierge",
    blurb: "Everything from the first stroller trial to the final layette arrives ready for baby.",
    points: [
      "In-home or virtual consultations scheduled around your calendar",
      "White-glove delivery and setup of strollers, car seats, and high chairs",
      "VIP retailer coordination and early-release access",
      "Curated wardrobe styling for travel, hospital, and first-week essentials",
    ],
  },
  {
    icon: "🏡",
    title: "Nursery & Home Design",
    blurb: "Create a calming space that blends seamlessly with your home and grows with your family.",
    points: [
      "Furniture curation, floor plans, and installation oversight",
      "Collaboration with your interior designer to match existing style",
      "Safety integration that disappears into the décor",
      "Seasonal refreshes for holidays, milestones, and guests",
    ],
  },
  {
    icon: "🥂",
    title: "Event & Social Planning",
    blurb: "Celebrate every chapter without lifting a finger — I manage every discreet detail.",
    points: [
      "Baby shower and sip-and-see production with trusted vendors",
      "Curated gifting experiences with bespoke favors and thank-yous",
      "Luxury announcement cards and milestone photography coordination",
    ],
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family & Lifestyle Integration",
    blurb: "Keep every member of the household — pets included — feeling supported and seen.",
    points: [
      "Coaching around in-law expectations and family dynamics",
      "Sibling preparation experiences tailored to their ages",
      "Pet integration plans for a calm homecoming",
      "Travel concierge services with installs, packing, and itineraries",
    ],
  },
  {
    icon: "🌙",
    title: "Ongoing Support & Transitions",
    blurb: "From fourth trimester to toddler life, your concierge for every next step.",
    points: [
      "Postpartum planning, meal prep, and vetted night-nurse introductions",
      "Scheduling with trusted lactation consultants, photographers, and nanny agencies",
      "Beyond-baby services for toddler gear, preschool prep, and travel",
    ],
  },
];

const packages = [
  {
    name: "Essentials",
    tag: "Foundation Tier",
    intro: "For families who want stress-free registry and gear support handled start to finish.",
    items: [
      "Curated baby registries across Amazon, Target, Pottery Barn Kids, Nordstrom, and more",
      "Personal shopping recommendations for strollers, car seats, and everyday gear",
      "White-glove returns and exchanges managed discreetly",
      "One virtual or in-home consultation",
      "Access to Taylor’s vetted vendor list — nannies, doulas, night nurses, lactation consultants",
    ],
  },
  {
    name: "Signature",
    tag: "Most Popular Tier",
    intro: "For clients who want the registry experience plus nursery and lifestyle guidance.",
    headline: "Includes everything in Essentials, plus:",
    items: [
      "Full nursery design plan with furniture curation and décor styling",
      "In-home personal shopping and setup of gear",
      "Baby wardrobe essentials shopping for hospital, travel, and first weeks",
      "Travel preparation concierge — car seat installs, stroller packing, airport support",
      "Family integration planning for siblings, pets, and in-laws",
    ],
  },
  {
    name: "Bespoke",
    tag: "Invite-Only Tier",
    intro: "A fully private, white-glove experience built for high-profile clients who want every detail handled.",
    headline: "Includes everything in Signature, plus:",
    items: [
      "Custom event planning for baby showers, sip-and-sees, and announcements",
      "Full nursery install with on-site styling visits",
      "Concierge coordination with luxury retailers and early product access",
      "Personalized gifting experiences and thank-you management",
      "Fourth trimester planning — postpartum setup, night nurse/doula scheduling, curated meal support",
      "Ongoing quarterly check-ins for new stages, toddler gear, and preschool prep",
    ],
  },
];

const membershipHighlights = [
  {
    icon: "📒",
    title: "Taylor-Made Blog",
    points: [
      "Curated guides: stroller + car seat comparisons, nursery design tips, registry hacks, and travel prep",
      "Insider updates on launches, recalls, and luxury brand drops",
      "Seasonal checklists covering hospital bags, holiday prep, and toddler transitions",
    ],
  },
  {
    icon: "🤝",
    title: "Taylor-Made Mentors",
    points: [
      "Access to the Mentor Circle for lived wisdom and encouragement",
      "Personalized pairings with mentors who mirror your lifestyle",
      "Opportunities to become a mentor and gift guidance forward",
    ],
  },
  {
    icon: "💫",
    title: "Membership Promise",
    points: [
      "Discretion first — every client is protected by confidentiality agreements and NDAs",
      "Consultations, registries, and events remain private and personally overseen",
      "Membership frames each package as entry into an exclusive inner circle",
    ],
  },
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

const MembershipCard = ({ icon, title, points }) => (
  <article className="relative overflow-hidden rounded-3xl border border-softGold/25 bg-white/85 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <div className="flex items-center gap-3 text-deepSlate">
      <span className="text-3xl">{icon}</span>
      <h3 className="font-serif text-xl">{title}</h3>
    </div>
    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-cozyGray/80">
      {points.map((point, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="mt-1 text-softGold">•</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
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
            {heroHighlights.map((item) => (
              <HeroHighlight key={item.title} {...item} />
            ))}
          </div>
        </div>
      </Section>
      <Section title="Taylor-Made Baby Planning Packages" compact className="bg-alt-pink">
        <div id="packages" className="space-y-10">
          <div className="mx-auto max-w-3xl text-center text-cozyGray/75">
            <p className="leading-relaxed">
              Choose a membership tier that reflects the season you are in. Each package keeps the signature Taylor-Made discretion while scaling the level of concierge support, design, and celebration you crave.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <PackageCard key={pkg.name} pkg={pkg} accent={packageAccents[index % packageAccents.length]} />
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
            {pillars.map((pillar) => (
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
            {membershipHighlights.map((highlight) => (
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
