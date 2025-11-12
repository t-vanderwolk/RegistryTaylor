"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";

export type AnnouncementCard = {
  id: string;
  title: string;
  description: string;
  badge: string;
  dateLabel?: string | null;
  href: Route;
  ctaLabel?: string;
};

type AnnouncementsFeedProps = {
  announcements: AnnouncementCard[];
};

export default function AnnouncementsFeed({ announcements }: AnnouncementsFeedProps) {
  if (!announcements.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">
            Announcements & Perks
          </p>
          <h2 className="mt-2 font-serif text-2xl text-charcoal-700 md:text-[2.1rem]">
            Concierge updates curated for you
          </h2>
        </div>
        <Link
          href={"/dashboard/member/community" as Route}
          className="academy-outline-button gap-2 rounded-full"
        >
          View all
        </Link>
      </div>

      <div className="flex snap-x gap-4 overflow-x-auto pb-4">
        {announcements.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
            className="snap-start rounded-2xl border border-blush-300/60 bg-ivory/95 p-6 shadow-mauve-card min-w-[280px] md:min-w-[320px]"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-charcoal-300">
              <span>{item.badge}</span>
              {item.dateLabel ? <span>{item.dateLabel}</span> : null}
            </div>
            <h3 className="mt-4 font-serif text-xl text-charcoal-700">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-400">{item.description}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-mauve-500/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-blush-soft transition hover:-translate-y-0.5"
            >
              {item.ctaLabel ?? "View more"}
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
