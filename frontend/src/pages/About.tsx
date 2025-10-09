import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/Layout/PageWrapper";
import PageHeader from "../components/Layout/PageHeader";
import CardSection from "../components/Layout/CardSection";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import { H2, P } from "../design-system/Typography";
import profileImage from "../assets/belly-rub.jpeg";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const About: React.FC = () => {
  return (
    <PageWrapper>
      <CardSection
        variant="plain"
        contentClassName=""
        className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center"
      >
        <motion.div
          className="relative overflow-hidden rounded-[3rem] border border-primary/40 bg-white/85 shadow-[0_28px_70px_-30px_rgba(46,46,46,0.32)]"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.9 }}
        >
          <img
            src={profileImage}
            alt="Taylor, the concierge behind Taylor-Made Baby Co."
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/35" aria-hidden="true" />
        </motion.div>
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <PageHeader
            eyebrow="Meet Taylor"
            title="Gentle planning, heartfelt celebrations"
            description="Taylor founded Taylor-Made Baby Co. to give growing families a sanctuary amid the swirl of planning. With a background in luxury events and motherhood mentorship, she curates experiences that feel intentional, calm, and reflective of each family’s story."
            align="left"
            className="gap-6"
            eyebrowClassName="bg-primary/40 text-ink"
          >
            <P>
              From the first registry edit to the final welcome-home touch, Taylor’s concierge circle is available
              to champion your decisions, connect you with trusted partners, and keep every detail on a pastel-perfect timeline.
            </P>
            <Button as="a" href="/contact">
              Book a Consultation
            </Button>
          </PageHeader>
        </motion.div>
      </CardSection>

      <CardSection
        title="Our ethos"
        variant="plain"
        contentClassName=""
      >
        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
        >
          {[
            {
              title: "Calm is contagious",
              copy: "We handle logistics with grace so you can glide through each trimester with confidence.",
            },
            {
              title: "Cherish the details",
              copy: "From hand-tied ribbons to custom welcome notes, every touchpoint feels considered.",
            },
            {
              title: "Intimacy matters",
              copy: "We work with a limited number of families per season to deliver bespoke attention.",
            },
          ].map((item) => (
            <Card key={item.title} className="h-full bg-white/95">
              <H2 className="text-xl">{item.title}</H2>
              <P className="mt-3">{item.copy}</P>
            </Card>
          ))}
        </motion.div>
      </CardSection>
    </PageWrapper>
  );
};

export default About;
