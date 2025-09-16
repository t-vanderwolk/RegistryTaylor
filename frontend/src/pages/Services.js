import React from "react";
import Section from "../components/UI/Section";

const pillars = [
  {
    title: "Registry & Gear Curation",
    blurb: "I discreetly build, manage, and maintain your registry across every retailer you love.",
    points: [
      "Tailored registries across Target, Amazon, Pottery Barn Kids, Nordstrom, and more",
      "Private access to hard-to-find or luxury products",
      "You approve — I handle every update, return, and exchange"
    ],
  },
  {
    title: "Personal Shopping & Concierge",
    blurb: "Everything from the first stroller trial to the final layette arrives ready for baby.",
    points: [
      "In-home or virtual consultations scheduled around your calendar",
      "White-glove delivery and setup of strollers, car seats, and high chairs",
      "VIP retailer coordination and early-release access",
      "Curated wardrobe styling for travel, hospital, and first-week essentials"
    ],
  },
  {
    title: "Nursery & Home Design",
    blurb: "Create a calming space that blends seamlessly with your home and grows with your family.",
    points: [
      "Furniture curation, floor plans, and installation oversight",
      "Collaboration with your interior designer to match existing style",
      "Safety integration that disappears into the décor",
      "Seasonal refreshes for holidays, milestones, and guests"
    ],
  },
  {
    title: "Event & Social Planning",
    blurb: "Celebrate every chapter without lifting a finger — I manage every discreet detail.",
    points: [
      "Baby shower and sip-and-see production with trusted vendors",
      "Curated gifting experiences with bespoke favors and thank-yous",
      "Luxury announcement cards and milestone photography coordination"
    ],
  },
  {
    title: "Family & Lifestyle Integration",
    blurb: "Keep every member of the household — pets included — feeling supported and seen.",
    points: [
      "Coaching around in-law expectations and family dynamics",
      "Sibling preparation experiences tailored to their ages",
      "Pet integration plans for a calm homecoming",
      "Travel concierge services with installs, packing, and itineraries"
    ],
  },
  {
    title: "Ongoing Support & Transitions",
    blurb: "From fourth trimester to toddler life, your concierge for every next step.",
    points: [
      "Postpartum planning, meal prep, and vetted night-nurse introductions",
      "Scheduling with trusted lactation consultants, photographers, and nanny agencies",
      "Beyond-baby services for toddler gear, preschool prep, and travel"
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

const Services = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section title="Taylor-Made Services" tightTop compact className="bg-alt-blue">
        <div className="mx-auto max-w-3xl text-center text-cozyGray/80 mb-10">
          <p className="text-lg leading-relaxed">
            As an invite-only concierge, every offering is ultra-curated, discreet, and personally overseen by Taylor. Clients trust me to anticipate needs before they surface, handle the logistics no one has time for, and deliver experiences worthy of a high-profile family.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="cc-card text-left">
              <h3 className="font-serif text-2xl text-deepSlate mb-2">{pillar.title}</h3>
              <p className="text-cozyGray/75 mb-4">{pillar.blurb}</p>
              <ul className="space-y-2 text-cozyGray/85 text-sm">
                {pillar.points.map((point, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-softGold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Taylor-Made Baby Planning Packages" compact className="bg-alt-pink">
        <div className="mx-auto max-w-3xl text-center text-cozyGray/75 mb-10">
          <p className="leading-relaxed">
            Choose the level of concierge support that best reflects your season. Every package is intentionally designed to feel essential, exclusive, and high-touch — with the flexibility to layer in bespoke moments whenever you need them.
          </p>
        </div>
        <div className="grid gap-8">
          {packages.map((pkg) => (
            <article key={pkg.name} className="cc-card text-left">
              <header className="mb-4">
                <div className="text-sm uppercase tracking-[0.3em] text-softGold">{pkg.tag}</div>
                <h3 className="font-serif text-3xl text-deepSlate mt-2">{pkg.name}</h3>
              </header>
              <p className="text-cozyGray/75 mb-4 leading-relaxed">{pkg.intro}</p>
              {pkg.headline && (
                <p className="text-sm font-medium uppercase tracking-wide text-cozyGray/70 mb-3">
                  {pkg.headline}
                </p>
              )}
              <ul className="space-y-2 text-cozyGray/85">
                {pkg.items.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-softGold mt-1">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center text-cozyGray/70">
          <p className="text-sm italic">
            Essentials anchors the must-haves, Signature delivers the dream-life ease, and Bespoke remains an invite-only tier for families seeking complete discretion and limitless support.
          </p>
        </div>
      </Section>
      <Section title="Taylor-Made Membership Perks" compact className="bg-alt-green">
        <div className="mx-auto max-w-3xl text-center text-cozyGray/75 mb-10">
          <p className="leading-relaxed">
            Membership is your invitation into a private, like-minded community. No matter the package, you step into a circle that treats discretion, insight, and shared experience as non-negotiables.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="cc-card text-left">
            <h3 className="font-serif text-2xl text-deepSlate mb-3">Taylor-Made Blog</h3>
            <ul className="space-y-2 text-cozyGray/85 text-sm leading-relaxed">
              <li>• Private access to curated guides: stroller + car seat comparisons, nursery design tips, registry hacks, travel prep, and family dynamics.</li>
              <li>• Insider updates on launches, recalls, and luxury brand drops.</li>
              <li>• Seasonal checklists covering hospital bags, holiday prep, and toddler transitions.</li>
            </ul>
          </article>
          <article className="cc-card text-left">
            <h3 className="font-serif text-2xl text-deepSlate mb-3">Taylor-Made Mentors</h3>
            <ul className="space-y-2 text-cozyGray/85 text-sm leading-relaxed">
              <li>• Access to Taylor-Made Mom Mentors for lived wisdom and encouragement.</li>
              <li>• Personalized pairings with mentors who mirror your lifestyle — celebrity, twin, working, or first-time moms.</li>
              <li>• Invitation to grow into a mentor yourself, building a legacy of peer-to-peer guidance.</li>
            </ul>
          </article>
        </div>
        <div className="mt-8 cc-card text-left border border-softGold/30">
          <h3 className="font-serif text-xl text-deepSlate mb-2">Membership Promise</h3>
          <ul className="space-y-2 text-cozyGray/85 text-sm leading-relaxed">
            <li>• Discretion first — every client is protected by confidentiality agreements and NDAs.</li>
            <li>• Consultations, registries, and events remain private and personally overseen.</li>
            <li>• Membership frames each package as entry into an exclusive club, rather than an add-on service.</li>
          </ul>
        </div>
      </Section>
    </div>
  );
};

export default Services;
