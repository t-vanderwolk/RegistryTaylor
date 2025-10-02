import React from "react";
import bellyPoke from "../assets/belly-poke.jpeg";
import mamaPics from "../assets/mama-pics.jpeg";
import bellyRub from "../assets/belly-rub.jpeg";

const steps = [
  {
    title: "Discover",
    description:
      "A relaxed video chat to share your story, wishlist, and the feel you want for baby’s arrival.",
    image: bellyPoke,
  },
  {
    title: "Plan",
    description:
      "Registry picks, nursery layouts, and timelines co-created with gentle check-ins and shared boards.",
    image: mamaPics,
  },
  {
    title: "Celebrate",
    description:
      "Joyful reveals, thoughtful gifting, and on-call support so every celebration feels effortless.",
    image: bellyRub,
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    tabIndex="-1"
    className="relative mx-auto mt-24 max-w-6xl overflow-hidden rounded-[3.5rem] border border-babyPink/40 bg-gradient-to-tr from-babyPink/12 via-white/90 to-white px-6 py-16 shadow-soft backdrop-blur-sm sm:px-10 md:px-16"
  >
    <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-babyPink/35 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-babyPink/25 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute left-1/2 top-12 h-1 w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-babyPink/40 to-transparent" aria-hidden="true" />

    <header className="relative text-center">
      <p className="text-xs font-heading uppercase tracking-[0.55em] text-blueberry/70">
        Signature Journey
      </p>
      <h2 className="mt-4 text-4xl font-heading text-blueberry">How It Works</h2>
      <span className="gold-divider" aria-hidden="true" />
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-midnight/75">
        We move from first chat to final reveal with clear checklists, real support, and plenty of excitement along the way.
      </p>
    </header>

    <div className="relative mt-12 grid gap-8 md:grid-cols-3">
      {steps.map((step, index) => (
        <article
          key={step.title}
          className="group flex h-full flex-col gap-5 rounded-[2.8rem] border border-babyPink/40 bg-white/90 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-dreamy"
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
            <h3 className="text-2xl font-heading text-blueberry">{step.title}</h3>
            <p className="text-sm leading-relaxed text-midnight/75">{step.description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default HowItWorks;
