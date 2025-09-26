import React, { useState } from "react";

const testimonials = [
  {
    quote: `Taylor took what could have been a very overwhelming experience and made it so simple and easy! She was an absolute joy to work with and incredibly knowledgeable. She spent 3+ hrs with me as we talked through the pros/cons of each brand and was so patient and kind as we went back and forth between each one.

I have also called their customer service and spoke to a representative who was also extremely nice and a pleasure to speak with. She answered all of my remaining questions and felt so relatable as she just had her first child and went through this same process of gearing up.

All in all, I am happy to support a local business that takes such great care of their customers.`,
    author: "Amanda M.",
  },
  {
    quote: `Just purchased a new stroller from here and couldn't be happier about our experience. They had exactly what we were looking for!

The service was incredible, they showed us how to use it and what put it over the top was Taylor dusting it and made sure it was spick and span! Then she let us put the stroller in the trunk before purchasing just to make sure it all fits!

My wife couldn’t be happier! Happy wife happy life!`,
    author: "A. G.",
  },
  {
    quote:
      "Taylor transformed our Pinterest board into a real nursery—complete with heirloom touches and space for our rescue pup to curl up. We felt so seen.",
    author: "Amelia & Jordan",
    detail: "Phoenix, AZ",
  },
  {
    quote:
      "Every vendor, every delivery, every decision was handled. I just opened my inbox to joyful updates and final reveals.",
    author: "Priya",
    detail: "First-time mom",
  },
  {
    quote:
      "The concierge portal meant my partner could peek at registries from tour stops. Easiest yes we said all pregnancy.",
    author: "Logan & Drew",
    detail: "Expecting twins",
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  const showPrevious = () => setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setIndex((current) => (current + 1) % testimonials.length);

  const { quote, author, detail } = testimonials[index];
  const paragraphs = quote
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section
      id="testimonials"
      tabIndex="-1"
      className="mx-auto mt-16 max-w-4xl surface-panel text-blueberry"
    >
      <header className="text-center">
        <p className="text-xs font-heading uppercase tracking-[0.5em] text-blueberry/60">Private Praise</p>
        <h2 className="mt-2 text-3xl font-heading text-blueberry">Clients Are Saying…</h2>
      </header>

      <figure className="mt-8 space-y-6 text-center" aria-live="polite">
        <blockquote className="space-y-4 text-lg font-body leading-relaxed text-midnight/80">
          {paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </blockquote>
        <figcaption className="text-sm font-heading uppercase tracking-[0.4em] text-blueberry/70">
          {detail ? `${author} · ${detail}` : author}
        </figcaption>
      </figure>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={showPrevious}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-babyBlue/40 bg-white text-blueberry transition hover:-translate-y-0.5 hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          aria-label="View previous testimonial"
        >
          <span aria-hidden="true">&lt;</span>
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((item, itemIndex) => (
            <span
              key={`${item.author}-${itemIndex}`}
              className={`h-2 w-8 rounded-full transition ${itemIndex === index ? "bg-babyPink" : "bg-babyBlue/30"}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={showNext}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-babyBlue/40 bg-white text-blueberry transition hover:-translate-y-0.5 hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          aria-label="View next testimonial"
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
