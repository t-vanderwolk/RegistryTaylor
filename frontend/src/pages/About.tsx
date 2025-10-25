import React from "react";
import { motion } from "framer-motion";
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import { H1, H2, P } from "../design-system/Typography";
import profileImage from "../assets/belly-rub.jpeg";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const About: React.FC = () => {
  return (
    <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
        <Section>
          <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
            <motion.div
              className="relative overflow-hidden rounded-[3rem] border border-mauve/40 bg-white/85 shadow-[0_28px_70px_-30px_rgba(46,46,46,0.32)]"
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
              <div className="absolute inset-0 bg-gradient-to-br from-mauve/30 via-transparent to-blush/35" aria-hidden="true" />
            </motion.div>
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <span className="inline-flex rounded-full bg-mauve/40 px-5 py-2 text-xs uppercase tracking-[0.35em]">
                Meet Taylor
              </span>
              <H1>Gentle planning, heartfelt celebrations</H1>
              <P>
                Taylor founded Taylor-Made Baby Co. to give growing families a sanctuary amid the swirl of
                planning. With a background in luxury events and motherhood mentorship, she curates experiences
                that feel intentional, calm, and reflective of each family’s story.
              </P>
              <P>
                From the first registry edit to the final welcome-home touch, Taylor’s concierge circle is
                available to champion your decisions, connect you with trusted partners, and keep every detail on a
                pastel-perfect timeline.
              </P>
              <Button as="a" href="/contact">
                Book a Consultation
              </Button>
            </motion.div>
          </div>
        </Section>

        <Section title="Our ethos">
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
        </Section>
    </div>
  );
};

export default About;
