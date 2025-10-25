// Create a new React component called CarSeatConfidence for the Taylor-Made Baby Co. blog.
// Follow the same design structure, styling, and tone as Blog.js and stroller-styles-demystified.js.
// The page title should be “Car Seat Confidence: Understanding Infant, Convertible & Booster Seats.”
//
// ✅ Visual Style:
// - Soft, pastel boutique aesthetic (softPink, softMint, lavender, babyBlue, gold).
// - Use elegant serif headings and clean sans-serif body text.
// - Rounded sections (rounded-[3.5rem]), drop-shadow (shadow-soft), gentle gradients.
//
// ✅ Layout & Content Structure:
// 1. **Hero Section**
//    - Full-width pastel gradient background with a soft overlay image: “carseat-baby.jpeg” from assets.
//    - Title: “Car Seat Confidence” in script font with subtitle “Understanding Infant, Convertible & Booster Seats.”
//    - Brief one-sentence intro under the title.
//
// 2. **Section: Infant Car Seats**
//    - Explain key features (rear-facing, travel system compatible, lightweight).
//    - Include a “Taylor Tip” blockquote in italics about using car seat adapters with strollers.
//
// 3. **Section: Convertible Car Seats**
//    - Describe standard, rotating, and travel-convertible subtypes.
//    - Include a small bullet list comparing lifespan and ease of installation.
//
// 4. **Section: Booster Car Seats**
//    - Explain when to transition from convertible to booster.
//    - Subsection: “Backless Booster” with short description.
//
// 5. **Comparison Table**
//    - A soft rounded table comparing Infant vs Convertible vs Booster across criteria: Age Range, Orientation, Portability, Longevity, Travel Compatibility.
//
// 6. **CTA Section**
//    - “Still unsure which is right for your family?”
//    - Add two buttons: “Book a Consultation” (links to /contact) and “Explore Membership” (links to /membership).
//
// ✅ Accessibility & UX:
// - Make responsive with Tailwind classes.
// - Ensure color contrast and readable line spacing.
// - Add `alt` text to all images.
//
// ✅ Output:
// - Fully self-contained functional React component ready to import into the routes.
// - Use your existing Tailwind color tokens (e.g., bg-blush, text-charcoal, etc.).
// - Match animation style (motion-safe:animate-fade-in-up).

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import EmptyState from "../components/ui/EmptyState";
import api from "../lib/api";
import { P } from "../design-system/Typography";
// import MarketingLayout from "../components/Layout/MarketingLayout";
import blogImageOne from "../assets/happy-baby.jpeg";
import blogImageTwo from "../assets/mom-support.jpeg";
import blogImageThree from "../assets/video-chat.jpeg";
import blogImageFour from "../assets/baby-blanket.jpeg";
import strollerPreviewImage from "../assets/baby-bump.jpeg";
import strollerDetailImage from "../assets/belly-rub.jpeg";
import carSeatHighlightImage from "../assets/baby-feet.jpeg";

const FILTERS = ["All", "Trimester 1", "Trimester 2", "Trimester 3", "Wellness", "Gear"];
const FILTER_MAP = {
  "Trimester 1": ["trimester 1", "first trimester", "trimester-1"],
  "Trimester 2": ["trimester 2", "second trimester", "trimester-2"],
  "Trimester 3": ["trimester 3", "third trimester", "trimester-3"],
  Wellness: ["wellness", "care", "mind", "body"],
  Gear: ["gear", "registry", "product"],
};

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

const postVisuals = {
  "stroller-styles-demystified": {
    featuredImage: strollerPreviewImage,
    detailImage: strollerDetailImage,
    alt: "Taylor leading a stroller styling consultation",
  },
  "car-seats-simplified": {
    featuredImage: carSeatHighlightImage,
    detailImage: carSeatHighlightImage,
    alt: "Taylor comparing car seats in a pastel nursery",
  },
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const computeReadLength = (post) => {
  if (post?.readLength) return post.readLength;
  if (post?.readMinutes) return `${post.readMinutes} min read`;
  const source = post?.content || post?.excerpt || "";
  const words = source.split(/\s+/).filter(Boolean).length;
  if (!words) return "Taylor-Made insight";
  return `${Math.max(1, Math.round(words / 200))} min read`;
};

const getPreviewText = (post) => {
  if (!post) return "";
  if (post.excerpt && post.excerpt.trim()) return post.excerpt.trim();
  if (post.content && post.content.trim()) {
    const text = post.content.replace(/\s+/g, " ").trim();
    return text.length > 180 ? `${text.slice(0, 180)}…` : text;
  }
  return "Concierge insight penned by Taylor-Made.";
};

const getCardImage = (post, index) => {
  const visual = postVisuals[post?.slug];
  if (visual?.detailImage) return visual.detailImage;
  return blogGallery[index % blogGallery.length];
};

const matchesFilter = (post, filter) => {
  if (filter === "All") return true;
  const haystack = [post?.category, post?.title, ...(post?.tags || []), post?.excerpt]
    .join(" ")
    .toLowerCase();
  const keywords = FILTER_MAP[filter] || [];
  return keywords.some((keyword) => haystack.includes(keyword));
};

const popularReads = [
  {
    title: "Designing a Sanctuary Nursery",
    description: "Palette formulas, lighting, and styling tricks for a serene retreat.",
  },
  {
    title: "Registry Must-Haves",
    description: "Taylor’s checklist for gear that grows with the fourth trimester in mind.",
  },
  {
    title: "Celebration Etiquette",
    description: "Hosting timelines and thank-you touches to keep gatherings heartfelt.",
  },
];

const weeklyFocus = [
  {
    title: "Week 24: Travel-Friendly Gear",
    blurb: "Compare lightweight strollers and car seats that simplify holiday trips.",
  },
  {
    title: "Mindful Moments",
    blurb: "Five-minute rituals to balance planning with rest.",
  },
];

const carSeatPlaceholder = {
  id: 'car-seats-simplified-placeholder',
  slug: 'car-seats-simplified',
  title: 'Car Seats, Simplified',
  category: 'Guides',
  excerpt:
    "Compare infant, convertible, rotating, and booster seats with Taylor's concierge checklist and concierge tips.",
  readMinutes: 5,
  author: 'Taylor-Made Baby Co.',
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [feedback, setFeedback] = useState({ status: "idle", message: "" });

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const response = await api.get("/api/v1/blog");
        if (!active) return;
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        setPosts(data);
      } catch (error) {
        if (active) {
          setPosts([]);
          setPostsError(error.response?.data?.error?.message || "We couldn’t load the latest posts just now.");
        }
      } finally {
        if (active) setLoadingPosts(false);
      }
    };

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const postsWithCarSeat = useMemo(() => {
    if (posts.some((post) => post.slug === "car-seats-simplified")) {
      return posts;
    }
    return [carSeatPlaceholder, ...posts];
  }, [posts]);

  const filteredPosts = useMemo(
    () => postsWithCarSeat.filter((post) => matchesFilter(post, selectedFilter)),
    [postsWithCarSeat, selectedFilter]
  );

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (feedback.status !== "idle") {
      setFeedback({ status: "idle", message: "" });
    }
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    setFeedback({ status: "loading", message: "Sending your question…" });
    try {
      await api.post("/api/v1/blog/questions", form);
      setFeedback({ status: "success", message: "Thank you! Taylor will feature select questions soon." });
      setForm({ name: "", email: "", question: "" });
    } catch (error) {
      const message =
        error?.response?.data?.error?.message || "We couldn't send your question right now. Please try again.";
      setFeedback({ status: "error", message });
    }
  };

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <div className="space-y-24 pb-24 pt-16 sm:space-y-28">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-mauve">Concierge Notes</p>
              <h1 className="text-3xl font-heading text-mauve sm:text-4xl">Taylor-Made Journal</h1>
              <p className="max-w-2xl text-sm text-charcoal/70">
                Explore planning checklists, nursery inspiration, celebratory etiquette, and postpartum care from Taylor’s pastel desk.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`min-h-[40px] rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] shadow-sm transition duration-200 ease-out ${
                    selectedFilter === filter
                      ? "border-mauve bg-mauve text-white hover:bg-blush"
                      : "border-mauve/30 bg-white/80 text-charcoal/70 hover:bg-blush/40"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {postsError && (
              <EmptyState
                title="We had trouble"
                description={postsError}
                icon={SparklesIcon}
                className="bg-blush/40"
              />
            )}

            {loadingPosts ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="h-64 animate-pulse rounded-2xl bg-white/70 shadow-md" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyState
                title="Fresh stories are brewing"
                description="Taylor is polishing the next batch of concierge insights. Check back after your matcha latte."
                icon={SparklesIcon}
                className="bg-mauve/20"
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredPosts.map((post, index) => (
                  <article
                    key={post.slug || post.id || `post-${index}`}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-mauve/30 bg-white/85 shadow-md backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <figure className="relative h-48 w-full overflow-hidden">
                      <img
                        src={getCardImage(post, index)}
                        alt={post.title || "Taylor-Made blog story"}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-charcoal shadow-sm">
                        {computeReadLength(post)}
                      </span>
                    </figure>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mauve">
                          {post.category || "Concierge Notes"}
                        </p>
                        <h2 className="text-xl font-heading text-mauve">{post.title}</h2>
                        <p className="text-sm leading-relaxed text-charcoal/70">{getPreviewText(post)}</p>
                      </div>
                      <div className="mt-auto space-y-2 text-xs text-charcoal/70">
                        <p>By {post.author || "Taylor-Made Baby Co."}</p>
                        {post.publishedAt && <p>{formatDate(post.publishedAt)}</p>}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={post.slug === "car-seats-simplified" ? "/car-seats-simplified" : `/blog/${post.slug || post.id}`}
                          className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full bg-mauve px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-blush"
                        >
                          Read Story
                        </Link>
                        <button
                          type="button"
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-mauve/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-charcoal/70 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-mauve/10"
                        >
                          <BookmarkIcon className="h-4 w-4" aria-hidden="true" />
                          Save for Later
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="hidden w-full max-w-sm flex-none space-y-6 rounded-2xl border border-mauve/30 bg-white/80 p-6 text-left shadow-md backdrop-blur-sm lg:sticky lg:top-24 lg:block">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-mauve">Popular Reads</h3>
              <ul className="space-y-4">
                {popularReads.map((item) => (
                  <li key={item.title} className="rounded-2xl border border-mauve/20 bg-white/85 p-4 shadow-sm">
                    <p className="font-heading text-lg text-charcoal">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-mauve">This Week’s Focus</h3>
              <ul className="space-y-4">
                {weeklyFocus.map((item) => (
                  <li key={item.title} className="rounded-2xl border border-mauve/25 bg-blush/40 p-4 shadow-sm">
                    <p className="font-heading text-lg text-charcoal">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{item.blurb}</p>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <section
          id="qa"
          className="mx-auto max-w-6xl space-y-8 rounded-2xl border border-mauve/30 bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10"
        >
          <header className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mauve">Q &amp; A with Tay</p>
            <h2 className="text-2xl font-heading text-charcoal sm:text-3xl">Ask the Concierge</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-charcoal/70 sm:text-base">
              Wondering about registry timelines, nursery palettes, or celebration etiquette? Submit your questions and Taylor will answer favorites in upcoming spotlights.
            </p>
          </header>

          <form onSubmit={handleSubmitQuestion} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-charcoal/70">
              Name
              <input
                type="text"
                value={form.name}
                onChange={handleInputChange("name")}
                className="rounded-full border border-mauve/30 bg-white px-4 py-3 shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/30"
                placeholder="Your name"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-charcoal/70">
              Email
              <input
                type="email"
                value={form.email}
                onChange={handleInputChange("email")}
                className="rounded-full border border-mauve/30 bg-white px-4 py-3 shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/30"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-charcoal/70">
              Your Question
              <textarea
                value={form.question}
                onChange={handleInputChange("question")}
                rows={4}
                className="rounded-3xl border border-mauve/30 bg-white px-4 py-3 shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/30"
                placeholder="What would you like Taylor to cover next?"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-mauve px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-blush"
            >
              {feedback.status === "loading" ? "Sending…" : "Submit Question"}
            </button>
          </form>

          {feedback.status !== "idle" && (
            <p
              className={`text-sm ${feedback.status === "error" ? "text-mauve" : "text-charcoal/70"}`}
              aria-live="polite"
            >
              {feedback.message}
            </p>
          )}

          <div className="rounded-2xl border border-mauve/30 bg-white/85 p-6 text-left shadow-sm">
            <h3 className="font-heading text-lg text-mauve">What happens next?</h3>
            <P>
              Taylor and her concierge team gather questions to inspire blog features, newsletter prompts, and member salons. Bookmark this page to stay in the loop.
            </P>
          </div>
        </section>
      </div>
    </main>
  );
}
