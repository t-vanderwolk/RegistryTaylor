import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import MarketingLayout from "../layouts/MarketingLayout";
import EmptyState from "../components/ui/EmptyState";
import { H1, H2, P } from "../design-system/Typography";

import api from "../lib/api";

import blogImageOne from "../assets/happy-baby.jpeg";
import blogImageTwo from "../assets/mom-support.jpeg";
import blogImageThree from "../assets/video-chat.jpeg";
import blogImageFour from "../assets/baby-blanket.jpeg";
import strollerPreviewImage from "../assets/baby-bump.jpeg";
import strollerDetailImage from "../assets/belly-rub.jpeg";
import carSeatHighlightImage from "../assets/baby-feet.jpeg";

const FILTERS = ["All", "Trimester 1", "Trimester 2", "Trimester 3", "Wellness", "Gear"];
const FILTER_MAP = {
  "Trimester 1": ["trimester 1", "first trimester"],
  "Trimester 2": ["trimester 2", "second trimester"],
  "Trimester 3": ["trimester 3", "third trimester"],
  Wellness: ["wellness", "care", "mind", "body"],
  Gear: ["gear", "registry", "product"],
};

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

const postVisuals = {
  "stroller-styles-demystified": {
    featuredImage: strollerPreviewImage,
    detailImage: strollerDetailImage,
  },
  "car-seats-simplified": {
    featuredImage: carSeatHighlightImage,
    detailImage: carSeatHighlightImage,
  },
};

const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const computeReadLength = (post) => {
  const words = (post?.content || post?.excerpt || "").split(/\s+/).filter(Boolean).length;
  return post?.readLength || `${Math.max(1, Math.round(words / 200))} min read`;
};

const getPreviewText = (post) => {
  const text = (post.excerpt || post.content || "").replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 160)}…` : text;
};

const getCardImage = (post, index) => {
  const v = postVisuals[post?.slug];
  return v?.detailImage || blogGallery[index % blogGallery.length];
};

const matchesFilter = (post, filter) => {
  if (filter === "All") return true;
  const content = [post.category, post.title, ...(post.tags || []), post.excerpt]
    .join(" ")
    .toLowerCase();
  const keys = FILTER_MAP[filter] || [];
  return keys.some((k) => content.includes(k));
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await api.get("/api/v1/blog");
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        if (active) setPosts(data);
      } catch {
        if (active) setError("Could not load stories right now. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () => posts.filter((p) => matchesFilter(p, selected)),
    [posts, selected]
  );

  return (
    <MarketingLayout>
      {/* ───────────── Hero ───────────── */}
      <section className="relative mx-auto mt-8 max-w-6xl rounded-[3.5rem] bg-gradient-to-br from-softBeige via-white to-white px-8 py-20 text-center shadow-soft motion-safe:animate-fade-in-up sm:px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-softBeige/60 backdrop-blur-[2px]" />
        <div className="relative z-10 space-y-5">
          <H1 className="text-warmGray">Blog</H1>
          <P className="text-sm uppercase tracking-[0.32em] text-warmGray/70">
            Concierge Notes & Insights
          </P>
          <P className="mx-auto max-w-2xl">
            Thoughtfully curated articles on baby planning, registry strategy, and design
            inspiration—written to calm, guide, and inspire.
          </P>
        </div>
      </section>

      {/* ───────────── Filters ───────────── */}
      <div className="mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-3 px-6">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelected(filter)}
            className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
              selected === filter
                ? "border-warmGray bg-warmGray text-white shadow-sm"
                : "border-warmGray/30 bg-white/80 text-warmGray hover:bg-softBeige/50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ───────────── Posts Grid ───────────── */}
      <div className="mx-auto mt-12 max-w-6xl px-6 pb-24 sm:px-10">
        {error && <EmptyState title="We had trouble" description={error} className="bg-softBeige" />}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/70 shadow-soft" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No stories yet"
            description="Taylor is working on new pieces—check back soon for fresh insights."
            className="bg-softBeige"
          />
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((post, i) => (
              <article
                key={post.id || i}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-warmGray/10 bg-white/90 shadow-soft backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <figure className="relative h-52 w-full overflow-hidden rounded-t-[2rem]">
                  <img
                    src={getCardImage(post, i)}
                    alt={post.title || "Taylor-Made story"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-warmGray shadow-sm">
                    {computeReadLength(post)}
                  </span>
                </figure>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="space-y-3">
                    <P className="text-xs uppercase tracking-[0.3em] text-warmGray/70">
                      {post.category || "Concierge Notes"}
                    </P>
                    <H2 className="text-xl sm:text-2xl">{post.title}</H2>
                    <P>{getPreviewText(post)}</P>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="flex-1 rounded-full bg-warmGray px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:scale-105"
                    >
                      Read Story
                    </Link>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-warmGray/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-warmGray transition hover:bg-softBeige/50"
                      type="button"
                    >
                      <BookmarkIcon className="h-4 w-4" />
                      Save
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ───────────── CTA Footer ───────────── */}
      <section className="mx-auto mb-24 mt-20 max-w-5xl rounded-[3.5rem] bg-gradient-to-br from-softBeige via-white to-white p-12 text-center shadow-soft motion-safe:animate-fade-in-up sm:p-16">
        <H2 className="text-3xl sm:text-4xl">Still curating your perfect plan?</H2>
        <P className="mx-auto mb-8 max-w-2xl">
          Explore concierge-level planning with Taylor-Made Baby Co.—where every list, nursery, and
          registry is crafted with calm, confidence, and care.
        </P>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/request-invite"
            className="rounded-full bg-warmGray px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
          >
            Request Invite
          </Link>
          <Link
            to="/membership"
            className="rounded-full border border-warmGray bg-white px-8 py-3 text-sm font-semibold text-warmGray shadow-sm transition hover:bg-softBeige/60"
          >
            Explore Membership
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}