import type { Metadata } from "next";
import { getBlogPostSummaries } from "@/data/blogPosts";
import PageSection from "@/components/PageSection";
import BlogPostsGrid from "./BlogPostsGrid";

export const metadata: Metadata = {
  title: "Taylor Journal",
  description:
    "Stories, mentor notes, and concierge inspiration from the Taylor-Made Baby Co. community.",
};

export default function BlogPage() {
  const posts = getBlogPostSummaries();

  return (
    <div className="bg-tm-ivory">
      <PageSection className="border-b border-tm-gold/40">
        <div className="mx-auto max-w-screen-xl space-y-6 text-center">
          <h1 className="space-y-2">
            <span className="block font-script text-tm-mauve text-6xl tracking-tight md:text-7xl">
              Taylor Journal
            </span>
            <span className="block font-[var(--font-playfair-sc)] text-3xl font-semibold uppercase tracking-[0.35em] text-tm-charcoal md:text-4xl">
              Stories To Inspire Calm Beginnings
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-tm-charcoal/80 md:text-lg">
            Mentor essays, registry spotlights, and rituals we adore—all crafted to keep your Learn · Plan · Connect journey
            feeling grounded, luxurious, and beautifully human.
          </p>
        </div>
      </PageSection>

      <PageSection className="border-b border-tm-gold/30">
        <div className="mx-auto max-w-screen-xl">
          {posts.length === 0 ? (
            <div className="rounded-[2.5rem] border border-tm-gold/40 bg-white/95 p-10 text-center text-sm text-tm-charcoal/70 shadow-soft">
              <p>New posts are on the way. Join our membership to receive the Taylor Journal first.</p>
            </div>
          ) : (
            <BlogPostsGrid posts={posts} />
          )}
        </div>
      </PageSection>
    </div>
  );
}
