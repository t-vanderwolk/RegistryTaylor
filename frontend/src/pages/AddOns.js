import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import { addOnCategories } from "../data/addOns";

const ServiceCard = ({ name, blurb, betaPrice, futurePrice }) => (
  <article className="rounded-3xl border border-softGold/25 bg-white/85 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <header className="mb-4">
      <h3 className="font-serif text-xl text-deepSlate">{name}</h3>
      <p className="mt-2 text-sm text-cozyGray/75 leading-relaxed">{blurb}</p>
    </header>
    <dl className="flex flex-wrap items-center gap-3 text-[0.75rem] uppercase tracking-[0.2em] text-deepSlate/70">
      <div className="flex items-center gap-2">
        <dt className="text-softGold">Beta</dt>
        <dd>{betaPrice}</dd>
      </div>
      <span className="text-softGold">/</span>
      <div className="flex items-center gap-2">
        <dt className="text-softGold">Future</dt>
        <dd>{futurePrice}</dd>
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
      {addOnCategories.map((section) => (
        <Section key={section.id} title={section.title} compact className="bg-alt-blue">
          <div className="space-y-4 text-cozyGray/75">
            <p className="text-sm sm:text-base leading-relaxed">{section.description}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {section.services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </Section>
      ))}
    </div>
  );
};

export default AddOns;
