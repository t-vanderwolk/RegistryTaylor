import React, { useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";
import SectionDivider from "../components/UI/SectionDivider";
import { motion } from "framer-motion";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import {
  membershipJourneySteps,
  membershipTiers,
  membershipBenefits,
  conciergeSpotlights,
} from "../data/membership";

const Home = () => {
  const [inviteCode, setInviteCode] = useState("");

  const previewTiers = membershipTiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    priceLabel: tier.startingPrice?.startsWith("$")
      ? `Starting at ${tier.startingPrice}`
      : tier.startingPrice,
    description: tier.intro,
  }));

  return (
    <div className="min-h-screen bg-transparent font-sans text-pebble">
      {/* Hero Section */}
      <Section
        center
        tightTop
        compact
        className="relative overflow-hidden bg-gradient-to-br from-babyPink/70 via-cream to-babyBlue/60"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute -top-10 -left-6 h-32 w-32 rounded-full bg-babyBlue/40 blur-3xl" />
          <div className="absolute -bottom-16 -right-10 h-36 w-36 rounded-full bg-babyPink/40 blur-3xl" />
          <div className="absolute top-10 right-1/3 text-4xl animate-float">⭐️</div>
          <div className="absolute bottom-8 left-12 text-5xl animate-bob">🧸</div>
          <div className="absolute top-20 left-1/2 text-4xl animate-wiggle">🧩</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-bubble bg-white/90 px-5 sm:px-6 py-14 sm:py-16 text-center shadow-dreamy border border-babyPink/30 backdrop-blur"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: [0.98, 1.03, 1] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-4 text-center font-playful text-4xl sm:text-5xl md:text-6xl text-blueberry"
          >
            Baby Prep, Taylor-Made.
          </motion.h1>

          <p className="font-sans text-lg md:text-xl text-pebble/80 max-w-2xl mx-auto">
            An invite-only concierge for families who value privacy, polish, and ease. We curate every
            registry, nursery reveal, and celebration so you can welcome baby with unshakable confidence.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/contact"
              className="btn-primary"
            >
              Request an Invitation
            </Link>
            <Link
              to="/membership"
              className="btn-secondary"
            >
              View Membership Tiers
            </Link>
          </div>

          <form
            className="mt-6 mx-auto flex flex-col sm:flex-row items-center gap-3 max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              type="text"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
              placeholder="Type your special invite code 💌"
              className="w-full rounded-full border border-babyBlue/40 bg-white/95 px-5 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
            />
            <button
              type="submit"
              className="btn-secondary w-full sm:w-auto"
            >
              Verify Code
            </button>
          </form>

          <div className="mt-10 grid gap-6 text-left text-pebble/80 md:grid-cols-3">
            {[
              { logo: logo1, label: "Invite-Only", detail: "A discreet client list curated by personal referral." },
              { logo: logo2, label: "Concierge Care", detail: "Taylor personally oversees every bespoke decision." },
              { logo: logo3, label: "Confidential Always", detail: "NDA-backed planning for nurseries, events, and lifestyle." },
            ].map(({ logo, label, detail }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="rounded-[2rem] border border-babyPink/20 bg-white/95 px-5 py-6 shadow-soft transition-transform duration-200 hover:-translate-y-1 hover:shadow-dreamy"
              >
                <div className="mb-3 flex justify-center">
                  <img src={logo} alt={`${label} emblem`} className="h-12 w-12 object-contain" />
                </div>
                <p className="mt-3 font-playful text-lg text-blueberry">{label}</p>
                <p className="text-sm font-sans text-pebble/80">{detail}</p>
              </motion.div>
            ))}
          </div>
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
                <p className="mt-2 text-sm font-sans text-pebble/80 leading-relaxed">{feature.blurb}</p>
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
          className="px-6 py-6 max-w-2xl mx-auto space-y-6 text-pebble/85"
        >
          <blockquote className="italic border-l-4 border-babyPink pl-4 font-sans text-base bg-white/90 rounded-2xl py-4 shadow-soft backdrop-blur-sm">
            “Taylor anticipated every detail — from a bespoke nursery reveal to a mother-in-law arrival plan. We simply got to enjoy it.” — Founding Member, Scottsdale
          </blockquote>
          <blockquote className="italic border-l-4 border-babyBlue pl-4 font-sans text-base bg-white/90 rounded-2xl py-4 shadow-soft backdrop-blur-sm">
            “Registry to travel concierge, all handled with grace and impeccable discretion.” — Founding Member, Manhattan
          </blockquote>
        </motion.div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Process */}
      <Section title="How It Works" tightTop compact className="bg-alt-pink">
        <div className="px-6 py-6 max-w-4xl mx-auto text-pebble/85">
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
                <p className="mt-2 font-sans text-sm text-pebble/80 leading-relaxed">{body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Membership Preview */}
      <Section title="Membership Packages" tightTop compact className="bg-alt-blue">
        <div className="px-6 py-6 max-w-5xl mx-auto text-pebble/85 space-y-6">
          <p className="text-center text-sm sm:text-base leading-relaxed">
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
                <p className="mt-3 text-sm leading-relaxed text-pebble/80">{pkg.description}</p>
                <Link
                  to="/membership"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-babyBlue/40 bg-babyBlue/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-blueberry transition-transform duration-200 hover:-translate-y-1 hover:shadow-soft"
                >
                  Explore {pkg.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center text-sm text-pebble/70">
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
        <div className="px-6 py-6 max-w-4xl mx-auto text-pebble/85 space-y-6">
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
                <p className="mt-2 text-sm font-sans text-pebble/80 leading-relaxed">{perk.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

    </div>
  );
};

export default Home;
