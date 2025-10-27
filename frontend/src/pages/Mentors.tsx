import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import Input from "../design-system/Input";
import { H1, H2, P } from "../design-system/Typography";
import { useSafeFetch } from "../hooks/useSafeFetch";
import EmptyState from "../components/ui/EmptyState";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Mentors: React.FC = () => {
  // ✅ Corrected call – only two arguments
  const { data, loading, error } = useSafeFetch("/api/mentors", {
    method: "GET",
    fallback: { data: [] },
    skip: false,
    requiresAuth: false,
  });

  const mentors = Array.isArray(data?.data) ? data.data : [];

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
              Member → Mentor
            </span>
            <H1 className="mx-auto max-w-4xl">
              Meet the mentors who grew from members
            </H1>
            <P className="mx-auto max-w-3xl">
              Every Taylor-Made mentor began as an invited member. Through the Academy and guided certification, they now calm the path for new families—translating experience into concierge-level support.
            </P>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/contact">
                Request a Mentor Match
              </Button>
              <Button as="a" href="#apply" variant="gold">
                Apply to Mentor
              </Button>
            </div>
          </motion.div>
        </Section>

        <Section title="Meet our mentors">
          <motion.div
            className="grid gap-6 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            {loading && <P>Loading mentors…</P>}
            {error && (
              <EmptyState
                title="Unable to load mentors"
                description={error.message || "Please try again soon."}
                action={null}
              />
            )}
            {!loading && !error && mentors.length === 0 && (
              <EmptyState
                title="New mentors joining soon"
                description="Taylor is curating the next circle."
                action={null}
              />
            )}
            {!loading &&
              !error &&
              mentors.map((mentor) => (
                <Card key={mentor.id} className="bg-white/95">
                  <H2 className="text-xl">{mentor.name}</H2>
                  <P className="mt-2 text-sm uppercase tracking-[0.25em] text-charcoal/60">
                    {mentor.specialty || "Concierge mentor"}
                  </P>
                  {mentor.certifications && (
                    <P className="mt-4 text-sm text-charcoal/70">
                      Certifications: {mentor.certifications}
                    </P>
                  )}
                </Card>
              ))}
          </motion.div>
        </Section>

        <Section id="apply" title="Become a Taylor-Made mentor">
          <motion.div
            className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <div className="space-y-5">
              <P>
                Ready to move from member to mentor? Share how the Taylor-Made framework has shaped your own family. We welcome voices rooted in calm leadership, discretion, and a love of teaching.
              </P>
              <P>
                Once invited, you’ll join the Mentor in Training track to refine your guidance before supporting new members. Together we make sure every family feels held.
              </P>
            </div>
            <Card className="bg-white/95">
              <form className="space-y-4">
                <Input id="mentor-name" label="Name" placeholder="Your full name" />
                <Input id="mentor-email" label="Email" type="email" placeholder="name@example.com" />
                <Input
                  id="mentor-seasons"
                  label="Seasons you love supporting"
                  placeholder="e.g., multiples, travel, fourth trimester"
                />
                <label htmlFor="mentor-note" className="flex flex-col gap-2 font-body text-sm text-charcoal/90">
                  <span className="text-xs uppercase tracking-[0.3em] text-charcoal/70">A note from you</span>
                  <textarea
                    id="mentor-note"
                    rows={4}
                    className="rounded-2xl border border-mauve/50 bg-ivory px-4 py-3 text-charcoal shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition focus:border-blush focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                    placeholder="Share a glimpse into your family and why you feel called to mentor."
                  />
                </label>
                <Button type="button" className="w-full">
                  Submit Mentor Application
                </Button>
              </form>
            </Card>
          </motion.div>
        </Section>
    </div>
  );
};

export default Mentors;
