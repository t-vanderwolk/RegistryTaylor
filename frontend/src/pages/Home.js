import React from "react";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import Card from "../components/UI/Card";
import { motion } from "framer-motion";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import HeroSection from "../components/HeroSection";
import ConsultationSection from "../components/ConsultationSection";
import { conciergeSpotlights } from "../data/membership";

const Home = () => {
  const identityHighlights = [
    {
      logo: logo1,
      label: "Invite-Only",
      detail: "A discreet client list curated by personal referral.",
      variant: "blue",
    },
    {
      logo: logo2,
      label: "Concierge Care",
      detail: "Taylor personally oversees every bespoke decision.",
      variant: "pink",
    },
    {
      logo: logo3,
      label: "Confidential Always",
      detail: "NDA-backed planning for nurseries, events, and lifestyle.",
      variant: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent font-body text-darkText relative">
      <HeroSection />

      {/* Free Consultation */}
      <Section
        id="consultation"
        title="Book Your Free Consultation"
        center
        compact
        className="bg-alt-pink"
      >
        <div className="max-w-4xl mx-auto">
          <ConsultationSection />
        </div>
      </Section>

      {/* Identity Highlights */}
      <Section center tightTop compact className="mt-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.15, duration: 0.4, ease: "easeOut" },
            },
          }}
          className="mt-6 grid gap-6 md:grid-cols-3"
        >
          {identityHighlights.map(({ logo, label, detail, variant }) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            >
              <Card
                variant={variant}
                icon={<img src={logo} alt="" className="h-10 w-10 object-contain" aria-hidden="true" />}
                title={label}
                className="bg-white/80 backdrop-blur"
              >
                {detail}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Concierge Touchpoints */}
      <Section title="Concierge Touchpoints" tightTop compact className="bg-alt-green">
        <div className="px-6 py-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {conciergeSpotlights.map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.03, y: -2 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-[2rem] border border-babyBlue/25 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-sm"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-3 font-playful text-lg text-blueberry">{feature.title}</h3>
                <p className="mt-2 text-sm font-body text-darkText/75 leading-relaxed">
                  {feature.blurb}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* ... other sections remain unchanged ... */}

      {/* Sticky CTA (mobile only) */}
      <div className="fixed bottom-4 right-4 z-50 sm:hidden">
        <a
          href="#consultation"
          className="inline-flex items-center justify-center rounded-full bg-babyPink px-5 py-3 text-xs font-heading uppercase tracking-[0.25em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
        >
          ✨ Free Consultation
        </a>
      </div>
    </div>
  );
};

export default Home;
