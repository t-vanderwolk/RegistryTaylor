import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import HeroSection from "../components/HeroSection";
import PageTitle from "../components/UI/PageTitle";
import HowItWorks from "../components/HowItWorks";
import FAQAccordion from "../components/FAQAccordion";
import MembershipHighlights from "../components/MembershipHighlights";
import InviteForm from "../components/InviteForm";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import heroBackdrop from "../assets/nursery-1.jpeg";

/* ---------------------- STATIC DATA ---------------------- */

const services = [
  {
    title: "Registry",
    description:
      "Curated essentials, perfectly timed checklists, and gifting etiquette tailored to your circle.",
  },
  {
    title: "Nursery Design",
    description:
      "Spatial planning, palettes, and furnishings that turn inspiration into a calming retreat.",
  },
  {
    title: "Concierge Care",
    description:
      "Weekly touchpoints, vendor introductions, and celebration coordination without the overwhelm.",
  },
  {
    title: "Postpartum Support",
    description:
      "Recovery-friendly plans, caregiver scheduling, and resources for the fourth trimester.",
  },
];

const statHighlights = [
  { label: "Private Clientele", value: "Five families per season" },
  {
    label: "Design Footprint",
    value: "Tempe · Phoenix · Scottsdale · Cape Cod",
  },
  {
    label: "Always Curating",
    value: "Soft palettes, warm welcomes, thoughtful detail",
  },
];

const heroTestimonialsFallback = [
  {
    quote:
      "Taylor orchestrated our Scottsdale shower, registry, and hospital bag—all I had to do was show up and say yes. Our guests still talk about the details.",
    name: "Claire & Mateo · Scottsdale",
  },
  {
    quote:
      "She walked our condo virtually, sourced every nursery piece, and had it styled before we came home from the hospital. It felt like stepping into a dream.",
    name: "Priya & Nikhil · Phoenix",
  },
  {
    quote:
      "Weekly concierge check-ins, vetted vendors, and a postpartum menu meant zero guesswork. Taylor truly became a part of our family’s celebration story.",
    name: "Jordan & Elise · Tempe",
  },
];

/* ---------------------- TESTIMONIAL CAROUSEL ---------------------- */

const TestimonialCarouselSection = () => {
  const [active, setActive] = useState(0);
  const total = heroTestimonialsFallback.length;
  const current = useMemo(() => heroTestimonialsFallback[active], [active]);
  const goTo = (index) => setActive((index + total) % total);

  return (
    <section className="mx-auto max-w-4xl rounded-2xl border border-[#C8A2C8]/30 bg-white/80 p-6 text-center shadow-md backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A2C8]">
        Client Reflections
      </p>
      <p className="mt-4 text-2xl font-serif text-[#332E4F]">
        “{current.quote}”
      </p>
      <p className="mt-4 text-sm text-[#5E5873]">{current.name}</p>
      <div className="mt-6 flex items-center justify-center gap-2">
        {heroTestimonialsFallback.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            onClick={() => goTo(index)}
            className={`h-3 w-3 rounded-full transition ${
              index === active ? "bg-[#C8A2C8]" : "bg-[#D8F3DC]"
            }`}
            aria-label={`View testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

/* ---------------------- HOME PAGE ---------------------- */

const Home = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleValidation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/invites/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setIsValid(true);
        setMessage(
          "Invite code accepted! 🎉 Welcome to Taylor-Made Baby Co."
        );
      } else {
        setIsValid(false);
        setMessage(
          data.message ||
            "Invalid invite code. Please try again or request a new one."
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
      setMessage("Something went wrong. Please try again later.");
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="space-y-24 bg-[#FFF8F2] pb-24 pt-0 text-[#332E4F] sm:space-y-28">  
  {/* <HeroSection />    HERO SECTION */}
  <Hero />
     {/* HERO SECTION */}

      {/* WHAT WE HANDLE */}
      <section className="mx-auto w-full max-w-6xl space-y-6 rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A2C8]">
            What We Handle
          </p>
          <h2 className="text-2xl font-serif text-[#332E4F] sm:text-3xl">
            Every detail, softened for you
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
            Four pillars of concierge care designed to keep planning joyful,
            organized, and uniquely you.
          </p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-[#C8A2C8]/30 bg-[#FFF8F2]/70 p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-serif text-[#332E4F]">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#5E5873]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <TestimonialCarouselSection /> */}
      {/* <TestimonialsCarousel /> */}
{/* <TestimonialCarouselSection /> */}
      {/* OTHER SECTIONS */}
      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10">
        <HowItWorks />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10">
        <MembershipHighlights />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10">
        <TestimonialsCarousel />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10">
        <FAQAccordion />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10">
        <InviteForm />
      </section>

      {/* MEMBERSHIP CTA */}
      {/* <section className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#C8A2C8]/80 via-[#D8F3DC]/80 to-[#FADADD]/80 p-6 text-center text-[#332E4F] shadow-md sm:p-10">
        <h2 className="text-2xl font-serif sm:text-3xl">
          Join the Membership
        </h2>
        <p className="text-sm leading-relaxed text-[#5E5873] sm:text-base">
          Step into a worry-free pregnancy season with concierge support,
          curated plans, and heartfelt celebration.
        </p>
        <div>
          <Link
            to="/membership"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#332E4F] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
          >
            Explore Membership Tiers
          </Link>
        </div>
      </section> */}
    </div>
  );
};

export default Home;