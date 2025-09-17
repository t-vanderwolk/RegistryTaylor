import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import Card from "../components/UI/Card";
import { motion } from "framer-motion";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import HeroSection from "../components/HeroSection";
import {
  membershipJourneySteps,
  membershipTiers,
  membershipBenefits,
  conciergeSpotlights,
} from "../data/membership";

const Home = () => {
  const previewTiers = membershipTiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    priceLabel: tier.startingPrice?.startsWith("$")
      ? `Starting at ${tier.startingPrice}`
      : tier.startingPrice,
    description: tier.intro,
  }));

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
    <div className="min-h-screen bg-transparent font-body text-darkText">
      <HeroSection />

      <Section
        center
        tightTop
        compact
        className="mt-10"
      >
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
            <motion.div key={label} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
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
                <p className="mt-2 text-sm font-body text-darkText/75 leading-relaxed">{feature.blurb}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Testimonials */}
      <Section title="Founding Member Voices" center compact className="bg-alt-purple">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-6 max-w-2xl mx-auto space-y-6 text-darkText/85"
        >
          <blockquote className="italic border-l-4 border-babyPink pl-4 font-body text-base bg-white/90 rounded-2xl py-4 shadow-soft backdrop-blur-sm">
            “Taylor anticipated every detail — from a bespoke nursery reveal to a mother-in-law arrival plan. We simply got to enjoy it.” — Founding Member, Scottsdale
          </blockquote>
          <blockquote className="italic border-l-4 border-babyBlue pl-4 font-body text-base bg-white/90 rounded-2xl py-4 shadow-soft backdrop-blur-sm">
            “Registry to travel concierge, all handled with grace and impeccable discretion.” — Founding Member, Manhattan
          </blockquote>
        </motion.div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Process */}
      <Section title="How It Works" tightTop compact className="bg-alt-pink">
        <div className="px-6 py-6 max-w-4xl mx-auto text-darkText/85">
          <ol className="grid gap-6 md:grid-cols-2">
            {membershipJourneySteps.map(({ step, title, body }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-[2rem] border border-babyPink/30 bg-white px-5 py-6 shadow-soft"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-babyBlue">{step}</p>
                <h3 className="mt-2 font-playful text-xl text-blueberry">{title}</h3>
                <p className="mt-2 font-body text-sm text-darkText/75 leading-relaxed">{body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Membership Preview */}
      <Section title="Membership Packages" tightTop compact className="bg-alt-blue">
        <div className="px-6 py-6 max-w-5xl mx-auto text-darkText/85 space-y-6">
          <p className="text-center text-sm sm:text-base leading-relaxed text-darkText/80">
            Choose the concierge tier that mirrors your rhythm. Membership begins with a personal invitation and scales from essential registry mastery to fully bespoke planning.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {previewTiers.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.15 }}
                className="rounded-[2rem] border border-babyPink/30 bg-white/90 px-6 py-7 shadow-soft backdrop-blur-sm"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-babyBlue">{pkg.priceLabel}</p>
                <h3 className="mt-2 font-playful text-2xl text-blueberry">{pkg.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-darkText/75">{pkg.description}</p>
                <Link
                  to="/membership"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-babyBlue/40 bg-babyBlue/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-blueberry transition-transform duration-200 hover:-translate-y-1 hover:shadow-soft"
                >
                  Explore {pkg.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center text-sm text-darkText/65">
            Want to add more sparkle? Browse the full{' '}
            <Link to="/add-ons" className="text-blueberry underline decoration-babyPink/60">
              Taylor-Made Add-Ons Menu
            </Link>
            .
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Membership */}
      <Section title="Membership Perks" tightTop compact className="bg-alt-green">
        <div className="px-6 py-6 max-w-4xl mx-auto text-darkText/85 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {membershipBenefits.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className="rounded-[2rem] border border-babyPink/25 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-sm"
              >
                <div className="text-3xl">{perk.icon}</div>
                <h3 className="mt-2 font-playful text-lg text-blueberry">{perk.title}</h3>
                <p className="mt-2 text-sm font-body text-darkText/75 leading-relaxed">{perk.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

    </div>
  );
};

export default Home;
