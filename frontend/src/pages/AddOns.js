import React from "react";
import { Link } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Section from "../components/UI/Section";
import Card from "../components/UI/Card";
import { addOnCollections } from "../data/addOns";

const ServiceCard = ({ name, highlight, investment, touches }) => (
  <Card
    variant="pink"
    title={name}
    subtitle={highlight}
    icon={<SparklesIcon className="h-6 w-6" aria-hidden="true" />}
  >
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-full bg-white/85 px-4 py-2 text-[0.7rem] font-heading uppercase tracking-[0.3em] text-blueberry/80 shadow-inner">
      <span className="text-gold">Member Investment</span>
      <span aria-hidden="true">•</span>
      <span>{investment}</span>
    </div>
    <ul className="mt-5 space-y-2 text-left text-sm leading-relaxed text-blueberry/75">
      {touches.map((touch) => (
        <li key={touch} className="flex items-start gap-2">
          <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-babyPink/70" aria-hidden="true" />
          <span>{touch}</span>
        </li>
      ))}
    </ul>
    <div className="pt-6">
      <Link
        to="/contact"
        className="inline-flex w-full items-center justify-center rounded-full border border-babyPink/45 bg-white/90 px-5 py-2 text-xs font-heading uppercase tracking-[0.25em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
      >
        Reserve concierge date
      </Link>
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
            Add-ons are how we sprinkle extra magic onto your membership. Tell Taylor which milestone needs more care, and our concierge team will coordinate timing, talent, and keepsake touches.
          </p>
          <Link to="/contact" className="btn-primary px-7 py-3 text-xs sm:text-sm">
            Request Add-On Planning
          </Link>
        </div>
      </Section>
      {addOnCollections.map((section) => (
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
