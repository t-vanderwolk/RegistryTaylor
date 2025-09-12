// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import { motion } from "framer-motion";

const Home = () => {
  const sections = [
    {
      center: true,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-4 text-black">
             Taylor-Made <span className="font-cursive text-primary">Baby Planning</span> 
          </h1>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            From registry to nursery — every detail Taylor‑Made for you.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 px-6 py-3 rounded-lg bg-primary text-white font-medium transition-shadow shadow-lg hover:shadow-xl"
            >
              Book Your Consultation
            </motion.button>
          </Link>
        </motion.div>
      ),
    },
    {
      title: "Introduction",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16 max-w-3xl mx-auto text-black/80"
        >
          <p className="cc-lead font-serif text-xl">
            Preparing for a baby should feel exciting, not overwhelming. At
            <span className="font-serif font-bold"> Taylor-Made Baby Planning</span>, I guide you
            through every step of baby prep — from registries and strollers to
            nursery design, showers, and family dynamics.
          </p>
          <p className="mt-6 text-lg leading-relaxed">
            With my <em>Taylor‑Made</em> approach, you’ll feel supported,
            confident, and ready to welcome your little one with ease.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Services Snapshot — Taylor‑Made for You",
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Taylor‑Made Registry",
                desc: "Custom registries designed around your lifestyle and values.",
              },
              {
                title: "Taylor‑Made Gear",
                desc: "Honest advice on strollers, car seats, and baby gear.",
              },
              {
                title: "Taylor‑Made Nursery",
                desc: "From layout to décor — spaces that are safe, stylish, and functional.",
              },
              {
                title: "Taylor‑Made Showers",
                desc: "Planning made simple, from themes to thank‑yous.",
              },
              {
                title: "Taylor‑Made Support",
                desc: "Yes, even in‑law diplomacy — I’ll help keep everyone on the same page.",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-6 border border-black/20 rounded-xl shadow bg-white transition-shadow duration-300"
              >
                <h3 className="font-serif text-2xl mb-2 text-black">
                  {service.title}
                </h3>
                <p className="text-black/70">{service.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/services">
              <motion.a
                whileHover={{ scale: 1.03 }}
                className="btn px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Explore All Services →
              </motion.a>
            </Link>
          </div>
        </motion.div>
      ),
    },
    {
      title: "How It Works",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16 max-w-3xl mx-auto text-black/80"
        >
          <ol className="space-y-6 list-decimal list-inside text-lg">
            <li>
              <strong>Book Your Consultation</strong> — Start with a quick call or
              virtual meeting.
            </li>
            <li>
              <strong>Share Your Vision</strong> — Tell me your must‑haves,
              worries, and style.
            </li>
            <li>
              <strong>Get Your Plan</strong> — Receive a personalized registry,
              gear guide, or nursery design plan.
            </li>
            <li>
              <strong>Enjoy the Journey</strong> — With the details handled, you
              can focus on the moments that matter.
            </li>
          </ol>
        </motion.div>
      ),
    },
    {
      title: "Testimonials",
      center: true,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16 max-w-2xl mx-auto space-y-6 text-black/80"
        >
          <blockquote className="italic border-l-4 border-primary pl-4">
            “Taylor made our registry feel effortless — no stress, no
            second‑guessing.” — Jenna M.
          </blockquote>
          <blockquote className="italic border-l-4 border-primary pl-4">
            “She helped us choose a stroller that truly works for our lifestyle.
            Game‑changer!” — Rachel &amp; Matt K.
          </blockquote>
          <blockquote className="italic border-l-4 border-primary pl-4">
            “Our nursery turned out better than I ever imagined — polished,
            functional, and ready for baby.” — Amanda S.
          </blockquote>
        </motion.div>
      ),
    },
    {
      center: true,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-20"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-black">
            ✨ Ready to start planning? ✨
          </h2>
          <p className="mt-4 text-lg text-black/70">
            Book your consultation today — baby prep made simple, personal, and
            stress‑free.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Let’s Get Started →
            </motion.button>
          </Link>
        </motion.div>
      ),
    },
    {
      title: "About Me",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-6 py-16 max-w-3xl mx-auto text-black/80"
        >
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
          <div className="mt-8 text-center">
            <Link to="/about">
              <motion.a
                whileHover={{ scale: 1.03 }}
                className="btn px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                Learn More About Me →
              </motion.a>
            </Link>
          </div>
        </motion.div>
      ),
    },
    {
      center: true,
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-6 py-20 text-black/80"
        >
          <h2 className="font-serif text-2xl md:text-3xl">Let’s make baby prep easy — and even fun.</h2>
          <p className="mt-4">📧 Email: RegistryTaylor@gmail.com</p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              Book Your Consultation
            </motion.button>
          </Link>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="bg-accent min-h-screen">
      {sections.map((section, i) => (
        <Section key={i} index={i} center={section.center} title={section.title}>
          {section.content}
        </Section>
      ))}
    </div>
  );
};

export default Home;
