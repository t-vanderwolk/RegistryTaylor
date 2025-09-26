import React, { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "“Taylor transformed our Pinterest board into a real nursery—complete with heirloom touches and space for our rescue pup to curl up. We felt so seen.”",
    author: "Amelia & Jordan",
    detail: "Phoenix, AZ",
  },
  {
    quote:
      "“Every vendor, every delivery, every decision was handled. I just opened my inbox to joyful updates and final reveals.”",
    author: "Priya",
    detail: "First-time mom",
  },
  {
    quote:
      "“The concierge portal meant my partner could peek at registries from tour stops. Easiest yes we said all pregnancy.”",
    author: "Logan & Drew",
    detail: "Expecting twins",
  },
];

const rotationDelay = 6000;

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, rotationDelay);

    return () => window.clearInterval(id);
  }, []);

  const showPrevious = () => setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  const showNext = () => setIndex((current) => (current + 1) % testimonials.length);

  const { quote, author, detail } = testimonials[index];

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
        <blockquote className="text-lg font-body leading-relaxed text-midnight/80">{quote}</blockquote>
        <figcaption className="text-sm font-heading uppercase tracking-[0.4em] text-blueberry/70">
          {author} · {detail}
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
              key={item.author}
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
