import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MarketingLayout from "../layouts/MarketingLayout";
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import { H1, H2, P } from "../design-system/Typography";

const tiers = [
  {
    name: "Community Salon",
    investment: "$680",
    cadence: "per family",
    description:
      "Digital concierge touchpoints, quarterly salons, and access to Taylor’s private resource library.",
    features: [
      "Seasonal planning salons with live Q&A",
      "Digital resource library & checklists",
      "Members-only community lounge",
    ],
  },
  {
    name: "Signature Concierge",
    investment: "From $3,600",
    cadence: "per pregnancy",
    description:
      "Our most-loved tier for registry orchestration, nursery styling, and celebration production support.",
    features: [
      "Weekly concierge check-ins",
      "Registry design & gifting etiquette",
      "Nursery floor plan + styling support",
      "Celebration planning + vendor curation",
    ],
    highlight: "Most loved",
  },
  {
    name: "Bespoke Retainer",
    investment: "By invitation",
    cadence: "seasonal",
    description:
      "A private retainer for families seeking 24/7 concierge access, travel coordination, and couture reveals.",
    features: [
      "24/7 concierge hotline",
      "Private travel & relocation planning",
      "Couture nursery + celebration production",
      "Family lifestyle management under NDA",
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const Membership: React.FC = () => {
  return (
    <MarketingLayout>
      <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
        <Section>
          <motion.div
            className="space-y-6 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.9 }}
          >
            <span className="inline-flex items-center justify-center rounded-full bg-primary/40 px-5 py-2 text-xs uppercase tracking-[0.35em] text-ink">
              Memberships
            </span>
            <H1>Choose the cadence that fits your family</H1>
            <P className="mx-auto max-w-3xl">
              Membership opens the door to calm decision-making, heartfelt celebrations, and gentle accountability.
              Every tier includes Taylor’s personal oversight and NDA-backed discretion.
            </P>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/contact">
                Chat with Taylor
              </Button>
              <Button as={Link} to="/request-invite" variant="ghost">
                Request Invite
              </Button>
            </div>
          </motion.div>
        </Section>

        <Section>
          <motion.div
            className="grid gap-6 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className="relative flex h-full flex-col gap-5 bg-white/95"
              >
                {tier.highlight && (
                  <span className="absolute right-6 top-6 rounded-full bg-primary px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-ink shadow">
                    {tier.highlight}
                  </span>
                )}
                <div className="space-y-2">
                  <P className="text-xs font-semibold uppercase tracking-[0.35em] text-ink/70">
                    {tier.name}
                  </P>
                  <H2 className="text-ink text-3xl">{tier.investment}</H2>
                  <P className="text-xs uppercase tracking-[0.35em] text-ink/60">{tier.cadence}</P>
                  <P>{tier.description}</P>
                </div>
                <ul className="space-y-3 text-sm text-ink/80 sm:text-base">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button as={Link} to="/contact" className="mt-auto">
                  Explore This Tier
                </Button>
              </Card>
            ))}
          </motion.div>
        </Section>

        <Section
          title="Membership benefits"
          description="Across every tier, your concierge circle nurtures the details that keep you present and supported."
        >
          <motion.div
            className="grid gap-6 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            {[
              {
                title: "Registry Concierge",
                copy: "Multi-retailer lists, white-glove returns, and gifting etiquette shaped for your circle.",
              },
              {
                title: "Nursery Editorial",
                copy: "Palette studies, floor plans, and styling days tuned to your routines.",
              },
              {
                title: "Celebration Production",
                copy: "Shower concepts, curated vendors, and celebration scripts ready to host.",
              },
              {
                title: "Fourth-Trimester Care",
                copy: "Night-nurse introductions, postpartum rituals, and daily check-ins for calm evenings.",
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="h-full bg-white/95">
                <H2 className="text-xl">{benefit.title}</H2>
                <P className="mt-3">{benefit.copy}</P>
              </Card>
            ))}
          </motion.div>
        </Section>

        <Section>
          <motion.div
            className="mx-auto flex max-w-5xl flex-col gap-5 rounded-[2.75rem] bg-gradient-to-r from-primary/50 via-accent/40 to-primary/35 p-8 text-center shadow-[0_24px_60px_-28px_rgba(46,46,46,0.3)] sm:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <H2 className="text-ink">
              Secure your invite with complete confidence
            </H2>
            <P className="mx-auto max-w-3xl">
              If membership doesn’t feel like your match within 30 days, your investment is fully refundable—no
              questions asked.
            </P>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/request-invite">
                Secure Your Invite
              </Button>
              <Button as={Link} to="/contact" variant="ghost">
                Talk With Taylor
              </Button>
            </div>
          </motion.div>
        </Section>
      </div>
    </MarketingLayout>
  );
};

export default Membership;
