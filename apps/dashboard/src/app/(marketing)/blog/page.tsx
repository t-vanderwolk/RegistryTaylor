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
    <div className="bg-[#FFFAF8]">
      <PageSection className="border-b border-[#D9C48E]/25">
        <div className="mx-auto max-w-screen-xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]">Taylor Journal</p>
          <h1 className="font-serif text-4xl text-[#3E2F35]">Stories to inspire calm beginnings</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#3E2F35]/75">
            Mentor essays, registry spotlights, and rituals we adore—all crafted to keep your Learn · Plan · Connect journey
            feeling grounded and luxurious.
          </p>
        </div>
      </PageSection>

      <PageSection>
        <div className="mx-auto max-w-screen-xl">
          {posts.length === 0 ? (
            <div className="rounded-[2.5rem] border border-[#C8A1B4]/30 bg-white p-10 text-center text-sm text-[#3E2F35]/70 shadow-[0_8px_30px_rgba(200,161,180,0.12)]">
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
