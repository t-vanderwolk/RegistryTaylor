import React from "react";
import { Link } from "react-router-dom";
import Section from "../components/UI/Section";

const mentorHighlights = [
  {
    title: "First-Time Mom",
    subtitle: "Coastal | Creative Director",
    description: "Navigated IVF, cross-country moves, and a high-visibility career with grace and humor.",
    tags: ["ivf", "career", "coastal"],
  },
  {
    title: "Twin Mom",
    subtitle: "NYC | Luxury Fashion",
    description: "Specializes in sleep training multiples, travel logistics, and extended family integration.",
    tags: ["multiples", "travel", "extended family"],
  },
  {
    title: "Working Mom",
    subtitle: "LA | Entertainment",
    description: "Balances production schedules, childcare rotations, and discreet public appearances.",
    tags: ["production", "childcare", "press"],
  },
  {
    title: "Second-Time Mom",
    subtitle: "Austin | Tech Founder",
    description: "Blends toddler transitions with newborn prep through gentle routines and curated gear swaps.",
    tags: ["toddler", "gear", "routines"],
  },
];

const MentorCard = ({ title, subtitle, description, tags }) => (
  <article className="rounded-3xl border border-softGold/25 bg-white/85 p-6 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-dreamy">
    <header className="mb-4">
      <h3 className="font-serif text-2xl text-deepSlate">{title}</h3>
      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cozyGray/70">{subtitle}</p>
    </header>
    <p className="text-sm text-cozyGray/75 leading-relaxed">{description}</p>
    <ul className="mt-4 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-deepSlate/70">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-softGold/40 px-3 py-1">
          {tag}
        </li>
      ))}
    </ul>
  </article>
);

const Mentors = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section
        title="Taylor-Made Mentor Circle"
        center
        compact
        tightTop
        className="bg-gradient-to-br from-pastelPurple/45 via-white to-softGold/25"
      >
        <div className="space-y-6">
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-cozyGray/80">
            Our private circle connects you with mothers who have been exactly where you are. Mentors are hand-selected, discreet, and ready to offer gentle insight, practical tips, and introductions within their own trusted networks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm">
              Request a Mentor Match
            </Link>
            <a href="#apply" className="btn-secondary px-6 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm">
              Apply to Mentor
            </a>
          </div>
        </div>
      </Section>
      <Section title="Browse Mentors" compact className="bg-alt-blue">
        <div className="grid gap-6 md:grid-cols-2">
          {mentorHighlights.map((mentor) => (
            <MentorCard key={mentor.title} {...mentor} />
          ))}
        </div>
      </Section>
      <Section id="apply" title="Become a Taylor-Made Mom Mentor" compact className="bg-alt-green">
        <div className="space-y-5 text-cozyGray/80">
          <p>
            We invite warm, grounded mothers who are ready to give back. Share your story, areas of expertise, and the seasons you feel called to support. Taylor personally reviews every application for fit and alignment.
          </p>
          <div className="rounded-3xl border border-softGold/25 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
            <form className="grid gap-4">
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Name</span>
                <input
                  type="text"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="Your full name"
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Email</span>
                <input
                  type="email"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="name@taylor-made.com"
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Lifestyle Tags</span>
                <input
                  type="text"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="e.g. twin mom, travel, entrepreneur"
                />
              </label>
              <label className="flex flex-col text-sm">
                <span className="uppercase tracking-[0.2em] text-deepSlate/70">Experience Snapshot</span>
                <textarea
                  rows="4"
                  className="mt-2 rounded-2xl border border-softGold/30 bg-white/80 px-4 py-3 text-sm text-deepSlate focus:border-softGold focus:outline-none"
                  placeholder="Share how you supported your family and what wisdom you’d love to pass on."
                />
              </label>
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-deepSlate/20 bg-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-deepSlate transition hover:border-deepSlate/40 hover:bg-white"
              >
                Submit Mentor Application
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Mentors;
