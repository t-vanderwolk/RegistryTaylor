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
  {
    quote:
      "Taylor was amazing explaining the differences in a few strollers and car seats. Highly recommend going here.",
    author: "Sharon Kraft",
  },
  {
    quote:
      "Wonderful experience, I worked with Tayler and she was very knowledgeable and great to work with!",
    author: "Emily Wingerter",
  },
  {
    quote:
      "Taylor was incredibly knowledgeable and very helpful. She walked us through set up, take down, and the various options. Her customer service was spot on and we left feeling like we made an excellent decision making our purchases. Highly recommend, especially for first time parents.",
    author: "Charles David",
  },
  {
    quote:
      "Taylor was the gal who helped us find the stroller for our registry. She was so knowledgeable which was a big help as it's our first baby and we didn't know where to start.",
    author: "Cara Warzecha",
  },
  {
    quote:
      "Great store. Lots of great brands available to try (even has a walkway with various surface and ramps to roll the strollers on). Taylor gave us amazing help. She was extremely knowledgeable and showed us more options than we would have known to ask about, which led to us changing what we wanted for a whole stroller/etc set up. Highly recommend.",
    author: "Jennifer Robblee",
  },
  {
    quote:
      "My husband and I had a great experience at Strolleria thanks to Taylor! We came in not knowing what we wanted and Taylor listened to our preferences/lifestyle and provided us with great recommendations. With Taylor's guidance we picked a stroller and car seat and she definitely made the process less overwhelming for us.",
    author: "Talie Walsh",
  },
  {
    quote:
      "We found the perfect stroller and car seat for our growing family with Taylor's help. She is truly a wealth of knowledge and did a fantastic job educating us and guiding us in the right direction based on our individual needs and preferences. Not only did we leave feeling confident in our selections, but Taylor made the entire process fun and exciting. I cannot recommend Taylor and Strolleria more highly for all your baby gear needs.",
    author: "Caihlan Snyder",
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
