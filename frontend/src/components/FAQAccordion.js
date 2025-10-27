import React, { useState } from "react";

const questions = [
  {
    question: "Who receives an invite to Taylor-Made Baby Co.?",
    answer:
      "We welcome a limited number of families each season based on personal referrals and aligned timelines. When it’s a mutual fit, you’ll receive a private concierge welcome within 48 hours of applying.",
  },
  {
    question: "Do I need to have a registry started?",
    answer:
      "Not at all. We’ll craft or refine your registry together, layering in mentor-approved selections and specialty finds tailored to your rituals.",
  },
  {
    question: "What does membership include?",
    answer:
      "Each membership is bespoke. Expect a dedicated concierge, Academy guidance, mentor planning sessions, nursery design direction, and celebration support all choreographed through Learn · Plan · Connect.",
  },
];

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="faq"
      tabIndex="-1"
      className="relative mx-auto mt-20 max-w-5xl overflow-hidden rounded-[3rem] border border-mauve/20 bg-ivory/70 px-6 py-14 shadow-soft backdrop-blur-sm motion-safe:animate-fade-in-up sm:px-10"
    >
      <div className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-mauve/30 blur-3xl" aria-hidden="true" />

      <header className="relative text-center">
        <p className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/80">
          Curious Minds
        </p>
        <h2 className="mt-4 text-3xl font-serif font-heading text-charcoal sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
          A few of the thoughtful questions parents ask before joining our Member → Mentor circle.
        </p>
      </header>
      <div className="relative mt-8 space-y-4">
        {questions.map((item, index) => {
          const isOpen = activeIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-control-${index}`;

          return (
            <article
              key={item.question}
              className="rounded-[2.6rem] border border-mauve/25 bg-white/85 p-5 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md"
            >
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left text-base font-serif font-heading text-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveIndex((current) => (current === index ? -1 : index))}
              >
                {item.question}
                <span className="text-2xl text-charcoal/70">{isOpen ? "−" : "+"}</span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`mt-3 text-sm text-neutral-600 transition-[max-height] duration-300 ease-in-out ${
                  isOpen ? "max-h-60" : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="pr-2 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;
