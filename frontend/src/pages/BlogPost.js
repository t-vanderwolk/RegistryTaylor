import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EmptyState from "../components/ui/EmptyState";
import api from "../lib/api";
import PageWrapper from "../components/Layout/PageWrapper";
import PageHeader from "../components/Layout/PageHeader";
import CardSection from "../components/Layout/CardSection";
import blogImageOne from "../assets/happy-baby.jpeg";
import blogImageTwo from "../assets/mom-support.jpeg";
import blogImageThree from "../assets/video-chat.jpeg";
import blogImageFour from "../assets/baby-blanket.jpeg";

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

const markdownComponents = {
  h1: ({ node, ...props }) => (
    <h1 className="mt-10 text-3xl font-serif text-blueberry sm:text-4xl" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mt-10 text-2xl font-serif text-blueberry sm:text-3xl" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mt-8 text-xl font-serif text-blueberry sm:text-2xl" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className="mt-6 text-lg font-serif text-blueberry" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base" {...props} />
  ),
  ul: ({ node, ordered, ...props }) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 sm:text-base"
      {...props}
    />
  ),
  ol: ({ node, ordered, ...props }) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-neutral-600 sm:text-base"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-blueberry" {...props} />,
  table: ({ node, ...props }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-primary/20 overflow-hidden rounded-2xl border border-primary/20 text-left text-sm text-neutral-600">
        {props.children}
      </table>
    </div>
  ),
  thead: ({ node, ...props }) => (
    <thead className="bg-softPink/40 text-xs font-heading uppercase tracking-[0.2em] text-primary/80" {...props} />
  ),
  tbody: ({ node, ...props }) => <tbody className="divide-y divide-primary/10" {...props} />,
  th: ({ node, ...props }) => <th className="px-4 py-3" {...props} />,
  td: ({ node, ...props }) => <td className="px-4 py-3" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-primary underline decoration-dotted underline-offset-4" {...props} />
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
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

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
        const message = err.response?.data?.error?.message || "We couldn’t find that article.";
        setError(message);
        setStatus(err.response?.status === 404 ? "not-found" : "error");
      }
    };

    loadPost();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    if (!post) return undefined;

    const loadRelated = async () => {
      try {
        const response = await api.get("/api/v1/blog");
        if (!active) return;
        const allPosts = Array.isArray(response.data?.data) ? response.data.data : [];
        const curated = allPosts.filter((item) => item.slug !== slug).slice(0, 3);
        setRelatedPosts(curated);
      } catch (err) {
        if (active) setRelatedPosts([]);
      }
    };

    loadRelated();

    return () => {
      active = false;
    };
  }, [post, slug]);

  const heroImage = useMemo(() => {
    if (!post) return blogGallery[0];
    const index = Math.abs(post.slug?.length || 0) % blogGallery.length;
    return blogGallery[index];
  }, [post]);

  if (status === "loading") {
    return (
      <PageWrapper backgroundClassName="bg-softBeige">
        <CardSection variant="plain" contentClassName="" className="mx-auto max-w-5xl">
          <div className="rounded-[3rem] border border-primary/20 bg-white p-10 shadow-soft">
            <div className="h-8 w-40 animate-pulse rounded-full bg-softPink/60" />
            <div className="mt-4 h-12 w-3/4 animate-pulse rounded-full bg-softPink/50" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="h-4 w-full animate-pulse rounded-full bg-softPink/40" />
              ))}
            </div>
          </div>
        </CardSection>
      </PageWrapper>
    );
  }

  if (status !== "success" || !post) {
    return (
      <PageWrapper backgroundClassName="bg-softBeige">
        <CardSection variant="plain" contentClassName="" className="mx-auto max-w-4xl">
          <EmptyState
            title="Article not available"
            description={error || "Taylor is tidying this page. Please try again soon."}
            icon={SparklesIcon}
            className="bg-softPink"
            actionLabel="Return to blog"
            onAction={() => navigate("/blog")}
            action={null}
          />
        </CardSection>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper backgroundClassName="bg-softBeige">
      <CardSection
        variant="plain"
        contentClassName=""
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[3.5rem] border border-primary/25 bg-white text-left shadow-soft"
      >
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
            className="inline-flex w-full items-center justify-center rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-xs font-heading uppercase tracking-[0.32em] text-primary transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink sm:w-auto sm:self-start"
          >
            Back
          </button>
          <PageHeader
            eyebrow="Taylor-Made Blog"
            title={
              <h1 className="text-3xl font-serif text-blueberry sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
            }
            description={post.excerpt || undefined}
            align="left"
            className="gap-4 text-left"
            eyebrowClassName="bg-white/60 text-primary/80"
            descriptionClassName="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base"
          >
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
          </PageHeader>
        </div>
      </CardSection>

      <CardSection
        variant="plain"
        contentClassName=""
        className="mx-auto max-w-4xl rounded-[3rem] border border-primary/25 bg-white px-6 py-12 shadow-soft sm:px-12"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {post.content || ""}
        </ReactMarkdown>
      </CardSection>

      <CardSection
        variant="plain"
        contentClassName=""
        className="mx-auto max-w-5xl space-y-8 rounded-[3rem] border border-primary/25 bg-white px-6 py-14 shadow-soft sm:px-12"
      >
        <header className="text-center sm:text-left">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Fresh Highlights</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">More Taylor-Made Stories</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:max-w-3xl sm:text-base">
            Keep exploring concierge tips, planning frameworks, and real-life registry wins from the Taylor-Made community.
          </p>
        </header>

        {relatedPosts.length === 0 ? (
          <EmptyState
            title="More features are brewing"
            description="Taylor is curating more posts right now. Check back soon for fresh highlights."
            icon={SparklesIcon}
            className="bg-softPink"
            actionLabel="All posts"
            onAction={() => navigate("/blog")}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item, index) => (
              <article
                key={item.slug || item.id || `related-${index}`}
                className="group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-primary/20 bg-white text-left shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-md"
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
                      <span className="flex items-center gap-1 text-primary">🔒 Members Only</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-blueberry sm:text-3xl">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{item.excerpt}</p>
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
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white transition hover:-translate-y-1 hover:scale-105 hover:shadow-md sm:w-auto"
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
      </CardSection>
    </PageWrapper>
  );
};

export default BlogPost;
