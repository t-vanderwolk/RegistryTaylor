import React from "react";
import { Link } from "react-router-dom";
import coupleHappy from "../assets/couple-happy.jpeg";
import bellyHug from "../assets/belly-hug.jpeg";

const perks = [
  {
    title: "Concierge Tailored to You",
    description:
      "Monthly check-ins, quick text support, and one spot to see what’s next so decisions feel easy.",
  },
  {
    title: "Boutique Vendor Access",
    description:
      "Personal intros to stylists, doulas, florists, and makers we trust for standout moments.",
  },
  {
    title: "Celebration Styling",
    description:
      "Showers, sip & sees, and welcome-home parties styled, scheduled, and guest-ready for you.",
  },
];

const MembershipHighlights = () => (
  <section
    id="membership"
    tabIndex="-1"
    className="relative mx-auto mt-24 max-w-6xl overflow-hidden rounded-[3.5rem] border border-babyPink/40 bg-gradient-to-br from-white via-babyPink/12 to-white px-6 py-16 shadow-soft backdrop-blur-sm sm:px-10 md:px-16"
  >
    <div className="pointer-events-none absolute -top-28 left-24 h-72 w-72 rounded-full bg-babyPink/30 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute -bottom-32 right-16 h-80 w-80 rounded-full bg-babyPink/28 blur-3xl" aria-hidden="true" />
    <div className="pointer-events-none absolute left-1/2 top-10 h-px w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-babyPink/45 to-transparent" aria-hidden="true" />

    <div className="relative grid gap-12 md:grid-cols-[1.1fr,0.9fr] md:items-center">
      <div className="space-y-6 text-center md:text-left">
        <p className="text-xs font-heading uppercase tracking-[0.55em] text-blueberry/70">Membership</p>
        <h2 className="text-4xl font-heading text-blueberry sm:text-5xl">The Taylor-Made Membership</h2>
        <span className="gold-divider md:ml-0" aria-hidden="true" />
        <p className="mx-auto max-w-xl text-base leading-relaxed text-midnight/75 md:mx-0">
          Memberships are invitation-only and run seasonally, meeting you where you are. You’ll get hands-on planning, trusted vendor recs, and an easy place to keep decisions sorted.
        </p>
        <Link
          to="/membership"
          className="inline-flex items-center justify-center rounded-full border border-babyPink/40 bg-white px-10 py-3 text-xs font-heading uppercase tracking-[0.4em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:scale-[1.02] hover:bg-softBeige focus:outline-none focus-visible:ring-2 focus-visible:ring-babyPink/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          View Membership Guide
        </Link>
      </div>

      <div className="relative">
        <div className="absolute -top-12 right-0 w-40 overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-dreamy backdrop-blur">
          <img src={bellyHug} alt="Couple sharing a joyful maternity embrace" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="overflow-hidden rounded-[3rem] border border-babyPink/35 bg-white shadow-dreamy">
          <img src={coupleHappy} alt="Expecting parents smiling during planning session" className="h-full w-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>

    <div className="relative mt-12 grid gap-6 md:grid-cols-3">
      {perks.map((perk) => (
        <article
          key={perk.title}
          className="rounded-[2.8rem] border border-babyPink/40 bg-white/90 p-6 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-dreamy"
        >
          <h3 className="text-xl font-heading text-blueberry">{perk.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-midnight/75">{perk.description}</p>
        </article>
      ))}
    </div>
  </section>
);

export default MembershipHighlights;
