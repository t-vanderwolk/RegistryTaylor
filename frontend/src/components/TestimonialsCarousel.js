import React, { useState } from "react";
import { Link } from "react-router-dom";
import babyFeet from "../assets/baby-feet.jpeg";

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
  // {
  //   quote:
  //     "Taylor transformed our Pinterest board into a real nursery—complete with heirloom touches and space for our rescue pup to curl up. We felt so seen.",
  //   author: "Amelia & Jordan",
  //   detail: "Phoenix, AZ",
  // },
  // {
  //   quote:
  //     "Every vendor, every delivery, every decision was handled. I just opened my inbox to joyful updates and final reveals.",
  //   author: "Priya",
  //   detail: "First-time mom",
  // },
  // {
  //   quote:
  //     "The concierge portal meant my partner could peek at registries from tour stops. Easiest yes we said all pregnancy.",
  //   author: "Logan & Drew",
  //   detail: "Expecting twins",
  // },
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
  {
      quote:
      "We had an amazing experience with Taylor! She helped us find the best stroller for our family and went above and beyond to show us all the amazing features of each brand. We highly recommend Taylor!",
    author: "Kaitlin Steinour",
  },
  {
    quote: "Taylor was absolutely phenomenal. She took the time to listen to what I truly needed and walked me through the store. She ended up finding us exactly what we needed! I HIGHLY recommend Strolleria, but especially Taylor.",
    author:"Zoey Raff"
  },
 {
    quote: "Taylor was incredibly knowledgeable and very helpful. She walked us through set up, take down, and the various options. Her customer service was spot on and we left feeling like we made an excellent decision making our purchases Highly recommend, especially for first time parents.",
    author:"Charles David"
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
      className="relative mx-auto mt-24 max-w-6xl overflow-hidden rounded-[3.75rem] border border-babyPink/40 bg-gradient-to-br from-babyPink/18 via-white/90 to-softBeige/70 px-6 py-16 text-blueberry shadow-soft backdrop-blur-lg sm:px-10 md:px-16"
    >
      <div className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-babyPink/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-babyPink/28 blur-3xl" aria-hidden="true" />

      <header className="relative text-center">
        <p className="text-xs font-heading uppercase tracking-[0.55em] text-blueberry/60">Private Praise</p>
        <h2 className="mt-4 text-4xl font-heading text-blueberry sm:text-5xl">Kind Words from Taylor’s Families</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-midnight/70">
          We get to celebrate big milestones with our clients. Here’s what they’ve said once the nursery is ready and the party lights are down.
        </p>
      </header>

      <div className="relative mt-12 grid gap-10 md:grid-cols-[1.05fr,0.75fr] md:items-center">
        <figure className="relative overflow-hidden rounded-[3rem] border border-babyPink/35 bg-white/88 p-8 text-center shadow-soft backdrop-blur" aria-live="polite">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-babyPink/50 bg-babyPink/20 text-4xl text-blueberry/70">
            “
          </span>
          <blockquote className="mt-6 space-y-4 text-lg leading-relaxed text-midnight/80">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
          </blockquote>
          <figcaption className="mt-6 text-sm font-heading uppercase tracking-[0.45em] text-blueberry/60">
            {detail ? `${author} · ${detail}` : author}
          </figcaption>
        </figure>

        <aside className="relative space-y-6 rounded-[3rem] border border-babyPink/35 bg-white/82 p-8 text-left shadow-soft backdrop-blur">
          <div className="overflow-hidden rounded-[2.25rem] border border-babyBlue/25">
            <img
              src={babyFeet}
              alt="Tiny baby feet wrapped in a soft blanket"
              className="h-36 w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-[0.7rem] font-heading uppercase tracking-[0.45em] text-blueberry/60">Why families love us</p>
            <ul className="mt-4 space-y-3 text-sm text-midnight/75">
              <li>• 140+ families supported with registries tailored to their lifestyle.</li>
              <li>• Trusted help getting nurseries ready across Phoenix and beyond.</li>
              <li>• Clear schedules and updates so you can relax and enjoy the ride.</li>
            </ul>
          </div>
          <div className="rounded-[2.5rem] border border-babyBlue/25 bg-gradient-to-br from-softBeige/70 via-white to-babyPink/25 px-6 py-5">
            <p className="text-xs font-heading uppercase tracking-[0.45em] text-blueberry/60">Request a private consultation</p>
            <p className="mt-2 font-babyco text-base text-blueberry">
              Ready for a calmer plan? Taylor will walk you through what’s possible and build a path that fits your family.
            </p>
            <Link
              to="/testimonials"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-babyBlue/35 bg-white px-6 py-2 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-softBeige focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
            >
              Read More Stories
            </Link>
          </div>
        </aside>
      </div>

      <div className="relative mt-10 flex flex-col items-center justify-center gap-6 md:flex-row">
        <button
          type="button"
          onClick={showPrevious}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-babyPink/45 bg-white/90 text-blueberry shadow-soft transition hover:-translate-y-1 hover:bg-babyPink/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyPink/60"
          aria-label="View previous testimonial"
        >
          <span aria-hidden="true">&lt;</span>
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((item, itemIndex) => (
            <span
              key={`${item.author}-${itemIndex}`}
              className={`h-2 w-8 rounded-full transition ${itemIndex === index ? "bg-blueberry" : "bg-babyBlue/40"}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={showNext}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-babyPink/45 bg-white/90 text-blueberry shadow-soft transition hover:-translate-y-1 hover:bg-babyPink/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyPink/60"
          aria-label="View next testimonial"
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
