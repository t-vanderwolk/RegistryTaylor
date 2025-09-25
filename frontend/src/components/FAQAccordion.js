import React, { useState } from "react";

const questions = [
  {
    question: "Who receives an invite to Taylor-Made Baby Co.?",
    answer:
      "We work with a handful of families each season based on personal referrals and aligned timelines. If we are a match, you’ll receive a private concierge welcome within 48 hours of applying.",
  },
  {
    question: "Do I need to have a registry started?",
    answer:
      "Not at all. We can craft a registry from scratch, refresh one you already have, or coordinate specialty items from boutique makers and independent brands.",
  },
  {
    question: "What does membership include?",
    answer:
      "Each membership is bespoke. Expect a dedicated concierge, curated shoppable guides, scheduling support, nursery design direction, and event planning for showers or sip & sees.",
  },
];

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="faq"
      tabIndex="-1"
    className="mx-auto mt-14 max-w-5xl rounded-[3rem] border border-babyBlue/20 bg-white p-8 shadow-soft"
    >
      <header className="text-center">
        <p className="text-xs font-heading uppercase tracking-[0.5em] text-blueberry/70">
          Curious Minds
        </p>
        <h2 className="mt-3 text-3xl font-heading text-blueberry">Frequently Asked Questions</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-midnight/70">
          Transparency first—here are a few favorites from expectant parents when they reach out to Taylor.
        </p>
      </header>
      <div className="mt-8 space-y-4">
        {questions.map((item, index) => {
          const isOpen = activeIndex === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-control-${index}`;

          return (
            <article key={item.question} className="rounded-3xl border border-babyBlue/20 bg-softBeige/60 p-4 shadow-soft">
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left text-base font-heading text-blueberry focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/70 focus-visible:ring-offset-2 focus-visible:ring-offset-softBeige"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveIndex((current) => (current === index ? -1 : index))}
              >
                {item.question}
                <span className="text-2xl text-blueberry">{isOpen ? "−" : "+"}</span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`mt-3 text-sm text-midnight/70 transition-[max-height] duration-300 ease-in-out ${
                  isOpen ? "max-h-60" : "max-h-0 overflow-hidden"
                }`}
              >
                <p className="pr-2 text-sm leading-relaxed">{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;
