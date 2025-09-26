import React from "react";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FAQAccordion from "../components/FAQAccordion";
import MembershipHighlights from "../components/MembershipHighlights";
import BlogHighlight from "../components/BlogHighlight";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import InviteForm from "../components/InviteForm";
import ConsultationSection from "../components/ConsultationSection";

const Home = () => {
  return (
    <div className="relative space-y-10 pb-24 sm:space-y-16">
      <Hero />
      <HowItWorks />
      <section className="mx-auto max-w-5xl surface-panel" aria-labelledby="booking-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-heading uppercase tracking-[0.45em] text-blueberry/60">Concierge Calendar</p>
          <h2 id="booking-heading" className="mt-3 text-3xl font-heading text-blueberry">
            Book a Direct Consultation
          </h2>
          <p className="mt-3 text-sm text-midnight/75">
            Choose a time that fits your schedule and Taylor will meet you for a pastel-perfect planning session.
          </p>
        </div>
        <div className="mt-8 overflow-hidden surface-card bg-softBeige/60 shadow-inner">
          <ConsultationSection />
        </div>
      </section>
      <FAQAccordion />
      <MembershipHighlights />
      <BlogHighlight />
      <TestimonialsCarousel />
      <InviteForm />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center sm:hidden">
        <div className="pointer-events-auto mx-auto mb-6 w-[calc(100%-2.5rem)] rounded-full border border-babyBlue/30 bg-white/95 p-3 shadow-soft backdrop-blur">
          <a
            href="#request-invite"
            className="block w-full rounded-full border border-babyBlue/30 bg-white px-6 py-3 text-center text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:scale-[1.02] hover:bg-babyPink/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60"
          >
            Request Invite
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
