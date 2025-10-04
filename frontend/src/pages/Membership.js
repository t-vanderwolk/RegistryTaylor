import React from "react";
import { CheckCircleIcon, SparklesIcon, StarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import PageTitle from "../components/UI/PageTitle";

const pricingTiers = [
  {
    name: "Community",
    price: "$500 one-time",
    description: "Lifetime community access, seasonal digital salons, and members-only resource drops.",
    features: [
      "Members-only forum",
      "Quarterly virtual salons",
      "Exclusive resource library"
    ],
    background: "bg-[#FCECF4]",
    border: "border-[#E9CADB]/70",
  },
  {
    name: "Essentials",
    price: "$1,499 one-time",
    description: "Digital planning suite, curated resource library, and community Q&A access.",
    features: [
      "Interactive planning hub",
      "Seasonal group salons",
      "Downloadable checklists"
    ],
    background: "bg-[#FBEEF6]",
    border: "border-[#EFD3E4]/70",
  },
  {
    name: "Concierge",
    price: "$3,499 one-time",
    description: "Most popular for hands-on support across registries, celebrations, and scheduling.",
    features: [
      "Concierge consult series",
      "Registry curation & tracking",
      "Event styling guidance",
      "Lifetime concierge messaging"
    ],
    background: "bg-[#F5DFEA]",
    border: "border-[#DABFD2]/70",
    popular: true,
  },
  {
    name: "VIP",
    price: "$6,499 one-time",
    description: "White-glove planning, 24/7 concierge, couture nursery design, and celebration hosting.",
    features: [
      "24/7 concierge hotline",
      "Private vendor sourcing",
      "In-home nursery styling",
      "Celebration hosting support"
    ],
    background: "bg-[#EAD8E6]",
    border: "border-[#D6BBD0]",
  },
];

const benefits = [
  { title: "Registry", description: "Tiered recommendations and gifting etiquette", icon: SparklesIcon },
  { title: "Scheduling", description: "Appointments, workshops, and celebration timelines", icon: UserGroupIcon },
  { title: "Checklists", description: "Week-by-week planning playbooks", icon: CheckCircleIcon },
  { title: "Community", description: "Member forum and expert office hours", icon: UserGroupIcon },
  { title: "Postpartum Care", description: "Fourth trimester guides and support matching", icon: StarIcon },
];

const testimonials = [
  {
    quote: "The concierge tier gave us confidence to make decisions quickly—and stay excited for every reveal.",
    name: "Harper & Leo",
  },
  {
    quote: "Taylor’s team handled vendors, registries, and a VIP shower while we focused on rest.",
    name: "Maya & Jordan",
  },
];

const Membership = () => {
  return (
    <div className="space-y-24 bg-[#FFF8F2] pb-24 pt-16 text-[#4A3B2E] sm:space-y-28">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-2xl bg-gradient-to-br from-[#F7E5EE] via-[#FFF8F2] to-[#E4CFDA] p-6 text-center shadow-md sm:p-12">
        <PageTitle eyebrow="Memberships" subtitle="Membership" />
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
          Every tier is curated for calm decision making, thoughtful celebrations, and joyful preparation. A single investment unlocks lifetime concierge access.
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
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex h-full flex-col gap-6 rounded-2xl border ${tier.border} ${tier.background} p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
            >
              {tier.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-[#C17BA5] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-sm">
                  Most Popular
                </span>
              )}
              <div className="space-y-2 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#5E5873]">{tier.name}</p>
                <h2 className="text-3xl font-serif text-[#4A3B2E]">{tier.price}</h2>
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
                  Join for Life
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A2C8]">Benefits</p>
          <h2 className="text-2xl font-serif text-[#332E4F] sm:text-3xl">Membership unlocks curated calm</h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
            Concierge support wraps every milestone—registries, nurseries, celebrations, and postpartum care—in soft structure and actionable plans.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
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
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="flex h-full flex-col gap-4 rounded-2xl border border-[#E5CFDA]/50 bg-white/90 p-6 text-left shadow-sm">
              <p className="text-lg font-serif text-[#332E4F]">“{testimonial.quote}”</p>
              <p className="text-sm text-[#5E5873]">{testimonial.name}</p>
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
            Secure Lifetime Access
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Membership;
