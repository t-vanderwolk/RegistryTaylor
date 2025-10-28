import type { Metadata } from "next";
import Image from "next/image";
import { apiFetch } from "@/lib/apiClient";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  createdAt: string | null;
  imageUrl: string | null;
};

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await apiFetch<BlogPost[]>("/api/blog", {
      cache: "no-store",
    });

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Taylor Journal",
  description:
    "Stories, mentor notes, and concierge inspiration from the Taylor-Made Baby Co. community.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Taylor Journal</p>
        <h1 className="font-[var(--font-playfair)] text-4xl text-[#3E2F35]">Stories to inspire calm beginnings</h1>
        <p className="mx-auto max-w-3xl text-sm text-[#3E2F35]/70">
          Mentor essays, registry spotlights, and rituals we adore—all crafted to keep your Learn · Plan · Connect journey
          feeling grounded and luxurious.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-[2.75rem] border border-[#C8A1B4]/35 bg-white/90 p-10 text-center text-sm text-[#3E2F35]/70 shadow-[0_26px_60px_rgba(200,161,180,0.2)]">
          <p>New posts are on the way. Join our membership to receive the Taylor Journal first.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {posts.map((post) => {
            const published = formatDate(post.createdAt);
            return (
              <article
                key={post.id}
                className="flex h-full flex-col rounded-[2.75rem] border border-[#C8A1B4]/30 bg-white/90 p-8 text-sm text-[#3E2F35]/70 shadow-[0_24px_55px_rgba(200,161,180,0.18)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_32px_65px_rgba(200,161,180,0.24)]"
              >
                <div className="space-y-3">
                  {post.imageUrl ? (
                    <div className="overflow-hidden rounded-[2rem] border border-[#E8C9D1]/60">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={800}
                        height={320}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35]">{post.title}</h2>
                  {published ? (
                    <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/50">{published}</p>
                  ) : null}
                  {post.excerpt ? <p className="leading-relaxed">{post.excerpt}</p> : null}
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-[#3E2F35]/60">
                  <span>{post.author ?? "Taylor Concierge Team"}</span>
                  <span>Concierge Notes</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
