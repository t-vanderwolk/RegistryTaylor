import React from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
=======
import MarketingLayout from "../layouts/MarketingLayout";
>>>>>>> heroku/main
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import Input from "../design-system/Input";
import { H1, P } from "../design-system/Typography";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Contact: React.FC = () => {
  return (
<<<<<<< HEAD
    <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
=======
    <MarketingLayout>
      <div className="space-y-20 pb-24 pt-16 sm:space-y-28">
>>>>>>> heroku/main
        <Section>
          <motion.div
            className="space-y-4 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.9 }}
          >
<<<<<<< HEAD
            <span className="inline-flex items-center justify-center rounded-full bg-mauve/40 px-5 py-2 text-xs uppercase tracking-[0.35em] text-charcoal">
              Concierge Welcome
            </span>
            <H1 className="mx-auto max-w-4xl text-mauve">
              We welcome new members by invitation
            </H1>
            <P className="mx-auto max-w-2xl">
              Complete the form below to begin your Taylor-Made journey. We respond personally within one business day to learn more about your family, your hopes, and the mentorship you desire.
=======
            <span className="inline-flex items-center justify-center rounded-full bg-primary/40 px-5 py-2 text-xs uppercase tracking-[0.35em] text-ink">
              Contact Taylor
            </span>
            <H1 className="mx-auto max-w-4xl">
              Ready to bring calm to your baby planning?
            </H1>
            <P className="mx-auto max-w-2xl">
              Share a few details below and we’ll schedule a concierge consultation designed around your ideal
              timeline. Expect a warm reply within one business day.
>>>>>>> heroku/main
            </P>
          </motion.div>
        </Section>

        <Section>
          <motion.div
            className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <Card className="bg-white/95">
              <form className="space-y-4">
                <Input id="contact-name" label="Name" placeholder="Your full name" />
                <Input id="contact-email" label="Email" type="email" placeholder="name@example.com" />
                <Input id="contact-phone" label="Phone" type="tel" placeholder="(480) 555-0100" />
                <Input id="contact-due-date" label="Due date or celebration date" placeholder="MM/DD/YYYY" />
<<<<<<< HEAD
                <label htmlFor="contact-message" className="flex flex-col gap-2 font-body text-sm text-charcoal/90">
                  <span className="text-xs uppercase tracking-[0.3em] text-charcoal/70">How can we help?</span>
                  <textarea
                    id="contact-message"
                    rows={4}
                    className="rounded-2xl border border-mauve/50 bg-ivory px-4 py-3 text-charcoal shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition focus:border-blush focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
=======
                <label htmlFor="contact-message" className="flex flex-col gap-2 font-body text-sm text-ink/90">
                  <span className="text-xs uppercase tracking-[0.3em] text-ink/70">How can we help?</span>
                  <textarea
                    id="contact-message"
                    rows={4}
                    className="rounded-2xl border border-primary/50 bg-cream px-4 py-3 text-ink shadow-[0_10px_24px_-18px_rgba(46,46,46,0.18)] transition focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
>>>>>>> heroku/main
                    placeholder="Tell Taylor about your registry, nursery, or celebration goals."
                  />
                </label>
                <Button type="button" className="w-full">
<<<<<<< HEAD
                  Submit Invitation Request
=======
                  Book Your Consultation
>>>>>>> heroku/main
                </Button>
              </form>
            </Card>

            <Card className="bg-white/95">
              <div className="space-y-4">
<<<<<<< HEAD
                <H1 className="text-3xl text-mauve">Concierge details</H1>
                <P>Email: hello@taylormadebaby.co</P>
                <P>Concierge office hours: Monday – Thursday, 9am – 4pm MST.</P>
                <P>
                  Each membership begins with a conversation. Share the season you are entering and we’ll curate the next steps, from Academy access to mentor pairing.
                </P>
                <Button as="a" href="/request-invite" variant="gold">
                  Request Your Invite
=======
                <H1 className="text-3xl">Concierge details</H1>
                <P>Email: hello@taylormadebaby.co</P>
                <P>Consultation hours: Monday – Thursday, 9am – 4pm MST.</P>
                <P>
                  Prefer a private introduction? Request an invite with your preferred contact method and we’ll
                  reach out personally.
                </P>
                <Button as="a" href="/request-invite" variant="ghost">
                  Request Invite
>>>>>>> heroku/main
                </Button>
              </div>
            </Card>
          </motion.div>
        </Section>
<<<<<<< HEAD
    </div>
=======
      </div>
    </MarketingLayout>
>>>>>>> heroku/main
  );
};

export default Contact;
