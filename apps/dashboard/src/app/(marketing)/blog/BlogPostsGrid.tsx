"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/data/blogPosts";

type BlogPostsGridProps = {
  posts: BlogPostSummary[];
};

const INITIAL_VISIBLE_COUNT = 6;

export default function BlogPostsGrid({ posts }: BlogPostsGridProps) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_VISIBLE_COUNT, posts.length),
  );

  const visiblePosts = posts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((current) => Math.min(current + 3, posts.length));
  };

  return (
    <div className="space-y-10">
      <div className="columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3">
        {visiblePosts.map((post) => (
          <article
            key={post.slug}
            className="group mb-6 break-inside-avoid overflow-hidden rounded-[2.25rem] border border-[#C8A1B4]/30 bg-white shadow-[0_8px_30px_rgba(200,161,180,0.12)] transition-transform duration-200 hover:-translate-y-1 hover:border-[#C8A1B4]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={post.heroImage}
                alt={post.heroAlt}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/50">
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="font-serif text-2xl text-[#3E2F35] group-hover:text-[#C8A1B4] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed text-[#3E2F35]/70 line-clamp-3">{post.excerpt}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3E2F35]/60">
                  {post.author}
                </span>
                <Link
                  href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition-transform duration-200 hover:scale-105 hover:bg-[#EAC9D1]/30"
                >
                  Read More
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visibleCount < posts.length ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition-transform duration-200 hover:scale-105 hover:bg-[#c29aab]"
          >
            LOAD MORE POSTS
          </button>
        </div>
      ) : null}
    </div>
  );
}
