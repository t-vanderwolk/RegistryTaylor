import React from "react";

const steps = [
  {
    title: "Discover",
    description:
      "Warm, invite-only consultation to understand your style, support needs, and upcoming milestones.",
  },
  {
    title: "Plan",
    description:
      "We curate registries, nursery mood boards, and to-do timelines—then wrangle every vendor on your behalf.",
  },
  {
    title: "Celebrate",
    description:
      "You receive a polished reveal and a concierge team on call for showers, arrivals, and every joyful moment.",
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    tabIndex="-1"
    className="mx-auto mt-20 max-w-6xl rounded-[3rem] border border-babyBlue/20 bg-white p-10 shadow-soft"
  >
    <header className="text-center">
      <p className="text-xs font-heading uppercase tracking-[0.5em] text-blueberry/70">
        Signature Process
      </p>
      <h2 className="mt-3 text-4xl font-heading text-blueberry">How It Works</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base text-midnight/75">
        From daydreams to delivery day, Taylor-Made Baby Co. keeps every detail thoughtful, personal, and delightfully light.
      </p>
    </header>

    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <article
          key={step.title}
          className="group flex h-full flex-col rounded-[2.5rem] border border-babyBlue/20 bg-softBeige/70 p-6 text-left shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-dreamy"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-babyBlue/40 text-lg font-heading text-blueberry">
              0{index + 1}
            </span>
            <h3 className="text-2xl font-heading text-blueberry">{step.title}</h3>
          </div>
          <p className="mt-4 text-sm text-midnight/75">{step.description}</p>
        </article>
      ))}
    </div>
  </section>
);

export default HowItWorks;
