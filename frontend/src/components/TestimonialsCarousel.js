import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    id: "avery-parker",
    family: "Avery & Jordan Parker",
    milestone: "Signature nursery reveal + concierge membership",
    quote:
      "“Taylor handled every vendor conversation and even stocked our pantry before we came home. We walked into a nursery that felt like us — calm, custom, and photo ready.”",
  },
  {
    id: "claire-serrano",
    family: "Claire & Mateo Serrano",
    milestone: "Cape Cod shower weekend + travel registry concierge",
    quote:
      "“The way Taylor managed house guests, gifting, and last-minute weather pivots was unreal. All we had to do was toast, laugh, and soak up the weekend with our people.”",
  },
  {
    id: "priya-shah",
    family: "Priya & Nikhil Shah",
    milestone: "Fourth trimester support & newborn travel planning",
    quote:
      "“In the middle of newborn life, Taylor’s nightly check-ins, travel prep, and vetted experts gave us peace of mind. We felt supported, not scheduled.”",
  },
];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex]);

  const goTo = (nextIndex) => {
    const total = testimonials.length;
    setActiveIndex((nextIndex + total) % total);
  };

  return (
    <section
      id="member-voices"
      className="relative mx-auto mt-4 max-w-4xl overflow-hidden rounded-[3rem] border border-blush/35 bg-white/85 px-6 py-12 text-center shadow-soft backdrop-blur motion-safe:animate-fade-in-up sm:px-10"
    >
      <div className="pointer-events-none absolute -left-20 top-4 h-52 w-52 rounded-full bg-blush/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-4 h-44 w-44 rounded-full bg-mauve/25 blur-3xl" aria-hidden="true" />

      <header className="relative space-y-2">
        <p className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/80">Member reflections</p>
        <h2 className="text-3xl font-serif text-charcoal sm:text-4xl">Warm words from our circle</h2>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Concierge families share how Taylor-Made support felt in real life — because calm planning is the point.
        </p>
      </header>

      <div className="relative mt-10">
        <AnimatePresence mode="wait">
          <motion.figure
            key={activeTestimonial.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto max-w-3xl space-y-6 rounded-[2.5rem] border border-blush/30 bg-white/95 px-6 py-8 shadow-soft"
          >
            <blockquote className="space-y-4 text-left text-base leading-relaxed text-charcoal/85 sm:text-lg">
              <p>{activeTestimonial.quote}</p>
            </blockquote>
            <figcaption className="space-y-1 text-left text-sm uppercase tracking-[0.28em] text-neutral-500">
              <span className="block font-semibold text-charcoal">{activeTestimonial.family}</span>
              <span className="block text-neutral-500/80">{activeTestimonial.milestone}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          className="inline-flex items-center justify-center rounded-full border border-blush/40 bg-white/95 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush/50"
        >
          Previous
        </button>
        <div className="flex items-center gap-3">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-3 w-3 rounded-full transition ${index === activeIndex ? "bg-blush" : "bg-blush/30"}`}
              aria-label={`View reflection from ${testimonial.family}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          className="inline-flex items-center justify-center rounded-full border border-blush/40 bg-white/95 px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush/50"
        >
          Next
        </button>
      </div>
      <p className="mt-6 text-sm text-neutral-600">
        Ready for your own concierge story?{" "}
        <Link to="/membership" className="font-semibold text-charcoal underline">
          Explore membership tiers
        </Link>
        .
      </p>
    </section>
  );
};

export default TestimonialsCarousel;
