import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";

const addOnSections = [
  {
    title: "Nursery & Home",
    description: "From mood board to midnight feeding lighting, each space is styled and installed for calm, functional luxury.",
    services: [
      {
        name: "Full Nursery Install",
        blurb: "Furniture sourcing, white-glove delivery coordination, on-site styling, and safety walk-through.",
        beta: "$950",
        future: "$1,200",
      },
      {
        name: "Home Reset",
        blurb: "Organize primary living spaces for baby’s arrival — entry, kitchen, and family zones refreshed.",
        beta: "$550",
        future: "$720",
      },
    ],
  },
  {
    title: "Events & Social",
    description: "Celebrate quietly or lavishly; I handle guest lists, gifting, and discretion-first production.",
    services: [
      {
        name: "Sip & See Production",
        blurb: "Concepting, vendor coordination, bespoke favors, and on-site hosting support.",
        beta: "$1,400",
        future: "$1,850",
      },
      {
        name: "Signature Baby Shower",
        blurb: "Editorial styling, invitation suite, registry integration, and gratitude management.",
        beta: "$1,950",
        future: "$2,400",
      },
    ],
  },
  {
    title: "Gear & Shopping",
    description: "Concierge sourcing for every ride, feed, and fourth trimester essential — done with zero overwhelm.",
    services: [
      {
        name: "Car Seat & Stroller Concierge",
        blurb: "Hands-on trials, certified installations, and travel-ready packing strategy.",
        beta: "$425",
        future: "$575",
      },
      {
        name: "Layette & Hospital Bag Styling",
        blurb: "Capsule wardrobe, monogram coordination, and suitcase packing for baby + parents.",
        beta: "$375",
        future: "$520",
      },
    ],
  },
  {
    title: "Family & Lifestyle",
    description: "Support siblings, pets, and visiting family with thoughtful touches that keep harmony front and center.",
    services: [
      {
        name: "Sibling Integration Playdate",
        blurb: "Custom experience, gifting, and coaching to welcome baby with confidence.",
        beta: "$325",
        future: "$450",
      },
      {
        name: "Pet Transition Plan",
        blurb: "Trainer collaboration, home routine reset, and arrival-day schedule.",
        beta: "$295",
        future: "$410",
      },
    ],
  },
  {
    title: "Fourth Trimester",
    description: "Gentle, nourishing services for the first 90 days — curated experts, comfort items, and calm routines.",
    services: [
      {
        name: "Postpartum Haven Setup",
        blurb: "Nursing stations, pantry stocking, bathroom amenities, and nighttime comfort kit.",
        beta: "$475",
        future: "$640",
      },
      {
        name: "Sleep & Feeding Intensive",
        blurb: "Consultant pairing, schedule creation, and ongoing digital check-ins for two weeks.",
        beta: "$625",
        future: "$780",
      },
    ],
  },
];

const ServiceCard = ({ name, blurb, beta, future }) => (
  <article className="rounded-3xl border border-softGold/25 bg-white/85 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <header className="mb-4">
      <h3 className="font-serif text-xl text-deepSlate">{name}</h3>
      <p className="mt-2 text-sm text-cozyGray/75 leading-relaxed">{blurb}</p>
    </header>
    <dl className="flex flex-wrap items-center gap-3 text-[0.75rem] uppercase tracking-[0.2em] text-deepSlate/70">
      <div className="flex items-center gap-2">
        <dt className="text-softGold">Beta</dt>
        <dd>{beta}</dd>
      </div>
      <span className="text-softGold">/</span>
      <div className="flex items-center gap-2">
        <dt className="text-softGold">Future</dt>
        <dd>{future}</dd>
      </div>
    </dl>
    <button
      type="button"
      className="mt-6 inline-flex items-center justify-center rounded-full border border-deepSlate/20 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-deepSlate transition hover:border-deepSlate/40 hover:bg-white"
    >
      Add to Journey
    </button>
  </article>
);

const AddOns = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section
        title="Curated Add-Ons"
        tightTop
        compact
        center
        className="bg-gradient-to-br from-blush/45 via-white to-softGold/25"
      >
        <div className="space-y-8">
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-cozyGray/75">
            Each service layers seamlessly onto your membership package. Select the moments you want elevated now, and we’ll handle timing, talent, and every last signature detail.
          </p>
          <Link to="/contact" className="btn-primary px-7 py-3 text-xs sm:text-sm">
            Request Add-On Planning
          </Link>
        </div>
      </Section>
      {addOnSections.map((section) => (
        <Section key={section.title} title={section.title} compact className="bg-alt-blue">
          <div className="space-y-4 text-cozyGray/75">
            <p className="text-sm sm:text-base leading-relaxed">{section.description}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {section.services.map((service) => (
                <ServiceCard key={service.name} {...service} />
              ))}
            </div>
          </div>
        </Section>
      ))}
    </div>
  );
};

export default AddOns;
