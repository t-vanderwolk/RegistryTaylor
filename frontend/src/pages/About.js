import React from "react";

import PageHero from "../components/UI/PageHero";
import SectionDivider from "../components/UI/SectionDivider";

import bellyRub from "../assets/belly-rub.jpeg";

const fadeInClass = "motion-safe:animate-fade-in-up";

const About = () => {
  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-24">
      <PageHero
        backgroundImage={bellyRub}
        eyebrow="Meet Taylor"
        subtitle="Meet Taylor"
        description="Hi, I’m Taylor — your concierge for registries, nursery styling, and celebration planning. I blend years of hands-on expertise with a calm, pastel-forward approach so every moment feels personal and ease-filled."
        primaryCta={{ label: "Book a Consultation", to: "/contact", className: "px-9 py-3" }}
        secondaryCta={{ label: "Explore Memberships", to: "/membership", className: "px-9 py-3" }}
      />

      <section
        className={`mx-auto max-w-[900px] rounded-[3rem] border border-primary/20 bg-white/95 px-6 py-16 text-blueberry shadow-soft backdrop-blur-sm sm:px-10 md:px-14 ${fadeInClass}`}
      >
        <header className="space-y-3 text-center">
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-primary/80">Warm Beginnings</p>
          <h2 className="text-3xl font-heading text-blueberry sm:text-4xl">Why Taylor-Made Exists</h2>
          <div className="mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30" />
        </header>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-blueberry/80">
          <p>
            I’ve helped hundreds of parents choose the right stroller, curate nurseries that feel like calm retreats, and host celebrations where everyone feels welcomed. Every project starts with listening — to your rhythms, your wish list, and the stories you want to tell as your family grows.
          </p>
          <p>
            Baby prep isn’t about chasing trends; it’s about feeling ready and delighted. My goal is to simplify decisions, keep excitement high, and hand you plans that feel true to your family’s style.
          </p>
          <p>
            From concierge registries to full celebration production, my team and I weave together tasteful essentials, trusted vendors, and meaningful details. Consider me the teammate who says yes, guides gently, and keeps your timeline pastel-perfect.
          </p>
        </div>
        <SectionDivider className="my-12" />
        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-3xl border border-primary/20 bg-softPink/40 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-dreamy">
            <h3 className="text-lg font-heading text-blueberry">Concierge Promise</h3>
            <p className="mt-3 text-sm text-blueberry/75 leading-relaxed">
              Gentle timelines, honest recommendations, and the belief that calm planning sets the tone for joyful celebrations.
            </p>
          </article>
          <article className="rounded-3xl border border-primary/20 bg-softMint/40 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-dreamy">
            <h3 className="text-lg font-heading text-blueberry">Signature Touch</h3>
            <p className="mt-3 text-sm text-blueberry/75 leading-relaxed">
              Pastel palettes, thoughtful gifting, and curated experiences that let you savor every milestone without overwhelm.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default About;
