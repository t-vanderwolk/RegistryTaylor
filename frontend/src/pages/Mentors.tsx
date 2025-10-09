import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageWrapper from "../components/Layout/PageWrapper";
import PageHeader from "../components/Layout/PageHeader";
import CardSection from "../components/Layout/CardSection";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import Input from "../design-system/Input";
import { H2, P } from "../design-system/Typography";
import { useSafeFetch } from "../hooks/useSafeFetch";
import EmptyState from "../components/ui/EmptyState";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Mentors: React.FC = () => {
  const { data, loading, error } = useSafeFetch(
    "/api/mentors",
    {},
    { fallback: { data: [] }, skip: false, requiresAuth: false }
  );
  const mentors = Array.isArray(data?.data) ? data.data : [];

  return (
    <PageWrapper>
      <motion.div
        className="w-full"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.9 }}
      >
        <PageHeader
          eyebrow="Mentor Circle"
          title="Handpicked mentors guiding you through every trimester"
          description="When you become a Taylor-Made member, you’re paired with mentors who’ve lived the milestones you’re approaching. Each mentor is personally vetted, bound by NDA, and ready with calm, lived-in wisdom."
        >
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/contact">
              Request a Mentor Match
            </Button>
            <Button as="a" href="#apply" variant="ghost">
              Apply to Mentor
            </Button>
          </div>
        </PageHeader>
      </motion.div>

      <CardSection
        title="Meet our mentors"
        variant="plain"
        contentClassName=""
      >
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
                <P className="mt-2 text-sm uppercase tracking-[0.25em] text-ink/60">
                  {mentor.specialty || "Concierge mentor"}
                </P>
                {mentor.certifications && (
                  <P className="mt-4 text-sm text-ink/70">
                    Certifications: {mentor.certifications}
                  </P>
                )}
              </Card>
            ))}
        </motion.div>
      </CardSection>

      <CardSection
        id="apply"
        title="Become a Taylor-Made mentor"
        variant="plain"
        contentClassName=""
      >
        <motion.div
          className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
        >
          <div className="space-y-5">
            <P>
              If you’re a seasoned mother who loves making moments calmer for others, we’d love to meet you. Share
              a glimpse into your world—the concierge team will reach out within 48 hours during business days.
            </P>
            <P>
              We look for mentors who champion empathy, discretion, and a refreshingly calm tone. Together we make
              sure every family feels held.
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
              <label htmlFor="mentor-note" className="flex flex-col gap-2 font-body text-sm text-ink/90">
                <span className="text-xs uppercase tracking-[0.3em] text-ink/70">A note from you</span>
                <textarea
                  id="mentor-note"
                  rows={4}
                  className="rounded-2xl border border-primary/50 bg-cream px-4 py-3 text-ink shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  placeholder="Share a glimpse into your family and why you feel called to mentor."
                />
              </label>
              <Button type="button" className="w-full">
                Submit Mentor Application
              </Button>
            </form>
          </Card>
        </motion.div>
      </CardSection>
    </PageWrapper>
  );
};

export default Mentors;
