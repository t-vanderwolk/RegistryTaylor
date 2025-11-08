'use client';

import Link from "next/link";
import { motion } from "framer-motion";

import type { Route } from "next";

type NavCard = {
  title: string;
  description: string;
  href: Route;
};

const CARDS: ReadonlyArray<NavCard> = [
  {
    title: "Learn",
    description: "Review your Academy pathway and track each trimester module.",
    href: "/dashboard/learn/welcome",
  },
  {
    title: "Community",
    description: "RSVP for upcoming salons and keep an eye on the community feed.",
    href: "/dashboard/community",
  },
  {
    title: "Support",
    description: "Track concierge requests, polls, and announcements that need follow-up.",
    href: "/dashboard/support",
  },
  {
    title: "Journal",
    description: "Capture rituals, prompts, and moodboards inside your journal.",
    href: "/dashboard/journal",
  },
] as const;

export default function NavigationCards() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-8 shadow-[0_28px_65px_rgba(200,161,180,0.18)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/55">Navigate the journey</p>
          <h2 className="text-2xl font-[var(--font-playfair)] text-[#3E2F35]">
            Learn · Community · Support · Journal
          </h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group flex h-full flex-col justify-between rounded-[2.2rem] border border-[#EAD6DE] bg-[#FFFAF8]/95 p-6 shadow-[0_18px_45px_rgba(200,161,180,0.16)] transition hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#FFFAF8] hover:via-[#FBEFF2] hover:to-[#EAC9D1]/40"
          >
            <div>
              <h3 className="text-xl font-[var(--font-playfair)] text-[#3E2F35]">{card.title}</h3>
              <div className="mt-3 h-px w-12 bg-gradient-to-r from-[#D9C48E] to-transparent" />
              <p className="mt-4 text-sm leading-relaxed text-[#3E2F35]/70">{card.description}</p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A1B4] group-hover:text-[#B98BA5]">
              Enter {card.title}
            </span>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
