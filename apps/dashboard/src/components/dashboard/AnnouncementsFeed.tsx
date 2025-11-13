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
    <section className="space-y-3 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-charcoal-300">
            Announcements
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-charcoal-700">
            Concierge highlights
          </h2>
        </div>
        <Link
          href={"/dashboard/member/community" as Route}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-mauve-500"
        >
          View all →
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
        {announcements.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
            className="min-w-[280px] max-w-[320px] snap-center rounded-[1.5rem] border border-blush-300/60 bg-ivory/95 p-4 shadow-mauve-card md:min-w-0 md:max-w-none"
          >
            <div className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-charcoal-300">
              <span className="truncate">{item.badge}</span>
              {item.dateLabel ? <span className="ml-2 shrink-0">{item.dateLabel}</span> : null}
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-charcoal-700 line-clamp-2">{item.title}</h3>
            <p className="mt-1 text-sm leading-snug text-charcoal-500 line-clamp-2">{item.description}</p>
            <Link
              href={item.href}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.3em] text-mauve-500"
            >
              {item.ctaLabel ?? "View more"} →
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
