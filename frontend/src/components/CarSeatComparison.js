import React from "react";
import { Link } from "react-router-dom";

// Example placeholder data; swap with real inventory when ready
const seatData = {
  infant: [
    {
      id: "infant-1",
      name: "Infant Model A",
      travelSystemCompatible: true,
      weightRange: "4-35 lb",
      installation: "LATCH + seatbelt",
      features: ["Detachable carrier", "Pool wrap insert", "Easy click-in base"],
      img: "/assets/infant-model-a.jpg",
    },
    {
      id: "infant-2",
      name: "Infant Model B",
      travelSystemCompatible: true,
      weightRange: "5-30 lb",
      installation: "LATCH + seatbelt",
      features: ["Adjustable harness", "Lightweight shell", "Padded insert"],
      img: "/assets/infant-model-b.jpg",
    },
  ],
  convertible: [
    {
      id: "conv-1",
      subtype: "Standard",
      name: "Convertible Model X",
      weightRange: "5-65 lb",
      installation: "LATCH + seatbelt",
      features: ["Rear and forward facing", "Multiple recline angles"],
      img: "/assets/conv-model-x.jpg",
    },
    {
      id: "conv-rotating",
      subtype: "Rotating",
      name: "Convertible Rotating Model Y",
      weightRange: "5-50 lb",
      installation: "LATCH + seatbelt",
      features: ["180 degree rotation", "One-hand rotate", "All direction install"],
      img: "/assets/conv-model-y.jpg",
    },
  ],
  booster: [
    {
      id: "booster-hb",
      subtype: "High-Back",
      name: "High-Back Booster Z",
      weightRange: "40-120 lb",
      installation: "Seat belt",
      features: ["Headrest", "Side wings", "Cup holders"],
      img: "/assets/booster-hb.jpg",
    },
    {
      id: "booster-bl",
      subtype: "Backless",
      name: "Backless Booster Q",
      weightRange: "40-100 lb",
      installation: "Seat belt",
      features: ["Lightweight", "Portable", "Easy to transfer"],
      img: "/assets/booster-bl.jpg",
    },
  ],
};

function SeatCard({ seat }) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-mauve/20 bg-white/95 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-dreamy">
      <div className="overflow-hidden rounded-[1.5rem]">
        <img src={seat.img} alt={seat.name} className="h-44 w-full object-cover" loading="lazy" />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="font-serif text-xl text-charcoal sm:text-2xl">{seat.name}</h3>
        {seat.subtype && <p className="mt-1 text-xs font-heading uppercase tracking-[0.28em] text-mauve/70">{seat.subtype}</p>}
        {seat.travelSystemCompatible && (
          <span className="mt-2 inline-block rounded-full bg-mauve px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-white">
            Travel System
          </span>
        )}
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          <strong className="font-semibold text-charcoal">Weight:</strong> {seat.weightRange}
        </p>
        <p className="text-sm leading-relaxed text-neutral-600">
          <strong className="font-semibold text-charcoal">Install:</strong> {seat.installation}
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600">
          {seat.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="text-mauve">{"\u2022"}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-mauve px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-white transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
        >
          Learn More
        </Link>
      </div>
    </article>
  );
}

export default function CarSeatComparison({ className = "" }) {
  return (
    <section className={`space-y-12 ${className}`.trim()}>
      <header className="space-y-3 text-left">
        <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">Comparison Guide</p>
        <h2 className="text-3xl font-serif text-charcoal sm:text-4xl">Car Seat Comparison Guide</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Explore infant, convertible, rotating, and booster seats side by side so you can shortlist what fits your family, your vehicle, and your travel style.
        </p>
      </header>

      <div className="space-y-5">
        <h3 className="font-serif text-2xl text-charcoal sm:text-3xl">Infant Car Seats</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Lightweight carriers that click into a base or stroller frame. Look for easy-to-read leveling guides, vehicle compatibility, and head support for the fourth trimester.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {seatData.infant.map((seat) => (
            <SeatCard key={seat.id} seat={seat} />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="font-serif text-2xl text-charcoal sm:text-3xl">Convertible Car Seats</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Seats that begin rear-facing and transition forward when your child is ready. Prioritize extensive rear-facing limits, easy cleanability, and an install that works with your car layout.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {seatData.convertible.map((seat) => (
            <SeatCard key={seat.id} seat={seat} />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="font-serif text-2xl text-charcoal sm:text-3xl">Booster Seats</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Big kid seats that position the vehicle belt safely. Decide between high-back comfort or ultra portable backless options depending on carpooling and travel needs.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {seatData.booster.map((seat) => (
            <SeatCard key={seat.id} seat={seat} />
          ))}
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-mauve/20 bg-blush/40 px-8 py-10 text-center shadow-soft sm:text-left">
        <p className="text-lg font-serif text-charcoal sm:text-xl">Still unsure about the right fit?</p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Book a concierge session and we will review your vehicle, travel plans, and growth expectations to land on a seat that feels effortless now and later.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-white transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
          >
            Book a Consultation
          </Link>
          <Link
            to="/request-invite"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-mauve/30 px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-mauve transition hover:-translate-y-1 hover:scale-105 hover:bg-white"
          >
            Request Invite
          </Link>
        </div>
      </div>
    </section>
  );
}
