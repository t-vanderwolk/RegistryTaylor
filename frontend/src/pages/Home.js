import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FAQAccordion from "../components/FAQAccordion";
import MembershipHighlights from "../components/MembershipHighlights";
import InviteForm from "../components/InviteForm";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import ResponsiveContainer from "../components/UI/ResponsiveContainer";
import SectionHeader from "../components/UI/SectionHeader";

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

const testimonials = [
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
      "Weekly concierge check-ins, vetted vendors, and a postpartum menu meant zero guesswork. Taylor truly became part of our family’s celebration story.",
    name: "Jordan & Elise · Tempe",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  return (
    <main className="space-y-24 bg-cream pb-24 text-blueberry sm:space-y-28">
      <Hero />

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="rounded-[2.75rem] border border-gold/25 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <SectionHeader
            eyebrow="What We Handle"
            title="Every detail, softened for you"
            description="Four pillars of concierge care designed to keep planning joyful, organized, and uniquely you."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} title={service.title} variant="pink" className="h-full">
                <p>{service.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="rounded-[2.75rem] border border-gold/25 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.05 }}
        >
          <HowItWorks />
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="rounded-[2.75rem] border border-gold/25 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          <MembershipHighlights />
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="rounded-[2.75rem] border border-gold/25 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <TestimonialsCarousel />
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="rounded-[2.75rem] border border-gold/25 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.12 }}
        >
          <FAQAccordion />
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="rounded-[2.75rem] border border-gold/25 bg-white/92 p-6 shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.14 }}
        >
          <InviteForm />
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="mx-auto max-w-4xl rounded-[2.75rem] border border-gold/25 bg-cream/92 p-6 text-center shadow-soft backdrop-blur sm:p-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-70px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve/80">
            Client Reflections
          </p>
          <div className="mt-6 space-y-8">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name} className="space-y-4">
                <p className="font-heading text-2xl leading-relaxed text-blueberry sm:text-3xl">
                  “{testimonial.quote}”
                </p>
                <footer className="font-body text-sm text-darkText/70 sm:text-base">
                  {testimonial.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </motion.div>
      </ResponsiveContainer>

      <ResponsiveContainer as="section" padded>
        <motion.div
          className="mx-auto flex max-w-4xl flex-col gap-5 rounded-[2.75rem] border border-gold/35 bg-gradient-to-r from-mauve/20 via-babyPink/20 to-softMint/25 p-6 text-center shadow-soft backdrop-blur sm:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          <h2 className="font-heading text-3xl text-blueberry sm:text-4xl">
            Join the membership
          </h2>
          <p className="mx-auto max-w-2xl font-body text-sm leading-relaxed text-darkText/75 sm:text-base">
            Step into a worry-free pregnancy season with concierge support, curated plans, and heartfelt celebration.
            Taylor and her mentor circle are ready to welcome you in.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button as={Link} to="/membership" variant="mauve" size="md" className="w-full sm:w-auto">
              Explore Membership Tiers
            </Button>
            <Button as={Link} to="/request-invite" variant="outline" size="md" className="w-full sm:w-auto">
              Request a Personal Walkthrough
            </Button>
          </div>
        </motion.div>
      </ResponsiveContainer>
    </main>
  );
};

export default Home;
