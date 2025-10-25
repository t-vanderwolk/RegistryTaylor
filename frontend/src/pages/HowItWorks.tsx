import React from "react";
import { Link } from "react-router-dom";
import { H1, H2, P } from "../design-system/Typography";

export default function HowItWorks() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-ivory even:bg-white/80 relative mx-auto max-w-6xl rounded-[3.5rem] bg-gradient-to-br from-ivory via-white to-white text-center shadow-soft motion-safe:animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-ivory/60 backdrop-blur-[2px]" />
        <div className="relative z-10 space-y-5">
          <H1>How It Works</H1>
          <P className="mx-auto max-w-2xl">
            We simplify every step of the journey—from registry to reveal—so you can focus on the joy
            of preparing for your baby.
          </P>
        </div>
      </section>

      {/* Step 1 */}
      <section className="section-padding bg-ivory even:bg-white/80 mx-auto max-w-5xl rounded-[3rem] bg-white text-center shadow-soft motion-safe:animate-fade-in-up">
        <H2>1. Connect With Your Concierge</H2>
        <P className="mx-auto mt-4 max-w-3xl">
          Start with a complimentary discovery call. We’ll learn about your lifestyle, design
          vision, and what makes your growing family unique.
        </P>
      </section>

      {/* Step 2 */}
      <section className="section-padding bg-ivory even:bg-white/80 mx-auto max-w-5xl rounded-[3rem] bg-ivory/60 text-center shadow-soft motion-safe:animate-fade-in-up">
        <H2>2. Curate Your Registry & Essentials</H2>
        <P className="mx-auto mt-4 max-w-3xl">
          We design a registry that fits seamlessly into your life—featuring high-quality pieces,
          lasting design, and true usability from newborn through toddlerhood.
        </P>
      </section>

      {/* Step 3 */}
      <section className="section-padding bg-ivory even:bg-white/80 mx-auto max-w-5xl rounded-[3rem] bg-white text-center shadow-soft motion-safe:animate-fade-in-up">
        <H2>3. Design Your Nursery & Spaces</H2>
        <P className="mx-auto mt-4 max-w-3xl">
          From color palettes to layout planning, your concierge creates a sanctuary that grows with
          your baby—balancing form, function, and serenity.
        </P>
      </section>

      {/* Step 4 */}
      <section className="section-padding bg-ivory even:bg-white/80 mx-auto max-w-5xl rounded-[3rem] bg-ivory/60 text-center shadow-soft motion-safe:animate-fade-in-up">
        <H2>4. Celebrate & Stay Supported</H2>
        <P className="mx-auto mt-4 max-w-3xl">
          We help coordinate celebrations, connect you with trusted experts, and ensure you feel
          supported well beyond the baby shower.
        </P>
      </section>

      {/* CTA Footer */}
      <section className="section-padding bg-ivory even:bg-white/80 mx-auto max-w-5xl rounded-[3.5rem] bg-gradient-to-br from-ivory via-white to-white text-center shadow-soft motion-safe:animate-fade-in-up">
        <H2 className="text-3xl sm:text-4xl">Begin Your Taylor-Made Journey</H2>
        <P className="mx-auto mb-8 max-w-2xl">
          Ready to experience personal, stress-free planning? Your concierge is just one invitation
          away.
        </P>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/request-invite"
            className="rounded-full bg-mauve px-8 py-3 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
          >
            Request Invite
          </Link>
          <Link
            to="/membership"
            className="rounded-full border border-mauve bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-ivory/70"
          >
            Explore Membership
          </Link>
        </div>
      </section>
    </>
  );
}
