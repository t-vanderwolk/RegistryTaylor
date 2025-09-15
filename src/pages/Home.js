// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Section center tightTop compact>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-6 text-black">
            Taylor-Made <span className="font-cursive text-gold">Baby Planning</span>
          </h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            A calm, confident path to welcoming your little one. Personalized registries, nursery design, shower planning, and ongoing support—tailored to your family.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="btn btn-primary"
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="px-4 py-3 rounded-lg border-2 border-gold/40 bg-white text-black hover:brightness-95"
            >
              Book a Consultation
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* Public information sections */}
      <Section title="Introduction" tightTop compact>
        <div className="px-6 py-4 max-w-3xl mx-auto text-black/80 space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-black mb-2">The Problem</h3>
            <p className="leading-relaxed text-lg">
              Preparing for a baby is supposed to feel exciting — but too often it’s overwhelming. Between endless stroller options, registry decisions, nursery planning, family expectations, and shower details, parents are left feeling stressed instead of supported.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-black mb-2">The Solution</h3>
            <p className="leading-relaxed text-lg">
              Taylor-Made Baby Planning takes the pressure off your shoulders. From personalized registries and gear guidance to nursery design, shower planning, and even smoothing family dynamics, I handle the details so you don’t have to.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-black mb-2">The Benefit</h3>
            <p className="leading-relaxed text-lg">
              With my Taylor-Made approach, you’ll feel calm, confident, and fully prepared to welcome your little one. Baby prep becomes simple, stress-free, and even fun — just the way it should be.
            </p>
          </div>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="Services Snapshot — Taylor‑Made for You" tightTop compact>
        <div className="px-6 py-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[ 
              { title: 'Taylor‑Made Registry', desc: 'Custom registries designed around your lifestyle and values.' },
              { title: 'Taylor‑Made Gear', desc: 'Honest advice on strollers, car seats, and baby gear.' },
              { title: 'Taylor‑Made Nursery', desc: 'From layout to décor — safe, stylish, and functional.' },
              { title: 'Taylor‑Made Showers', desc: 'Planning made simple, from themes to thank‑yous.' },
              { title: 'Taylor‑Made Support', desc: 'I’ll help keep everyone on the same page.' },
            ].map((service, i) => (
              <div key={i} className="p-6 border border-gold/40 rounded-xl shadow bg-white">
                <h3 className="font-serif text-2xl mb-2 text-black">{service.title}</h3>
                <p className="text-black/70">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="Testimonials" center tightTop compact>
        <div className="px-6 py-4 max-w-2xl mx-auto space-y-6 text-black/80">
          <blockquote className="italic border-l-4 border-gold pl-4">
            “Taylor made our registry feel effortless — no stress, no second‑guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic border-l-4 border-gold pl-4">
            “She helped us choose a stroller that truly works for our lifestyle. Game‑changer!” — Rachel & Matt K.
          </blockquote>
        </div>
      </Section>
      <SectionDivider className="my-4" />

      <Section title="About Me" tightTop compact>
        <div className="px-6 py-4 max-w-3xl mx-auto text-black/80">
          <p className="max-w-2xl">
            Hi, I’m Taylor! Think of me as your go‑to guide (and maybe your new
            best friend) for all things baby prep. I’ve spent years helping
            families navigate the overwhelming world of strollers, car seats,
            nurseries, and registries.
          </p>
          <p className="mt-6 max-w-2xl">
            Now, I bring that experience to you in a warm, personalized way
            that takes away the stress and leaves you excited, prepared, and
            confident.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default Home;
