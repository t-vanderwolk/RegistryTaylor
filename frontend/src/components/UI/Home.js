// import React from "react";
import { Button } from "../design-system/Button";
import { Card } from "../design-system/Card";
import { Section } from "../design-system/Section";
import React from "react";
// import HeroSection from "../components/HeroSection";
// import HowItWorks from "../components/HowItWorks";
// import MembershipHighlights from "../components/MembershipHighlights";
// import FAQAccordion from "../components/FAQAccordion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
console.log({ Button, Card, Section, HeroSection, HowItWorks, MembershipHighlights, FAQAccordion, Footer, Navbar });
const navLinks = [
  { label: "Home", to: "/", target: "home" },
  { label: "How It Works", to: "/#how-it-works", target: "how-it-works" },
  { label: "Membership", to: "/membership" },
  { label: "Blog", to: "/blog" },
  { label: "Request Invite", to: "/request-invite" },
  { label: "Member Login", to: "/portal" },
];

const highlightSections = [
  {
    title: "Membership",
    eyebrow: "Concierge Programs",
    description:
      "Compare invitation-only memberships, learn what’s included, and select the cadence that feels right for your family.",
    cta: "Explore Memberships",
    to: "/membership",
  },
  {
    title: "Client Portal",
    eyebrow: "Members",
    description:
      "Already inside the circle? Log in for registries, nursery styling, celebration planning, and 1:1 mentor notes.",
    cta: "Enter Portal",
    to: "/portal",
  },
  {
    title: "Request Invite",
    eyebrow: "Apply",
    description:
      "Ready for concierge support? Share your story and Taylor will curate a welcome aligned with your vision.",
    cta: "Request Invite",
    to: "/request-invite",
  },
  {
    title: "Journal & Notes",
    eyebrow: "Stories",
    description:
      "Browse seasonal briefs, trend forecasts, and gentle prompts written exclusively for the Taylor-Made community.",
    cta: "Visit the Journal",
    to: "/blog",
  },
];

const testimonials = [
  {
    quote:
      "Taylor made every decision feel calm. Our registry, nursery, and travel plans were choreographed before we even knew what to ask.",
    name: "Avery & Sam Parker",
    detail: "Signature Members",
  },
  {
    quote:
      "The mentor circle was priceless—gentle reminders, honest check-ins, and a concierge who anticipated needs weeks ahead.",
    name: "Jordan & Devin Harper",
    detail: "Bespoke Members",
  },
  {
    quote:
      "From nursery install to sip & see hosting, everything felt curated. Taylor’s team keeps the magic effortless.",
    name: "Morgan Ellis",
    detail: "Mentor Concierge",
  },
];

const HomeHero = () => (
  <section className="relative overflow-hidden px-6 pb-24 pt-28 sm:pb-28 sm:pt-32">
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface-panel animate-fade-up text-left">
        <span className="badge-pill bg-tmIvory/60 text-tmMauve">Invite-Only Concierge</span>
        <div className="mt-6 space-y-3">
          <p className="font-display text-5xl text-tmMauve md:text-6xl">Taylor-Made Baby Co.</p>
          <p className="font-heading text-lg text-tmCharcoal/80">
            Registries, nursery design, celebration planning, and mentor support—curated for calm, confident parents.
          </p>
        </div>
        <p className="mt-6 text-base text-tmCharcoal/70 md:text-lg">
          Taylor and her concierge team choreograph every detail so each reveal feels personal, polished, and joyfully
          ready.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button as={Link} to="/request-invite" variant="mauve" size="md">
            Request Invite
          </Button>
          <Button as={Link} to="/membership" variant="secondary" size="md">
            Explore Memberships
          </Button>
        </div>
      </div>

      <div className="surface-card animate-fade-up lg:self-center">
        <h2 className="font-heading text-xl text-tmCharcoal">Concierge Highlights</h2>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          A glimpse at the services waiting once you’re welcomed inside the circle.
        </p>
        <div className="mt-6 space-y-5">
          {[
            "Registry & personal shopping tailored to your rituals",
            "Nursery design with install, styling, and vendor orchestration",
            "Mentor circle with guided workbooks and celebration timelines",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-tmMauve/40 bg-tmBlush/30 text-xs text-tmMauve">
                •
              </span>
              <p className="text-sm text-tmCharcoal/75">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="px-6 pb-24">
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="mx-auto max-w-3xl text-center">
        <span className="badge-pill">Journey Touchpoints</span>
        <h2 className="mt-4 font-heading text-3xl text-tmCharcoal">Continue the Taylor-Made experience</h2>
        <p className="mt-3 text-sm text-tmCharcoal/70">
          Each pathway mirrors what you discover inside the dashboard—soft cards, curated calls-to-action, and gentle
          pacing.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {highlightSections.map((section) => (
          <article
            key={section.title}
            className="group h-full rounded-[2.5rem] border border-white/60 bg-white/90 p-6 shadow-surface transition hover:-translate-y-2 hover:shadow-dreamy"
          >
            <div className="flex flex-col gap-4">
              <p className="text-xs font-heading uppercase tracking-[0.3em] text-tmMauve/80">{section.eyebrow}</p>
              <h3 className="font-heading text-xl text-tmCharcoal">{section.title}</h3>
              <p className="font-body text-sm leading-relaxed text-tmCharcoal/75">{section.description}</p>
              <Button
                as={Link}
                to={section.to}
                variant="ghost"
                className="self-start border border-transparent text-xs text-tmMauve hover:border-tmGold/50 hover:bg-tmIvory/70"
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
  <section className="px-6 pb-24">
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="flex flex-col items-center text-center">
        <span className="badge-pill bg-tmMauve/20 text-tmMauve">In Their Words</span>
        <h2 className="mt-4 font-heading text-3xl text-tmCharcoal">Quiet confidence, shared by families & mentors</h2>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex h-full flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-surface"
          >
            <p className="text-sm text-tmCharcoal/75">“{testimonial.quote}”</p>
            <div className="mt-auto pt-4 text-sm font-heading text-tmCharcoal">
              <p>{testimonial.name}</p>
              <p className="text-xs font-body uppercase tracking-[0.28em] text-tmCharcoal/50">{testimonial.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="px-6 pb-28">
    <div className="surface-panel mx-auto max-w-5xl text-center">
      <span className="badge-pill bg-tmBlush/40 text-tmMauve">Your Story, Curated</span>
      <h2 className="mt-4 font-heading text-3xl text-tmCharcoal">Begin with a conversation and finish with a concierge reveal.</h2>
      <p className="mt-3 text-sm text-tmCharcoal/70">
        Taylor’s team will gather inspiration, align on milestones, and choreograph every touchpoint so you can savor the calm.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button as={Link} to="/request-invite" variant="mauve">
          Request Your Invite
        </Button>
        <Button as={Link} to="/portal" variant="secondary">
          Member Login
        </Button>
      </div>
    </div>
  </section>
);

const Home = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-tmIvory via-white to-tmIvory text-tmCharcoal">
    <div
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,161,180,0.25)_0%,_rgba(200,161,180,0)_45%),radial-gradient(circle_at_80%_20%,_rgba(234,201,209,0.22)_0%,_rgba(234,201,209,0)_42%)]"
      aria-hidden="true"
    />

    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar items={navLinks} />
      <main id="content" role="main" className="flex-1">
        <HomeHero />
        <FeaturesSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  </div>
);

export default Home;
