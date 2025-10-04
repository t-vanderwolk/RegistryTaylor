import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import PageTitle from "../components/UI/PageTitle";

import EmptyState from "../components/UI/EmptyState";
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
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
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

    const loadQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await api.get("/api/v1/blog/questions");
        if (!active) return;
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        setQuestions(data);
      } catch (_error) {
        if (active) setQuestions([]);
      } finally {
        if (active) setLoadingQuestions(false);
      }
    };

    loadPosts();
    loadQuestions();

    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setFeedback({ status: "idle", message: "" });
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    const { name, email, question } = form;

    if (!name.trim()) {
      setFeedback({ status: "error", message: "Please share your name so Taylor can say hello." });
      return;
    }
    if (!email.trim()) {
      setFeedback({ status: "error", message: "We need an email to keep in touch." });
      return;
    }
    if (!question.trim()) {
      setFeedback({ status: "error", message: "Pop in a question before submitting." });
      return;
    }

    const payload = {
      username: name.trim(),
      email: email.trim(),
      question: question.trim(),
    };

    try {
      await api.post("/api/v1/blog/questions", payload);
      setForm({ name: "", email: "", question: "" });
      setFeedback({ status: "success", message: "Thanks! Taylor is crafting a response." });
      setQuestions((prev) => [
        {
          id: `local-${Date.now()}`,
          username: payload.username,
          question: payload.question,
          status: "pending",
        },
        ...prev,
      ]);
    } catch (error) {
      setFeedback({
        status: "error",
        message: error.response?.data?.error?.message || "We couldn’t submit that right now. Please try again.",
      });
    }
  };

  const postsWithCarSeat = useMemo(() => {
    if (posts.some((post) => post.slug === 'car-seats-simplified')) return posts;
    return [carSeatPlaceholder, ...posts];
  }, [posts]);

  const filteredPosts = useMemo(
    () => postsWithCarSeat.filter((post) => matchesFilter(post, selectedFilter)),
    [postsWithCarSeat, selectedFilter],
  );

  return (
    <div className="space-y-24 bg-[#FFF8F2] pb-24 pt-16 text-[#332E4F] sm:space-y-28">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl bg-gradient-to-br from-[#F7E5EE] via-[#FFF8F2] to-[#E4CFDA] p-6 text-center shadow-md sm:p-10">
        <PageTitle eyebrow="Concierge Notes" subtitle="Journal" />
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
          Explore planning checklists, nursery inspiration, celebratory etiquette, and postpartum care from Taylor’s pastel desk.
        </p>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:flex-row">
        <div className="flex-1 space-y-8">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                className={`min-h-[40px] rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] shadow-sm transition ${
                  selectedFilter === filter
                    ? "border-[#C17BA5] bg-[#C17BA5] text-white"
                    : "border-[#C17BA5]/30 bg-white/80 text-[#5E5873]"
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
              className="bg-[#FADADD]"
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
              className="bg-[#D8F3DC]"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.slug || post.id || `post-${index}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E2CAD9]/60 bg-white/85 shadow-md backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <figure className="relative h-48 w-full overflow-hidden">
                    <img
                      src={getCardImage(post, index)}
                      alt={post.title || "Taylor-Made blog story"}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-[#FFF8F2]/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#332E4F] shadow-sm">
                      {computeReadLength(post)}
                    </span>
                  </figure>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A2C8]">
                        {post.category || "Concierge Notes"}
                      </p>
                      <h2 className="text-xl font-serif text-[#332E4F]">{post.title}</h2>
                      <p className="text-sm leading-relaxed text-[#5E5873]">{getPreviewText(post)}</p>
                    </div>
                    <div className="mt-auto space-y-2 text-xs text-[#5E5873]">
                      <p>By {post.author || "Taylor-Made Baby Co."}</p>
                      {post.publishedAt && <p>{formatDate(post.publishedAt)}</p>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={post.slug === 'car-seats-simplified' ? '/car-seats-simplified' : `/blog/${post.slug || post.id}`}
                        className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-full bg-[#C17BA5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:scale-105"
                      >
                        Read Story
                      </Link>
                      <button
                        type="button"
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#C17BA5]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5E5873] shadow-sm transition hover:scale-105"
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

        <aside className="hidden w-full max-w-sm flex-none space-y-6 rounded-2xl border border-[#E2CAD9]/60 bg-white/80 p-6 text-left shadow-md backdrop-blur-sm lg:sticky lg:top-24 lg:block">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A2C8]">Popular Reads</h3>
            <ul className="space-y-4">
              {popularReads.map((item) => (
                <li key={item.title} className="rounded-2xl border border-[#E5CEDA]/50 bg-white/85 p-4 shadow-sm">
                  <p className="font-serif text-lg text-[#332E4F]">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5E5873]">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A2C8]">This Week’s Focus</h3>
            <ul className="space-y-4">
              {weeklyFocus.map((item) => (
                <li key={item.title} className="rounded-2xl border border-[#DCC0D0]/40 bg-[#F7E5EE]/60 p-4 shadow-sm">
                  <p className="font-serif text-lg text-[#332E4F]">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5E5873]">{item.blurb}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section
        id="qa"
        className="mx-auto max-w-6xl space-y-8 rounded-2xl border border-[#C8A2C8]/30 bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-10"
      >
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A2C8]">Q &amp; A with Tay</p>
          <h2 className="text-2xl font-serif text-[#332E4F] sm:text-3xl">Ask the Concierge</h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#5E5873] sm:text-base">
            Wondering about registry timelines, nursery palettes, or celebration etiquette? Submit your questions and Taylor will answer favorites in upcoming spotlights.
          </p>
        </header>

        <form onSubmit={handleSubmitQuestion} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-[#5E5873]">
            Name
            <input
              type="text"
              value={form.name}
              onChange={handleInputChange("name")}
              className="rounded-full border border-[#C8A2C8]/40 bg-white px-4 py-3 shadow-inner focus:border-[#C8A2C8] focus:outline-none focus:ring-2 focus:ring-[#C8A2C8]/40"
              placeholder="Your name"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-[#5E5873]">
            Email
            <input
              type="email"
              value={form.email}
              onChange={handleInputChange("email")}
              className="rounded-full border border-[#C8A2C8]/40 bg-white px-4 py-3 shadow-inner focus:border-[#C8A2C8] focus:outline-none focus:ring-2 focus:ring-[#C8A2C8]/40"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-[#5E5873]">Question</span>
            <textarea
              rows={4}
              value={form.question}
              onChange={handleInputChange("question")}
              className="w-full rounded-2xl border border-[#C8A2C8]/40 bg-white px-4 py-3 text-sm shadow-inner focus:border-[#C8A2C8] focus:outline-none focus:ring-2 focus:ring-[#C8A2C8]/40"
              placeholder="Ask Taylor anything about pregnancy planning"
              required
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#C17BA5] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
            >
              Submit Question
            </button>
          </div>
          <div className="sm:col-span-2 text-sm text-[#5E5873]" aria-live="polite">
            {feedback.status === "error" && <span className="text-[#C0392B]">{feedback.message}</span>}
            {feedback.status === "success" && <span className="text-[#2E7D32]">{feedback.message}</span>}
          </div>
        </form>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C8A2C8]">Recent Submissions</h3>
          {loadingQuestions ? (
            <p className="text-sm text-[#5E5873]">Loading questions…</p>
          ) : questions.length === 0 ? (
            <p className="text-sm text-[#5E5873]">Be the first to ask Taylor a question this week.</p>
          ) : (
            <ul className="space-y-3">
              {questions.map((question) => (
                <li key={question.id} className="rounded-2xl bg-[#FFF8F2]/80 p-4 text-left shadow-sm">
                  <p className="text-sm font-semibold text-[#332E4F]">{question.username}</p>
                  <p className="text-sm leading-relaxed text-[#5E5873]">{question.question}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C8A2C8]">{question.status}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </div>
  );
}
