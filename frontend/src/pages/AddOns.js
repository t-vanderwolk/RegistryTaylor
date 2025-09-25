import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Section from "../components/UI/Section";
import Card from "../components/UI/Card";
import { addOnCategories } from "../data/addOns";

const ServiceCard = ({ name, blurb, betaPrice, futurePrice }) => (
  <Card
    variant="pink"
    title={name}
    subtitle={blurb}
    icon={<SparklesIcon className="h-6 w-6" aria-hidden="true" />}
  >
    <dl className="flex flex-wrap items-center gap-4 text-[0.75rem] uppercase tracking-[0.2em] text-blueberry/70">
      <div className="flex items-center gap-2">
        <dt className="text-gold">Beta</dt>
        <dd>{betaPrice}</dd>
      </div>
      <span className="text-gold">/</span>
      <div className="flex items-center gap-2">
        <dt className="text-gold">Future</dt>
        <dd>{futurePrice}</dd>
      </div>
    </dl>
    <div className="pt-4">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full border border-babyPink/50 bg-white/90 px-5 py-2 text-xs font-heading uppercase tracking-[0.25em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
      >
        Add to Journey
      </button>
    </div>
  </Card>
);

const AddOns = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section
        title="Curated Add-Ons"
        tightTop
        compact
        center
        className="bg-gradient-to-br from-babyPink/40 via-white to-babyBlue/30"
      >
        <div className="space-y-10">
          <p className="mx-auto max-w-3xl font-body text-base sm:text-lg leading-relaxed text-darkText/75">
            Each service layers seamlessly onto your membership package. Select the moments you want elevated now, and we’ll handle timing, talent, and every last signature detail.
          </p>
          <Link to="/contact" className="btn-primary px-7 py-3 text-xs sm:text-sm">
            Request Add-On Planning
          </Link>
        </div>
      </Section>
      {addOnCategories.map((section) => (
        <Section key={section.id} id={section.id} title={section.title} compact className="bg-alt-blue">
          <div className="space-y-10 text-darkText/75">
            <p className="font-body text-sm sm:text-base leading-relaxed">{section.description}</p>
            <div className="grid gap-8 md:grid-cols-2">
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
