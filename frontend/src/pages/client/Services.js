import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowDownIcon,
  BookmarkSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { BookingForm } from "../../features/clients";
import { useSafeFetch } from "../../hooks/useSafeFetch";

const servicePackages = [
  {
    id: "essentials",
    name: "Essentials Concierge",
    status: "Active",
    description:
      "Registry stewardship, vendor vetting, and twice-monthly mentor check-ins keep every necessity on track.",
    highlights: [
      "Multi-retailer registry management with white-glove returns",
      "Quarterly budget snapshots and curated shopping lists",
      "Mentor office hours for gear, feeding, and travel support",
    ],
  },
  {
    id: "signature",
    name: "Signature Styling",
    status: "Booking",
    description:
      "Full-space nursery direction plus celebration styling. We layer mood boards, timelines, and installs for you.",
    highlights: [
      "Room-by-room layouts, palettes, and sourcing",
      "Event production for showers, sip & sees, and reveals",
      "Dedicated concierge coordination with your vendor roster",
    ],
  },
  {
    id: "bespoke",
    name: "Bespoke On Retainer",
    status: "Waitlist",
    description:
      "High-touch concierge coverage for families who prefer an on-call partner for every milestone and getaway.",
    highlights: [
      "On-demand scheduling across mentors, doulas, and stylists",
      "Seasonal wardrobe pulls and gifting delivered to your door",
      "Optional in-person concierge days around travel or installs",
    ],
  },
];

const onDemandExperiences = [
  {
    id: "gear-lab",
    title: "Gear Lab Session",
    badge: "Included with Signature",
    copy: "Hands-on testing or virtual demos for strollers, travel systems, and nursery tech so you buy once with confidence.",
  },
  {
    id: "registry-refresh",
    title: "Registry Refresh",
    badge: "Member Favorite",
    copy: "Seasonal sweep of every registry list with swaps, thank-you tracking, and shipping confirmations.",
  },
  {
    id: "arrival-prep",
    title: "Arrival Prep Intensive",
    badge: "Add-On",
    copy: "Hospital bag packing list, freezer meal plan, childcare roster, and home reset finished inside one concierge sprint.",
  },
];

const careTeamSupport = [
  {
    id: "mentor",
    icon: SparklesIcon,
    title: "Mentor Circle",
    detail: "Reply in Messages with your preferred cadence or request a new mentor match.",
  },
  {
    id: "calendar",
    icon: CalendarDaysIcon,
    title: "Concierge Calendar",
    detail: "Need a touchpoint this week? Book a slot and the team will confirm within the hour.",
  },
  {
    id: "chat",
    icon: ChatBubbleLeftRightIcon,
    title: "White-Glove Requests",
    detail: "Use the form below for travel, gifting, or install days that need extra discretion.",
  },
];

const featuredGuides = [
  {
    id: "nursery-lookbook",
    title: "Nursery Palette Lookbook",
    type: "PDF",
    updated: "Jul 14, 2024",
    summary: "Curated color stories, textiles, and blush inspo pulled from recent installs and client mood boards.",
  },
  {
    id: "registry-checklist",
    title: "Concierge Registry Checklist",
    type: "Sheet",
    updated: "Aug 02, 2024",
    summary: "Live tracker covering stroller, feeding, travel, and fourth-trimester essentials with Taylor's notes.",
  },
  {
    id: "hospital-bag",
    title: "Hospital Bag Guide",
    type: "Notion",
    updated: "Sep 10, 2024",
    summary: "Wardrobe, toiletry, and tech packing lists plus concierge tips for partners and visitors.",
  },
];

const quickReferences = [
  {
    id: "milestone",
    title: "Milestone Snapshot",
    blurb: "Printable timeline covering registry, nursery, and celebration checkpoints by trimester.",
  },
  {
    id: "support",
    title: "Support Rolodex",
    blurb: "Concierge-approved list of doulas, lactation, and night nannies by metro area with direct contact links.",
  },
  {
    id: "gifting",
    title: "Gifting Tracker",
    blurb: "Google Sheet template for thank-you notes and gifting budgets. Taylor will pre-fill upon request.",
  },
];

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-700",
  Booking: "bg-mauve/40 text-charcoal",
  Waitlist: "bg-amber-100 text-amber-700",
};

const Services = () => {
  const { data } = useSafeFetch("/api/me", {}, { fallback: {} });
  const mentorId = data?.mentor?.id || "mentor-demo";
  const mentorName = data?.mentor?.name || data?.mentor?.preferred || "Taylor";

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-mauve/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <header className="space-y-4">
          <p className="inline-flex items-center rounded-full border border-mauve/30 bg-mauve/20 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-charcoal">
            Concierge Services
          </p>
          <h1 className="font-heading text-3xl text-charcoal">Curate the care that fits your season.</h1>
          <p className="max-w-3xl text-sm font-body leading-relaxed text-charcoal/70">
            Explore concierge packages, on-demand experiences, and ways to reach Taylor when you need her most. Every request is handled discreetly and synced with your mentor team.
          </p>
        </header>
      </section>

      <section className="rounded-[2.5rem] border border-gold/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-charcoal">Request time with {mentorName}</h2>
          <p className="text-sm text-charcoal/70">
            Choose your preferred window and Taylor will confirm within one business day.
          </p>
        </div>
        <div className="mt-6">
          <BookingForm mentorId={mentorId} />
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-blush/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-charcoal">Signature Packages</h2>
            <p className="text-sm font-body text-charcoal/70">
              Choose your current concierge tier or explore an upgrade. Status badges show current availability.
            </p>
          </div>
          <Link
            to="../messages"
            className="inline-flex items-center justify-center rounded-full border border-blush/40 bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.35em] text-charcoal shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
          >
            Ask Taylor about tiers
          </Link>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {servicePackages.map((service) => (
            <article
              key={service.id}
              className="flex h-full flex-col gap-4 rounded-[2rem] border border-mauve/25 bg-white/95 p-6 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl text-charcoal">{service.name}</h3>
                  <p className="mt-2 text-sm font-body text-charcoal/70">{service.description}</p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.35em] ${
                    statusStyles[service.status] || "bg-mauve/30 text-charcoal"
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <ul className="space-y-2 text-sm font-body text-charcoal/70">
                {service.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blush" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-auto inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal transition hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60"
              >
                Request consultation
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-mauve/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-charcoal">On-Demand Experiences</h2>
          <p className="text-sm font-body text-charcoal/70">
            Layer these concierge sprints onto any membership. Taylor confirms timing and deliverables within 24 hours.
          </p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {onDemandExperiences.map((experience) => (
            <article
              key={experience.id}
              className="flex h-full flex-col justify-between rounded-[2rem] border border-mauve/25 bg-mauve/10 p-6 shadow-soft"
            >
              <header className="space-y-2">
                <p className="inline-flex items-center rounded-full border border-blush/40 bg-white/70 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-charcoal/80">
                  {experience.badge}
                </p>
                <h3 className="font-heading text-lg text-charcoal">{experience.title}</h3>
              </header>
              <p className="mt-3 flex-1 text-sm font-body leading-relaxed text-charcoal/75">{experience.copy}</p>
              <Link
                to="../messages"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal transition hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60"
              >
                Hold my spot
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-mauve/30 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-charcoal">Featured Guides</h2>
            <p className="text-sm font-body text-charcoal/70">
              Member-favorite downloads curated by Taylor. Save, share, or ask for a bespoke version.
            </p>
          </div>
          <Link
            to="../messages"
            className="inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60"
          >
            Request updates
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredGuides.map((guide) => (
            <article
              key={guide.id}
              className="flex h-full flex-col gap-4 rounded-[2rem] border border-mauve/25 bg-white/95 p-6 shadow-soft"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl text-charcoal">{guide.title}</h3>
                  <p className="mt-2 text-sm font-body text-charcoal/70">{guide.summary}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-mauve/20 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.35em] text-charcoal/80">
                  {guide.type}
                </span>
              </header>
              <div className="mt-auto flex items-center justify-between text-xs font-heading uppercase tracking-[0.3em] text-charcoal/40">
                <span>Updated {guide.updated}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-mauve/30 bg-white px-4 py-2 text-charcoal hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                  Download
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-mauve/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-3">
          <h2 className="font-heading text-2xl text-charcoal">Quick Reference Templates</h2>
          <p className="text-sm font-body text-charcoal/70">
            Concierge staples you can duplicate and customize. Taylor will pre-fill details—just drop a note in Messages.
          </p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {quickReferences.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-mauve/40 bg-white px-5 py-6 text-left shadow-soft"
            >
              <span className="inline-flex items-center justify-center rounded-2xl border border-mauve/40 bg-mauve/30 p-3 text-charcoal">
                <BookmarkSquareIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-lg text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm font-body leading-relaxed text-charcoal/70">{item.blurb}</p>
              <Link
                to="../messages"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-mauve/30 bg-white px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.3em] text-charcoal hover:-translate-y-0.5 hover:bg-blush/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60"
              >
                Personalize for me
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-mauve/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
        <div className="space-y-4">
          <h2 className="font-heading text-2xl text-charcoal">Need concierge support now?</h2>
          <p className="text-sm font-body text-charcoal/70">
            Choose the lane that matches your request. We route everything to your mentor circle and follow up fast.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {careTeamSupport.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="rounded-[2rem] border border-mauve/40 bg-white px-5 py-6 text-left shadow-soft"
                >
                  <span className="inline-flex items-center justify-center rounded-2xl border border-mauve/40 bg-mauve/30 p-3 text-charcoal">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm font-body leading-relaxed text-charcoal/70">{item.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
        <form className="mt-8 space-y-4 rounded-[2rem] border border-mauve/40 bg-mauve/15 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/70">
              Request type
              <input
                type="text"
                placeholder="Nursery install, travel planning, gifting"
                className="mt-2 w-full rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal focus:border-blush focus:outline-none focus:ring-2 focus:ring-mauve/30"
                name="request-type"
              />
            </label>
            <label className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/70">
              Preferred timing
              <input
                type="text"
                placeholder="This week, next month, exact date"
                className="mt-2 w-full rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal focus:border-blush focus:outline-none focus:ring-2 focus:ring-mauve/30"
                name="preferred-timing"
              />
            </label>
          </div>
          <label className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/70">
            Details for Taylor
            <textarea
              rows={4}
              placeholder="Share anything that helps us prepare — guests, vendors, budget, or travel details."
              className="mt-2 w-full rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal focus:border-blush focus:outline-none focus:ring-2 focus:ring-mauve/30"
              name="details"
            />
          </label>
          <div className="flex flex-col items-center gap-3 text-xs text-charcoal/60 sm:flex-row sm:justify-between">
            <span>Replies arrive inside Messages within 24 hours.</span>
            <button
              type="button"
              className="rounded-full bg-blush px-6 py-3 font-heading uppercase tracking-[0.35em] text-charcoal shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              Send concierge request
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Services;
