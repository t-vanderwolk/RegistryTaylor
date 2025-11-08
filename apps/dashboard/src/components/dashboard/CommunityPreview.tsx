'use client';

import Link from "next/link";
import { motion } from "framer-motion";

type CommunityPost = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  createdAt: string;
};

type CommunityPreviewProps = {
  posts: CommunityPost[];
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "TM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatRelative(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const diff = Date.now() - parsed.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))}m ago`;
  }
  if (diff < day) {
    return `${Math.max(1, Math.floor(diff / hour))}h ago`;
  }
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function CommunityPreview({ posts }: CommunityPreviewProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-[2.5rem] border border-[#EAD6DE] bg-white/95 p-8 shadow-[0_28px_65px_rgba(200,161,180,0.18)]"
    >
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/55">Community Salons</p>
        <h2 className="text-2xl font-[var(--font-playfair)] text-[#3E2F35]">
          Reflections from the Taylor Circle
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-[#EAD6DE] bg-[#FFFAF8] px-5 py-6 text-sm text-[#3E2F35]/70">
            New threads publish daily. Visit Connect to browse mentor insights and member rituals.
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href="/dashboard/community"
              className="group flex items-start gap-4 rounded-[1.9rem] border border-[#EAD6DE] bg-white/90 px-5 py-6 shadow-[0_16px_40px_rgba(200,161,180,0.16)] transition hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#FFFAF8] hover:via-[#F6E7ED] hover:to-[#EAC9D1]/45"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#EAC9D1] to-[#C8A1B4] text-sm font-semibold text-white shadow-[0_10px_20px_rgba(200,161,180,0.3)]">
                {initials(post.authorName)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D9C48E]">
                  <span>{post.authorName}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatRelative(post.createdAt)}</span>
                </div>
                <h3 className="mt-2 font-[var(--font-playfair)] text-lg text-[#3E2F35] group-hover:text-[#3E2F35]/90">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/70">{post.excerpt}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      <Link
        href="/dashboard/community"
        className="mt-6 inline-flex items-center justify-center rounded-full border border-[#D9C48E] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-[#3E2F35] shadow-[0_18px_40px_rgba(200,161,180,0.18)] transition hover:-translate-y-0.5 hover:bg-white"
      >
        Open Connect Hub
      </Link>
    </motion.section>
  );
}
