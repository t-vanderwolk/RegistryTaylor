import React from "react";
import { Link } from "react-router-dom";
import { H1, H2, P } from "../design-system/Typography";

export default function HowItWorks() {
  return (
    <>
      <section className="section-padding bg-ivory even:bg-white/80 relative mx-auto max-w-6xl rounded-[3.5rem] bg-gradient-to-br from-ivory via-white to-white text-center shadow-soft motion-safe:animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-ivory/60 backdrop-blur-[2px]" />
        <div className="relative z-10 space-y-5">
          <H1>Learn · Plan · Connect — The Taylor-Made Way</H1>
          <P className="mx-auto max-w-2xl">
            Every journey begins as a member, guided through the Academy before partnering with a mentor and stepping into the community. Each stage prepares you to one day lead with the same calm confidence.
          </P>
        </div>
      </section>

      <section className="section-padding bg-ivory even:bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          <article className="space-y-4 rounded-[3rem] border border-mauve/30 bg-white/90 p-8 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy">
            <span className="badge-pill bg-mauve/15 text-mauve">Learn</span>
            <H2 className="text-2xl">Academy Foundations</H2>
            <P className="mx-auto max-w-sm">
              Dive into the Taylor-Made Baby Academy. Lessons, reflections, and guided rituals build fluency in the Taylor-Made framework so you can nurture your family and plant the seeds of future mentorship.
            </P>
          </article>
          <article className="space-y-4 rounded-[3rem] border border-mauve/30 bg-white/90 p-8 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy">
            <span className="badge-pill bg-mauve/15 text-mauve">Plan</span>
            <H2 className="text-2xl">Mentor Partnership</H2>
            <P className="mx-auto max-w-sm">
              Your mentor translates Academy insights into bespoke plans—registry curation, nursery storytelling, safety coaching, and postpartum rhythms—designed around your pace and preferences.
            </P>
          </article>
          <article className="space-y-4 rounded-[3rem] border border-mauve/30 bg-white/90 p-8 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy">
            <span className="badge-pill bg-mauve/15 text-mauve">Connect</span>
            <H2 className="text-2xl">Community Evolution</H2>
            <P className="mx-auto max-w-sm">
              Inside the private community, members and mentors share wisdom, celebrate milestones, and prepare for the day they guide the next family—completing the Member → Mentor circle.
            </P>
          </article>
        </div>
      </section>
      <section className="section-padding bg-ivory even:bg-white/80">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-[3.5rem] border border-mauve/25 bg-white/95 p-8 text-left shadow-soft lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <span className="badge-pill bg-mauve/20 text-mauve">Member → Mentor Momentum</span>
            <H2 className="text-3xl sm:text-4xl text-mauve">Progress with purpose</H2>
            <P className="max-w-xl">
              Learn in the Academy, plan hand-in-hand with your mentor, and connect in the community until you are ready to guide the next family. Each loop through the cycle elevates both your confidence and the families who follow.
            </P>
          </div>
          <ul className="space-y-5 text-sm text-charcoal/75 sm:text-base">
            {[
              "Academy modules blend education, reflection, and implementation prompts so lessons become lived experience.",
              "Mentor planning sessions translate insights into calm, beautifully organized action.",
              "Community salons and circles invite you to contribute, learn, and prepare for mentorship.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-mauve" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-ivory even:bg-white/80 mx-auto max-w-6xl rounded-[3.5rem] bg-gradient-to-br from-ivory via-white to-white text-center shadow-soft motion-safe:animate-fade-in-up">
        <H2 className="text-3xl sm:text-4xl text-mauve">Begin as a Member. Grow as a Mentor.</H2>
        <P className="mx-auto mb-8 max-w-2xl">
          Request an invitation to join the Academy, meet your mentor, and feel supported at every step of the Learn · Plan · Connect cycle.
        </P>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/request-invite"
            className="rounded-full bg-mauve px-8 py-3 text-xs font-heading uppercase tracking-[0.35em] text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
          >
            Request Your Invite
          </Link>
          <Link
            to="/membership"
            className="rounded-full border border-mauve bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-ivory/70"
          >
            Explore Membership Journey
          </Link>
        </div>
      </section>
    </>
  );
}
