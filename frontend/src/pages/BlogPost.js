import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EmptyState from "../components/ui/EmptyState";
import api from "../lib/api";
import blogImageOne from "../assets/happy-baby.jpeg";
import blogImageTwo from "../assets/mom-support.jpeg";
import blogImageThree from "../assets/video-chat.jpeg";
import blogImageFour from "../assets/baby-blanket.jpeg";

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

// ✅ Accessible markdown component overrides
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mt-10 text-3xl font-serif text-charcoal sm:text-4xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-serif text-charcoal sm:text-3xl">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-serif text-charcoal sm:text-2xl">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 text-lg font-serif text-charcoal">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 sm:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 sm:text-base">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-charcoal">{children}</strong>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-mauve/20 overflow-hidden rounded-2xl border border-mauve/20 text-left text-sm text-neutral-600">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-blush/40 text-xs font-heading uppercase tracking-[0.2em] text-mauve/80">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-mauve/10">{children}</tbody>
  ),
  th: ({ children }) => <th className="px-4 py-3">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3">{children}</td>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-mauve underline decoration-dotted underline-offset-4"
    >
      {children}
    </a>
  ),
};

const computeReadLength = (post) => {
  if (post?.readLength) return post.readLength;
  if (post?.readMinutes) return `${post.readMinutes} min read`;
  const source = post?.content || post?.excerpt || "";
  const words = source.split(/\s+/).filter(Boolean).length;
  if (!words) return "Taylor-Made insight";
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // ✅ Fetch current post
  useEffect(() => {
    let active = true;
    const loadPost = async () => {
      setStatus("loading");
      setError(null);
      try {
        const response = await api.get(`/api/v1/blog/${slug}`);
        if (!active) return;
        setPost(response.data?.data || null);
        setStatus("success");
      } catch (err) {
        if (!active) return;
        const message =
          err.response?.data?.error?.message || "We couldn’t find that article.";
        setError(message);
        setStatus(err.response?.status === 404 ? "not-found" : "error");
      }
    };
    loadPost();
    return () => {
      active = false;
    };
  }, [slug]);

  // ✅ Fetch related posts
  useEffect(() => {
    let active = true;
    if (!post) return undefined;
    const loadRelated = async () => {
      try {
        const response = await api.get("/api/v1/blog");
        if (!active) return;
        const allPosts = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const curated = allPosts.filter((item) => item.slug !== slug).slice(0, 3);
        setRelatedPosts(curated);
      } catch {
        if (active) setRelatedPosts([]);
      }
    };
    loadRelated();
    return () => {
      active = false;
    };
  }, [post, slug]);

  // ✅ Choose hero image
  const heroImage = useMemo(() => {
    if (!post) return blogGallery[0];
    const index = Math.abs(post.slug?.length || 0) % blogGallery.length;
    return blogGallery[index];
  }, [post]);

  // Loading view
  if (status === "loading") {
    return (
      <main className="bg-ivory py-24">
        <div className="mx-auto max-w-5xl rounded-[3rem] border border-mauve/20 bg-white p-10 shadow-soft">
          <div className="h-8 w-40 animate-pulse rounded-full bg-blush/60" />
          <div className="mt-4 h-12 w-3/4 animate-pulse rounded-full bg-blush/50" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-4 w-full animate-pulse rounded-full bg-blush/40"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error / Not found
  if (status !== "success" || !post) {
    return (
      <main className="bg-ivory py-24">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Article not available"
            description={error || "Taylor is tidying this page. Please try again soon."}
            icon={SparklesIcon}
            className="bg-blush"
            actionLabel="Return to blog"
            onAction={() => navigate("/blog")}
          />
        </div>
      </main>
    );
  }

  // ✅ Main render
  return (
    <div className="space-y-16 pb-24 pt-16">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[3.5rem] border border-mauve/25 bg-white text-left shadow-soft">
        <img
          src={heroImage}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/80" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 px-6 py-12 sm:px-12 sm:py-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center justify-center rounded-full border border-mauve/20 bg-white/70 px-4 py-2 text-xs font-heading uppercase tracking-[0.32em] text-mauve transition hover:-translate-y-1 hover:scale-105 hover:bg-blush sm:w-auto sm:self-start"
          >
            Back
          </button>
          <div className="text-xs font-serif uppercase tracking-[0.32em] text-mauve/80">
            Taylor-Made Blog
          </div>
          <h1 className="text-3xl font-serif text-charcoal sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-neutral-400">
            <span>{post.category || "Guides"}</span>
            <span aria-hidden="true">•</span>
            <span>By Taylor-Made Baby Co.</span>
            {post.publishedAt && (
              <>
                <span aria-hidden="true">•</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
            <span aria-hidden="true">•</span>
            <span>{computeReadLength(post)}</span>
          </div>
        </div>
      </section>

      {/* Post Body */}
      <section className="mx-auto max-w-4xl rounded-[3rem] border border-mauve/25 bg-white px-6 py-12 shadow-soft sm:px-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {post.content || ""}
        </ReactMarkdown>
      </section>

      {/* Related Posts */}
      <section className="mx-auto max-w-5xl space-y-8 rounded-[3rem] border border-mauve/25 bg-white px-6 py-14 shadow-soft sm:px-12">
        <header className="text-center sm:text-left">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-mauve/80">
            Fresh Highlights
          </p>
          <h2 className="mt-3 text-3xl font-serif text-charcoal sm:text-4xl">
            More Taylor-Made Stories
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:max-w-3xl sm:text-base">
            Keep exploring concierge tips, planning frameworks, and real-life registry wins from
            the Taylor-Made community.
          </p>
        </header>

        {relatedPosts.length === 0 ? (
          <EmptyState
            title="More features are brewing"
            description="Taylor is curating more posts right now. Check back soon for fresh highlights."
            icon={SparklesIcon}
            className="bg-blush"
            actionLabel="All posts"
            onAction={() => navigate("/blog")}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item, index) => (
              <article
                key={item.slug || item.id || `related-${index}`}
                className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-mauve/20 bg-white text-left shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-md"
              >
                <figure className="relative h-48 w-full overflow-hidden">
                  <img
                    src={blogGallery[index % blogGallery.length]}
                    alt={item.title || "Taylor-Made blog story"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </figure>
                <div className="flex flex-1 flex-col gap-4 px-8 pb-6 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-neutral-500">
                    <span>{item.category || "Blog"}</span>
                    {item.visibility === "members_only" && (
                      <span className="flex items-center gap-1 text-mauve">
                        🔒 Members Only
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-charcoal sm:text-3xl">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-neutral-400">
                    <span>By Taylor-Made Baby Co.</span>
                    {item.publishedAt && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 px-8 pb-8">
                  <Link
                    to={`/blog/${item.slug || item.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white transition hover:-translate-y-1 hover:scale-105 hover:shadow-md sm:w-auto"
                  >
                    Read Article
                  </Link>
                  <span className="text-xs font-heading uppercase tracking-[0.28em] text-neutral-400">
                    {computeReadLength(item)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPost;