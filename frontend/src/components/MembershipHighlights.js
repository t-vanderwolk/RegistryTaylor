import React from "react";
import { Link } from "react-router-dom";

const perks = [
  {
    title: "Concierge Tailored to You",
    description:
      "Quarterly planning sessions, on-call support, and a private client portal that keeps every decision in one dreamy dashboard.",
  },
  {
    title: "Boutique Vendor Access",
    description:
      "Direct introductions to stylists, doulas, and nursery artisans—only available to Taylor-Made members.",
  },
  {
    title: "Celebration Styling",
    description:
      "Sip & see soirees, baby showers, and welcome home moments styled with custom mood boards and RSVP management.",
  },
];

const MembershipHighlights = () => (
  <section
    id="membership"
    tabIndex="-1"
    className="mx-auto mt-20 max-w-6xl rounded-[3rem] border border-babyBlue/15 bg-white p-10 shadow-soft"
  >
    <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
      <div>
        <p className="text-xs font-heading uppercase tracking-[0.45em] text-blueberry/70">Membership</p>
        <h2 className="mt-3 text-4xl font-heading text-blueberry">The Taylor-Made Membership</h2>
        <p className="mt-4 max-w-xl text-sm text-midnight/70">
          Memberships begin at a three-month concierge engagement and expand as your family grows. Request an invite to receive custom pricing and seasonal availability.
        </p>
      </div>
      <Link
        to="/membership"
        className="inline-flex items-center justify-center rounded-full border border-babyBlue/40 bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.35em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:scale-[1.02] hover:bg-skyMist focus:outline-none focus-visible:ring-2 focus-visible:ring-babyBlue/60 focus-visible:ring-offset-2 focus-visible:ring-offset-softBeige"
      >
        View Membership Guide
      </Link>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {perks.map((perk) => (
        <article
          key={perk.title}
          className="h-full rounded-[2.5rem] border border-babyBlue/20 bg-softBeige/60 p-6 text-left shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-dreamy"
        >
          <h3 className="text-2xl font-heading text-blueberry">{perk.title}</h3>
          <p className="mt-3 text-sm text-midnight/75">{perk.description}</p>
        </article>
      ))}
    </div>
  </section>
);

export default MembershipHighlights;
