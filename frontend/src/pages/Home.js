import React from "react";
import { Link } from "react-router-dom";
import Button from "../design-system/Button";

const highlightSections = [
  {
    title: "Become a Member",
    eyebrow: "Stage One",
    description:
      "Request an invitation to begin your Taylor-Made journey. Members unlock the Academy, concierge guidance, and a circle that keeps calm confidence at the center.",
    cta: "Request Your Invite",
    to: "/request-invite",
  },
  {
    title: "Learn in the Academy",
    eyebrow: "Learn",
    description:
      "Immerse yourself in the Taylor-Made Baby Academy—curated lessons, reflections, and rituals designed to guide each trimester with intention.",
    cta: "Explore the Academy Path",
    to: "/how-it-works",
  },
  {
    title: "Plan with Your Mentor",
    eyebrow: "Plan",
    description:
      "Partner with a certified mentor for registry curation, nursery storytelling, car seat safety, and postpartum support grounded in experience.",
    cta: "Meet Your Mentor",
    to: "/mentors",
  },
  {
    title: "Connect in Community",
    eyebrow: "Connect",
    description:
      "Join a private member forum where milestones are celebrated, questions are welcomed, and future mentors are nurtured.",
    cta: "Visit the Community",
    to: "/community-forum",
  },
];

const testimonials = [
  {
    quote:
      "The Academy gave us language for every decision, and our mentor kept each milestone calm and personal.",
    name: "Avery & Sam Parker",
    detail: "Member → Mentor in Training",
  },
  {
    quote:
      "Learning, planning, and connecting with our mentor felt effortless—we always knew the next gentle step.",
    name: "Jordan & Devin Harper",
    detail: "Mentor in Training",
  },
  {
    quote:
      "Guiding new members now feels natural. The Taylor-Made framework taught us how to listen, reassure, and celebrate with calm confidence.",
    name: "Morgan Ellis",
    detail: "Certified Mentor",
  },
];

const HomeHero = () => (
  <section className="section-padding bg-ivory even:bg-white/80 relative overflow-hidden pt-28 sm:pt-32">
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface-panel animate-fade-up text-left">
        <span className="badge-pill bg-ivory/60 text-mauve">Member → Mentor Journey</span>
        <div className="mt-6 space-y-3">
          <p className="font-display text-5xl text-mauve md:text-6xl">Guided beginnings for growing families.</p>
          <p className="font-heading text-lg text-charcoal/80">
            Join a supportive, curated journey from pregnancy to postpartum — where every member learns, plans, and connects.
          </p>
        </div>
        <p className="mt-6 text-base text-charcoal/70 md:text-lg">
          Begin inside the Academy, plan alongside your mentor, and grow into the next generation of guides. Taylor-Made Baby Co. keeps the focus on connection over commerce.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button as={Link} to="/request-invite" variant="mauve" size="md">
            Request Your Invite
          </Button>
          <Button as={Link} to="/membership" variant="gold" size="md">
            Explore Membership Journey
          </Button>
        </div>
      </div>

      <div className="surface-card animate-fade-up lg:self-center">
        <h2 className="font-heading text-xl text-charcoal">Concierge Highlights</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          A glimpse at the services waiting once you’re welcomed inside the circle.
        </p>
        <div className="mt-6 space-y-5">
          {[
            "Registry curation and sourcing tailored to your rituals",
            "Nursery design with install, styling, and vendor orchestration",
            "Mentor circle with guided workbooks and celebration timelines",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-mauve/40 bg-blush/30 text-xs text-mauve">
                •
              </span>
              <p className="text-sm text-charcoal/75">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="section-padding bg-ivory even:bg-white/80">
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="mx-auto max-w-3xl text-center">
        <span className="badge-pill">Learn · Plan · Connect</span>
        <h2 className="mt-4 font-heading text-3xl text-mauve">The Taylor-Made path from member to mentor</h2>
        <p className="mt-3 text-sm text-charcoal/70">
          Every stage is designed to cultivate calm confidence—beginning with guided education, deepening through one-on-one planning, and flourishing within a community that celebrates growth.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {highlightSections.map((section) => (
          <article
            key={section.title}
            className="group h-full rounded-[2.5rem] border border-white/60 bg-white/90 p-6 shadow-surface transition hover:-translate-y-2 hover:shadow-dreamy"
          >
            <div className="flex flex-col gap-4">
              <p className="text-xs font-heading uppercase tracking-[0.3em] text-mauve/80">{section.eyebrow}</p>
              <h3 className="font-heading text-xl text-charcoal">{section.title}</h3>
              <p className="font-body text-sm leading-relaxed text-charcoal/75">{section.description}</p>
              <Button
                as={Link}
                to={section.to}
                variant="gold"
                className="self-start border border-transparent text-xs text-mauve hover:border-gold/50 hover:bg-ivory/70"
                size="sm"
              >
                {section.cta}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="section-padding bg-ivory even:bg-white/80">
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="flex flex-col items-center text-center">
        <span className="badge-pill bg-mauve/20 text-mauve">In Their Words</span>
        <h2 className="mt-4 font-heading text-3xl text-charcoal">Quiet confidence, shared by families & mentors</h2>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex h-full flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-surface"
          >
            <p className="text-sm text-charcoal/75">“{testimonial.quote}”</p>
            <div className="mt-auto pt-4 text-sm font-heading text-charcoal">
              <p>{testimonial.name}</p>
              <p className="text-xs font-body uppercase tracking-[0.28em] text-charcoal/50">{testimonial.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="section-padding bg-ivory even:bg-white/80 pb-28">
    <div className="surface-panel mx-auto max-w-5xl text-center">
      <span className="badge-pill bg-blush/40 text-mauve">Begin as a Member · Grow as a Mentor</span>
      <h2 className="mt-4 font-heading text-3xl text-mauve">Learn · Plan · Connect — the Taylor-Made way.</h2>
      <p className="mt-3 text-sm text-charcoal/70">
        Request an invitation to join the Academy, meet your mentor, and walk a path that one day empowers you to guide the next family.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button as={Link} to="/request-invite" variant="mauve">
          Request Your Invite
        </Button>
        <Button as={Link} to="/portal" variant="gold">
          Member Login
        </Button>
      </div>
    </div>
  </section>
);

const Home = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-ivory via-white to-ivory text-charcoal">
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,161,180,0.25)_0%,_rgba(200,161,180,0)_45%),radial-gradient(circle_at_80%_20%,_rgba(234,201,209,0.22)_0%,_rgba(234,201,209,0)_42%)]"
      aria-hidden="true"
    />
    <div className="relative z-10 flex min-h-screen flex-col">
      <main id="content" role="main" className="flex-1">
        <HomeHero />
        <FeaturesSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
    </div>
  </div>
);

export default Home;
