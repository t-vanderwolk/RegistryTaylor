import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import { H1, H2, P } from "../design-system/Typography";

const tiers = [
  {
    name: "Member",
    headline: "Begin the journey",
    description:
      "Receive your invitation, unlock the Taylor-Made Baby Academy, and join a community that learns together. Members move through curated lessons, guided reflections, and seasonal salons.",
    features: [
      "Full access to the Taylor-Made Baby Academy curriculum",
      "Concierge office hours and seasonal planning salons",
      "Private community discussions and milestone celebrations",
    ],
  },
  {
    name: "Mentor in Training",
    headline: "Deepen your practice",
    description:
      "Graduate into a guided certification track. Partner with experienced mentors, refine your voice, and practice the frameworks that keep families calm, connected, and confident.",
    features: [
      "Certification modules with mentor-led feedback",
      "Hands-on planning labs spanning registry, nursery, safety, and postpartum support",
      "Apprenticeship-style shadowing with the concierge team",
    ],
  },
  {
    name: "Mentor",
    headline: "Lead with confidence",
    description:
      "Share your wisdom as a certified Taylor-Made Mentor. Guide new members, host salons, and continue evolving through ongoing education and community leadership.",
    features: [
      "Concierge-approved client pairings and planning toolkits",
      "Ongoing education masterclasses and peer mentorship",
      "Opportunities to host community gatherings and earn through guidance",
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const Membership: React.FC = () => {
  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
        <Section>
          <motion.div
            className="space-y-6 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.9 }}
          >
            <span className="inline-flex items-center justify-center rounded-full bg-mauve/40 px-5 py-2 text-xs uppercase tracking-[0.35em] text-charcoal">
              Membership Journey
            </span>
            <H1>Begin as a Member. Grow as a Mentor.</H1>
            <P className="mx-auto max-w-3xl">
              Taylor-Made Baby Co. is an invite-only progression. Each stage deepens your knowledge, your planning confidence, and your capacity to guide the next family.
            </P>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/request-invite">
                Request Your Invite
              </Button>
              <Button as={Link} to="/contact" variant="gold">
                Concierge Conversation
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
                <div className="space-y-2">
                  <P className="text-xs font-semibold uppercase tracking-[0.35em] text-charcoal/70">
                    {tier.name}
                  </P>
                  <H2 className="text-mauve text-3xl">{tier.headline}</H2>
                  <P>{tier.description}</P>
                </div>
                <ul className="space-y-3 text-sm text-charcoal/80 sm:text-base">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-mauve" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button as={Link} to="/request-invite" className="mt-auto">
                  Begin This Stage
                </Button>
              </Card>
            ))}
          </motion.div>
        </Section>

        <Section
          title="Support woven through every stage"
          description="Whether you are studying, planning, or guiding, the Taylor-Made framework keeps calm, connection, and community at the heart of every milestone."
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

        <Section className="text-center">
          <motion.div
            className="mx-auto flex max-w-5xl flex-col gap-5 rounded-[2.75rem] bg-gradient-to-r from-mauve/50 via-blush/40 to-mauve/35 p-8 text-center shadow-[0_24px_60px_-28px_rgba(46,46,46,0.3)] sm:p-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <H2 className="text-mauve">Your journey begins here</H2>
            <P className="mx-auto max-w-3xl">
              Invitations are extended to families who value intentional learning and community. Share your story, meet your mentor, and prepare to one day guide another family through the Taylor-Made way.
            </P>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/request-invite">
                Request Your Invite
              </Button>
              <Button as={Link} to="/contact" variant="gold">
                Concierge Conversation
              </Button>
            </div>
          </motion.div>
        </Section>
    </div>
  );
};

export default Membership;
