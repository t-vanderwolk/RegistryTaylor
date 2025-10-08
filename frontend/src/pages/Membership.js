import React from "react";
import { CheckCircleIcon, SparklesIcon, StarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import PageTitle from "../components/UI/PageTitle";

const membershipTiers = [
  {
    id: "community-salon",
    name: "Community Salon",
    investment: "$680",
    cadence: "per family",
    description: "Digital concierge touchpoints, quarterly salons, and access to Taylor’s private resource library.",
    features: [
      "Seasonal planning salons with live Q&A",
      "Digital resource library & checklists",
      "Members-only community lounge",
    ],
    background: "bg-[#FAEEF6]",
    border: "border-[#EFD3E4]/70",
  },
  {
    id: "signature-concierge",
    name: "Signature Concierge",
    investment: "From $3,600",
    cadence: "per pregnancy",
    description: "Most-loved tier for registry orchestration, nursery styling, and event production support.",
    features: [
      "Weekly concierge check-ins",
      "Registry design & gifting etiquette",
      "Nursery floor plan + styling support",
      "Celebration planning + vendor curation",
    ],
    background: "bg-[#F5DFEA]",
    border: "border-[#DABFD2]/70",
    highlight: "Most loved",
  },
  {
    id: "bespoke-retainer",
    name: "Bespoke Retainer",
    investment: "By invitation",
    cadence: "seasonal",
    description: "A private retainer for families seeking 24/7 concierge access, travel coordination, and couture reveals.",
    features: [
      "24/7 concierge hotline",
      "Private travel & relocation planning",
      "Couture nursery + celebration production",
      "Family lifestyle management under NDA",
    ],
    background: "bg-[#EAD8E6]",
    border: "border-[#D6BBD0]",
  },
];

const membershipBenefits = [
  { title: "Registry Concierge", description: "Multi-retailer lists, white-glove returns, and gifting etiquette tailored to your circle.", icon: SparklesIcon },
  { title: "Rhythm Planning", description: "Timelines, appointments, and travel plans coordinated around how you actually live.", icon: UserGroupIcon },
  { title: "Nursery & Home", description: "Floor plans, scent layering, and styling days that keep your home feeling like you.", icon: CheckCircleIcon },
  { title: "Fourth Trimester Care", description: "Night nurse introductions, postpartum rituals, and daily check-ins for calm nights.", icon: StarIcon },
];

const memberReflections = [
  {
    quote: "Our concierge tier felt like a deep exhale. Taylor anticipated everything — from registry drops to how our families celebrate.",
    name: "Avery & Jordan Parker",
  },
  {
    quote: "Bespoke made cross-country living seamless. The team orchestrated vendors quietly while we focused on rest.",
    name: "Sloane & Carter Wells",
  },
];

const Membership = () => {
  return (
    <div className="space-y-24 bg-[#FFF8F2] pb-24 pt-16 text-[#4A3B2E] sm:space-y-28">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-2xl bg-gradient-to-br from-[#F7E5EE] via-[#FFF8F2] to-[#E4CFDA] p-6 text-center shadow-md sm:p-12">
        <PageTitle eyebrow="Memberships" subtitle="Membership" />
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
          Membership opens the door to calm decision making, heartfelt celebrations, and gentle accountability. Choose the tier that fits your season — every option includes Taylor’s personal oversight and NDA-backed discretion.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C17BA5] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            Chat with Taylor
          </Link>
          <Link
            to="/request-invite"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#C17BA5]/50 bg-white/85 px-8 py-3 text-sm font-semibold text-[#5E5873] shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            Request Invite
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-8 px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {membershipTiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex h-full flex-col gap-6 rounded-2xl border ${tier.border} ${tier.background} p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
            >
              {tier.highlight && (
                <span className="absolute right-6 top-6 rounded-full bg-[#C17BA5] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-sm">
                  {tier.highlight}
                </span>
              )}
              <div className="space-y-2 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#5E5873]">{tier.name}</p>
                <h2 className="text-3xl font-serif text-[#4A3B2E]">{tier.investment}</h2>
                <p className="text-xs uppercase tracking-[0.35em] text-[#5E5873]/70">{tier.cadence}</p>
                <p className="text-sm leading-relaxed text-[#5E5873]">{tier.description}</p>
              </div>
              <ul className="space-y-3 text-sm text-[#332E4F]">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-[#C8A2C8]" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  to="/contact"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#C17BA5] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
                >
                  Explore This Tier
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A2C8]">Benefits</p>
          <h2 className="text-2xl font-serif text-[#332E4F] sm:text-3xl">Every tier comes with concierge care</h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
            From first trimester calm to fourth trimester care, Taylor-Made wraps every milestone in thoughtful structure so you can stay present.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {membershipBenefits.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-[#E2CAD9]/60 bg-white/85 p-6 text-left shadow-md backdrop-blur-sm"
            >
              <Icon className="h-8 w-8 text-[#C8A2C8]" aria-hidden="true" />
              <h3 className="text-lg font-serif text-[#332E4F]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#5E5873]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-[#C8A2C8]/30 bg-white/80 p-6 text-center shadow-md backdrop-blur-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A2C8]">Member Love</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {memberReflections.map((reflection) => (
            <article key={reflection.name} className="flex h-full flex-col gap-4 rounded-2xl border border-[#E5CFDA]/50 bg-white/90 p-6 text-left shadow-sm">
              <p className="text-lg font-serif text-[#332E4F]">“{reflection.quote}”</p>
              <p className="text-sm text-[#5E5873]">{reflection.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#C17BA5]/80 via-[#E7CFDD]/75 to-[#F9E3EE]/80 p-6 text-center text-[#332E4F] shadow-md sm:p-12">
        <h2 className="text-2xl font-serif sm:text-3xl">Secure Lifetime Access with Peace of Mind — 100% Satisfaction Guarantee.</h2>
        <p className="text-sm leading-relaxed text-[#5E5873] sm:text-base">
          If the experience doesn’t feel like your match within 30 days, your investment is fully refundable.
        </p>
        <div>
          <Link
            to="/request-invite"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C17BA5] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            Secure Your Invite
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Membership;
