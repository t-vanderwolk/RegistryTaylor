import React from "react";
import { Link } from "react-router-dom";
import CarSeatComparison from "../components/CarSeatComparison";
import Button from "../components/ui/Button";
import nurseryImage from "../assets/nursery-1.jpeg";

const CarSeatsSimplified = () => {
  return (
    <div className="space-y-16 pb-24 pt-16">
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[3.5rem] border border-mauve/25 bg-white text-left shadow-soft">
        <img
          src={nurseryImage}
          alt="Pastel nursery with car seat display"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/80" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 px-6 py-12 sm:px-12 sm:py-16">
          <Link
            to="/blog"
            className="inline-flex w-full items-center justify-center rounded-full border border-mauve/20 bg-white/70 px-4 py-2 text-xs font-heading uppercase tracking-[0.32em] text-mauve transition hover:-translate-y-1 hover:scale-105 hover:bg-blush sm:w-auto sm:self-start"
          >
            Back to Guides
          </Link>
          <div className="text-xs font-serif uppercase tracking-[0.32em] text-mauve/80">Taylor-Made Guide</div>
          <h1 className="text-3xl font-serif text-charcoal sm:text-4xl md:text-5xl">Car Seats, Simplified</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            A concierge breakdown of infant, convertible, rotating, and booster seats. Use this primer to compare features, understand installation styles, and feel confident before you meet with your mentor or attend a fitting.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-neutral-400">
            <span>Guides</span>
            <span aria-hidden="true">•</span>
            <span>Car Seat Concierge</span>
            <span aria-hidden="true">•</span>
            <span>Updated Oct 2024</span>
            <span aria-hidden="true">•</span>
            <span>5 min read</span>
          </div>
          <div className="grid gap-4 pt-4 text-sm leading-relaxed text-neutral-600 sm:grid-cols-2">
            <div className="rounded-3xl border border-mauve/20 bg-white/85 p-6 shadow-soft backdrop-blur-sm">
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-mauve/70">What to expect</p>
              <p className="mt-3">
                Taylor compares the standout models parents ask about every week. Bring these notes when you test car seats in person or set up a concierge install session.
              </p>
            </div>
            <div className="rounded-3xl border border-mauve/20 bg-white/85 p-6 shadow-soft backdrop-blur-sm">
              <p className="font-heading text-xs uppercase tracking-[0.3em] text-mauve/70">Need a bespoke list?</p>
              <p className="mt-3">
                Concierge members receive custom comparisons with mentorship notes, travel considerations, and installation walk-throughs tailored to their vehicle and routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl rounded-[3rem] border border-mauve/25 bg-white px-6 py-12 shadow-soft sm:px-12">
        <CarSeatComparison />
      </section>

      <section className="mx-auto max-w-5xl space-y-6 rounded-[3rem] border border-mauve/25 bg-white px-6 py-12 text-center shadow-soft sm:px-12 sm:text-left">
        <header className="space-y-3">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-mauve/80">Concierge Support</p>
          <h2 className="text-3xl font-serif text-charcoal sm:text-4xl">Ready for one-on-one support?</h2>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            Schedule a virtual consult with Taylor-Made Baby Co. to review your top seat picks, talk installation for your specific car, and build a safety checklist for the months ahead.
          </p>
        </header>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Button to="/contact" className="bg-mauve !text-white px-8 py-3" size="sm">
            Connect with a Mentor
          </Button>
          <Button to="/request-invite" variant="outline" className="px-8 py-3" size="sm">
            Request Your Invite
          </Button>
        </div>
        <p className="text-xs font-heading uppercase tracking-[0.28em] text-neutral-400">
          Taylor reviews install fit, travel plans, and seasonal needs so your choice stays comfortable and safe well past the first ride.
        </p>
      </section>
    </div>
  );
};

export default CarSeatsSimplified;
