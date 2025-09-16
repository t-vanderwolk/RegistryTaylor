import React from "react";
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
  const previewTiers = membershipTiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    priceLabel: tier.startingPrice?.startsWith("$")
      ? `Starting at ${tier.startingPrice}`
      : tier.startingPrice,
    description: tier.intro,
  }));

  return (
    <div className="min-h-screen bg-transparent font-sans text-cozyGray">
      {/* Hero Section */}
      <Section center tightTop compact className="bg-gradient-to-br from-blush/40 via-white to-softGold/25">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-bubble bg-white/90 px-5 sm:px-6 py-14 sm:py-16 text-center shadow-dreamy border border-softGold/30 backdrop-blur"
        >
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-softGold/70 bg-white text-sm sm:text-base font-serif tracking-[0.4em] text-deepSlate shadow-soft"
          >
            TM
          </motion.div> */}
          <motion.h1
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: [0.98, 1.03, 1] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-4 text-center font-serif text-4xl sm:text-5xl md:text-6xl text-deepSlate"
          >
            Baby Prep, Taylor-Made.
          </motion.h1>

          <p className="font-sans text-lg md:text-xl text-cozyGray/80 max-w-2xl mx-auto">
            Invite-only baby planning, styled and scheduled for discerning families who value privacy, polish, and calm.
          </p>

          {/* <motion.img
            src="/assets/hero-baby.png"
            alt="Baby Planning Illustration"
            className="mx-auto mt-6 w-full max-w-xs sm:max-w-md shadow-soft animate-float"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          /> */}

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/contact"
              className="btn-primary text-sm sm:text-base md:text-lg px-7 sm:px-8 py-3"
            >
              Request an Invitation
            </Link>
            <Link
              to="/membership"
              className="btn-secondary text-sm sm:text-base md:text-lg px-7 sm:px-8 py-3"
            >
              View Membership Tiers
            </Link>
          </div>

          <div className="mt-10 grid gap-6 text-left text-cozyGray/80 md:grid-cols-3">
            {[
              { logo: logo1, label: "Invite-Only", detail: "A discreet client list curated by referral." },
              { logo: logo2, label: "Concierge Care", detail: "Taylor personally oversees every decision." },
              { logo: logo3, label: "Confidential Always", detail: "NDA-backed planning and event management." },
            ].map(({ logo, label, detail }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="rounded-3xl border border-softGold/25 bg-white px-5 py-4 shadow-soft hover:bg-softGold/10 transition"
              >
                <div className="mb-3 flex justify-center">
                  <img src={logo} alt={`${label} emblem`} className="h-12 w-12 object-contain" />
                </div>
                <p className="mt-3 font-serif text-lg text-deepSlate">{label}</p>
                <p className="text-sm font-sans text-cozyGray/75">{detail}</p>
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
                className="rounded-3xl border border-softGold/25 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-sm"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-3 font-serif text-lg text-deepSlate">{feature.title}</h3>
                <p className="mt-2 text-sm font-sans text-cozyGray/75 leading-relaxed">{feature.blurb}</p>
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
          className="px-6 py-6 max-w-2xl mx-auto space-y-6 text-cozyGray/85"
        >
          <blockquote className="italic border-l-4 border-softGold/60 pl-4 font-sans text-base bg-white/90 rounded-2xl py-4 shadow-soft backdrop-blur-sm">
            “Taylor anticipated every detail — from a bespoke nursery reveal to a mother-in-law arrival plan. We simply got to enjoy it.” — Founding Member, Scottsdale
          </blockquote>
          <blockquote className="italic border-l-4 border-softGold/60 pl-4 font-sans text-base bg-white/90 rounded-2xl py-4 shadow-soft backdrop-blur-sm">
            “Registry to travel concierge, all handled with grace and impeccable discretion.” — Founding Member, Manhattan
          </blockquote>
        </motion.div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Process */}
      <Section title="How It Works" tightTop compact className="bg-alt-pink">
        <div className="px-6 py-6 max-w-4xl mx-auto text-cozyGray/85">
          <ol className="grid gap-6 md:grid-cols-2">
            {membershipJourneySteps.map(({ step, title, body }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-3xl border border-softGold/25 bg-white px-5 py-6 shadow-soft"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-softGold">{step}</p>
                <h3 className="mt-2 font-serif text-xl text-deepSlate">{title}</h3>
                <p className="mt-2 font-sans text-sm text-cozyGray/75 leading-relaxed">{body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Membership Preview */}
      <Section title="Membership Packages" tightTop compact className="bg-alt-blue">
        <div className="px-6 py-6 max-w-5xl mx-auto text-cozyGray/85 space-y-6">
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
                className="rounded-3xl border border-softGold/25 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-sm"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-softGold">{pkg.priceLabel}</p>
                <h3 className="mt-2 font-serif text-2xl text-deepSlate">{pkg.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cozyGray/75">{pkg.description}</p>
                <Link
                  to="/membership"
                  className="mt-5 inline-flex items-center justify-center rounded-full border border-deepSlate/20 bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-deepSlate transition hover:border-deepSlate/40 hover:bg-white"
                >
                  Explore {pkg.name}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center text-sm text-cozyGray/70">
            Want to add more sparkle? Browse the full <Link to="/add-ons" className="text-deepSlate underline decoration-softGold/50">Taylor-Made Add-Ons Menu</Link>.
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* Membership */}
      <Section title="Membership Perks" tightTop compact className="bg-alt-green">
        <div className="px-6 py-6 max-w-4xl mx-auto text-cozyGray/85 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {membershipBenefits.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className="rounded-3xl border border-softGold/25 bg-white/90 px-5 py-6 shadow-soft backdrop-blur-sm"
              >
                <div className="text-3xl">{perk.icon}</div>
                <h3 className="mt-2 font-serif text-lg text-deepSlate">{perk.title}</h3>
                <p className="mt-2 text-sm font-sans text-cozyGray/75 leading-relaxed">{perk.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectionDivider className="my-6" />

      {/* About */}
      <Section title="About Me" tightTop compact className="bg-alt-purple">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-6 max-w-2xl mx-auto text-cozyGray/85"
        >
          <p className="font-sans text-base leading-relaxed">
            I built my expertise curating gear at Strolleria, styling spaces for Pottery Barn Kids, and serving as a concierge for high-profile families. Taylor-Made was born to deliver that insider knowledge with a softer, more personal touch.
          </p>
          <p className="mt-4 font-sans text-base leading-relaxed">
            When I’m not refining registry lists, you’ll find me walking Bea and Karma — our resident brand mascots — or scouting the next dreamy baby shower venue. Every detail is handled with the same warmth I give my own circle.
          </p>
        </motion.div>
      </Section>
    </div>
  );
};

export default Home;
