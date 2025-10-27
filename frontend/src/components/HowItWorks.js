import React from "react";
import bellyPoke from "../assets/belly-poke.jpeg";
import mamaPics from "../assets/mama-pics.jpeg";
import bellyRub from "../assets/belly-rub.jpeg";

const steps = [
  {
    title: "Learn",
    description:
      "Begin in the Taylor-Made Academy with guided lessons, reflections, and rituals that ground your journey.",
    image: bellyPoke,
  },
  {
    title: "Plan",
    description:
      "Partner with your mentor to choreograph registries, nurseries, celebrations, and postpartum rhythms with calm confidence.",
    image: mamaPics,
  },
  {
    title: "Connect",
    description:
      "Join the member community to celebrate milestones, gather wisdom, and prepare to guide the next family.",
    image: bellyRub,
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    tabIndex="-1"
    className="relative mx-auto mt-24 max-w-6xl overflow-hidden rounded-[3.5rem] border border-blush/40 bg-blush/40 px-6 py-16 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10 md:px-16"
  >
    <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-blush/35 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blush/25 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute left-1/2 top-12 h-1 w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-blush/40 to-transparent" aria-hidden="true" />

    <header className="relative text-center">
      <p className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/80">
        Signature Journey
      </p>
      <h2 className="mt-4 text-4xl font-serif font-heading text-charcoal">Learn · Plan · Connect</h2>
      <span className="gold-divider" aria-hidden="true" />
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
        We move through the Learn · Plan · Connect cycle with clear guidance, thoughtful mentorship, and celebratory support at every turn.
      </p>
    </header>

    <div className="relative mt-12 grid gap-8 md:grid-cols-3">
      {steps.map((step, _index) => (
        <article
          key={step.title}
          className="group flex h-full flex-col gap-5 rounded-[2.8rem] border border-blush/40 bg-white/90 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:scale-105 hover:bg-white hover:shadow-md"
        >
          <div className="relative overflow-hidden rounded-[2.4rem]">
            <img
              src={step.image}
              alt={`${step.title} illustration`}
              className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="space-y-3 text-left">
            <h3 className="text-2xl font-serif font-heading text-charcoal">{step.title}</h3>
            <p className="text-sm leading-relaxed text-neutral-600">{step.description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default HowItWorks;
