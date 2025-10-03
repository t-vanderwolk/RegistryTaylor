import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";
import EmptyState from "../components/UI/EmptyState";
import api from "../lib/api";
import blogHeroImage from "../assets/nursery-1.jpeg";
import blogImageOne from "../assets/happy-baby.jpeg";
import blogImageTwo from "../assets/mom-support.jpeg";
import blogImageThree from "../assets/video-chat.jpeg";
import blogImageFour from "../assets/baby-blanket.jpeg";
import strollerPreviewImage from "../assets/baby-bump.jpeg";
import strollerDetailImage from "../assets/belly-rub.jpeg";

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

const postVisuals = {
  "stroller-styles-demystified": {
    featuredImage: strollerPreviewImage,
    detailImage: strollerDetailImage,
    alt: "Taylor leading a stroller styling consultation",
  },
};

const Blog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [feedback, setFeedback] = useState({ status: "idle", message: "" });
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

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
          const message =
            error.response?.data?.error?.message || "We couldn’t load the latest posts just now.";
          setPostsError(message);
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
      } catch (error) {
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

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const computeReadLength = (post) => {
    if (post.readLength) return post.readLength;
    if (post.readMinutes) return `${post.readMinutes} min read`;
    const source = post.content || post.excerpt || "";
    const words = source.split(/\s+/).filter(Boolean).length;
    if (!words) return "Taylor-Made insight";
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  const previewPosts = posts;

  const authorLabel = (post) => post.author || "Taylor-Made Baby Co.";

  const getPostVisual = (post) => {
    if (!post) return null;
    return postVisuals[post.slug] || null;
  };

  const getPreviewText = (post) => {
    if (!post) return "A fresh concierge perspective from Taylor-Made.";
    if (post.excerpt && post.excerpt.trim()) {
      return post.excerpt.trim();
    }
    if (post.content && post.content.trim()) {
      const condensed = post.content.replace(/\s+/g, " ").trim();
      return condensed.length > 220 ? `${condensed.slice(0, 220)}…` : condensed;
    }
    return "A fresh concierge perspective from Taylor-Made.";
  };

  const getCardImage = (post, index) => {
    const visual = getPostVisual(post);
    if (visual?.detailImage) return visual.detailImage;
    return blogGallery[index % blogGallery.length];
  };

  const handleInputChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setFeedback({ status: "idle", message: "" });
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setFeedback({ status: "error", message: "Please add your username so Taylor can recognize you." });
      return;
    }

    if (!form.email.trim()) {
      setFeedback({ status: "error", message: "Please include an email so we can follow up." });
      return;
    }

    if (!form.question.trim()) {
      setFeedback({ status: "error", message: "Please share a question before submitting." });
      return;
    }

    const payload = {
      username: form.name.trim(),
      email: form.email.trim(),
      question: form.question.trim(),
    };

    try {
      await api.post("/api/v1/blog/questions", payload);
      setForm({ name: "", email: "", question: "" });
      setFeedback({ status: "success", message: "Thanks! Taylor will feature your question soon." });
      setQuestions((current) => [
        {
          id: `local-${Date.now()}`,
          username: payload.username,
          email: undefined,
          question: payload.question,
          answer: null,
          status: "pending",
          created_at: new Date().toISOString(),
        },
        ...current,
      ]);
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        "We couldn’t send your question right now. Please try again.";
      setFeedback({ status: "error", message });
    }
  };

  const navigateToCommunityForum = () => {
    navigate("/community-forum");
  };

  return (
    <div className="relative space-y-16 pb-24 pt-16 sm:space-y-20">
      <section className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[3.75rem] border border-gold/20 bg-transparent px-6 py-20 text-center shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-softPink/85 via-white/88 to-softMint/75" aria-hidden="true" />
        <img
          src={blogHeroImage}
          alt="Softly lit nursery with pastel florals"
          className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/65 via-transparent to-pastelPurple/45" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="flex flex-col items-center gap-2 text-4xl text-blueberry sm:text-5xl md:text-6xl">
            <span className="font-script text-5xl text-primary drop-shadow-sm sm:text-6xl md:text-7xl">
              Taylor-Made
            </span>
            <span className="font-heading uppercase tracking-[0.32em] text-sm text-blueberry/80 sm:text-base md:text-lg">
              Baby Co. Blog
            </span>
          </h1>
          <div className="gold-divider" />
          <p className="text-base leading-relaxed text-blueberry/80 sm:text-lg">
            Boutique stroller wisdom, curated registry picks, and concierge moments designed to keep planning soft, playful, and wholly you.
          </p>
          {loadingPosts && posts.length === 0 && (
            <p className="text-sm text-blueberry/70">Steeping the latest pastel pages…</p>
          )}
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link
              to="/membership"
              className="inline-flex items-center justify-center rounded-full bg-primary px-9 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-pop focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Explore Memberships
            </Link>
            <a
              href="#qa"
              className="inline-flex items-center justify-center rounded-full bg-primary px-9 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-pop focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Ask a Question
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] rounded-[3.25rem] border border-primary/25 bg-softPink px-6 py-16 text-left shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Featured Guides</p>
          <h2 className="text-3xl font-serif text-blueberry sm:text-4xl md:text-5xl">Taylor-Made Highlights</h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base md:mx-0">
            Curated stroller strategy, registry wins, and concierge stories that set the tone for calm planning.
          </p>
          <div className="gold-divider md:mx-0" />
        </header>

        {loadingPosts ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`hero-skeleton-${index}`}
                className="animate-pulse rounded-[2.5rem] border border-primary/20 bg-white p-8 shadow-inner"
              >
                <div className="mb-6 h-48 w-full rounded-[2rem] bg-softPink/30" />
                <div className="mb-3 h-3 w-24 rounded-full bg-softPink/30" />
                <div className="mb-3 h-5 w-3/4 rounded-full bg-softPink/20" />
                <div className="mb-2 h-3 w-full rounded-full bg-softPink/30" />
                <div className="mb-2 h-3 w-2/3 rounded-full bg-softPink/30" />
                <div className="h-10 w-full rounded-full bg-softPink/30" />
              </div>
            ))}
          </div>
        ) : postsError ? (
          <div className="mt-8">
            <EmptyState
              title="Blog is having a moment"
              description={postsError}
              icon={SparklesIcon}
              className="bg-softPink"
            />
          </div>
        ) : previewPosts.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="More stories coming soon"
              description="Taylor is polishing the next batch of concierge insights. Check back shortly."
              icon={SparklesIcon}
              className="bg-softPink"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {previewPosts.map((post, index) => {
              const visual = getPostVisual(post);
              const isFeatureCard = index === 0;

              return (
                <article
                  key={post.slug || post.id || `post-${index}`}
                  className={`group flex h-full flex-col overflow-hidden rounded-[2.75rem] border bg-white/92 text-left shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-dreamy ${
                    isFeatureCard ? "border-gold/35" : "border-primary/20"
                  }`}
                >
                  <figure className="relative h-48 w-full overflow-hidden">
                    <img
                      src={getCardImage(post, index)}
                      alt={visual?.alt || post.title || "Taylor-Made blog story"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isFeatureCard && (
                      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/90 px-4 py-1 text-[0.62rem] font-heading uppercase tracking-[0.32em] text-gold shadow-soft">
                        Feature Post
                      </span>
                    )}
                  </figure>
                  <div className="flex flex-1 flex-col gap-4 px-8 pb-6 pt-6">
                    <div className="flex flex-wrap items-center gap-3 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-blueberry/60">
                      <span>{post.category || "Concierge Notes"}</span>
                      {post.visibility === "members_only" && <span className="flex items-center gap-1 text-primary">🔒 Members Only</span>}
                      <span className="inline-flex items-center text-[0.6rem] text-primary/70">{computeReadLength(post)}</span>
                    </div>
                    <h3 className="text-2xl font-heading text-blueberry sm:text-3xl">{post.title}</h3>
                    <p className="text-sm leading-relaxed text-blueberry/80 sm:text-base">{getPreviewText(post)}</p>
                    <div className="mt-auto flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-blueberry/60">
                      <span>By {authorLabel(post)}</span>
                      {post.publishedAt && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 px-8 pb-8">
                    {post.visibility === "members_only" ? (
                      <button
                        type="button"
                        onClick={navigateToCommunityForum}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] sm:w-auto"
                      >
                        Visit Community Forum
                      </button>
                    ) : (
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] sm:w-auto"
                      >
                        Read Article
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section id="qa" className="mx-auto max-w-[1200px] space-y-10 rounded-[3.25rem] border border-primary/25 bg-softMint px-6 py-16 shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Q &amp; A with Tay</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">Ask the Concierge</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Wondering about registry timelines, nursery palettes, or celebration etiquette? Submit your questions and Taylor will answer favorites in upcoming spotlights.
          </p>
          <div className="gold-divider" />
        </header>

        <form
          onSubmit={handleSubmitQuestion}
          className="mx-auto grid w-full max-w-3xl gap-5 rounded-[3rem] border border-gold/30 bg-gradient-to-br from-softMint/65 via-white/92 to-pastelPurple/60 p-8 shadow-soft backdrop-blur-sm"
        >
          <label className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">
            Name
            <input
              type="text"
              value={form.name}
              onChange={handleInputChange("name")}
              placeholder="Taylor Fan"
              className="mt-2 w-full rounded-full border border-primary/25 bg-white/95 px-5 py-3 text-sm text-blueberry/80 shadow-inner transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:italic placeholder:text-blueberry/40"
              required
            />
          </label>
          <label className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">
            Email
            <input
              type="email"
              value={form.email}
              onChange={handleInputChange("email")}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-full border border-primary/25 bg-white/95 px-5 py-3 text-sm text-blueberry/80 shadow-inner transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:italic placeholder:text-blueberry/40"
              required
            />
          </label>
          <label className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">
            Your Question
            <textarea
              value={form.question}
              onChange={handleInputChange("question")}
              placeholder="Ask Taylor anything about concierge planning, gifting, or milestone moments."
              rows={4}
              className="mt-2 w-full rounded-[2rem] border border-primary/25 bg-white/95 px-5 py-3 text-sm text-blueberry/80 shadow-inner transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:italic placeholder:text-blueberry/40"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-lavender/90 px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-blueberry shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:bg-lavender focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Submit Question
          </button>
          {feedback.status !== "idle" && (
            <p
              className={`text-center text-xs font-heading uppercase tracking-[0.3em] ${
                feedback.status === "success" ? "text-primary" : "text-red-400"
              }`}
            >
              {feedback.message}
            </p>
          )}
        </form>

        <div className="mx-auto w-full max-w-5xl">
          {loadingQuestions ? (
            <EmptyState
              title="Gathering questions"
              description="We’re polishing the latest submissions."
              icon={SparklesIcon}
              className="bg-softPink"
            />
          ) : questions.length === 0 ? (
            <EmptyState
              title="No questions yet"
              description="Be the first to submit a question and see it answered here."
              icon={SparklesIcon}
              className="bg-softPink"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {questions.map((item) => (
                <article
                  key={item.id}
                  className="flex h-full flex-col justify-between rounded-[2.5rem] border border-gold/25 bg-white/95 p-6 text-left shadow-soft backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-dreamy"
                >
                  <header className="flex items-center justify-between text-xs font-heading uppercase tracking-[0.3em] text-primary/70">
                    <span className="flex items-center gap-2 text-blueberry/70">
                      <SparklesIcon className="h-4 w-4 text-primary/70" />
                      {item.username || "Anonymous"}
                    </span>
                    <span className="rounded-full border border-primary/30 bg-softPink/60 px-3 py-1 text-[0.6rem] tracking-[0.35em] text-blueberry/70">
                      Q &amp; A
                    </span>
                  </header>
                  <p className="mt-5 font-heading text-lg text-blueberry sm:text-xl">{item.question}</p>
                  {item.status === "published" && item.answer ? (
                    <p className="mt-4 text-sm italic leading-relaxed text-blueberry/75">{item.answer}</p>
                  ) : (
                    <p className="mt-4 text-sm italic text-blueberry/60">Taylor is curating a response</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[3.75rem] border border-gold/25 px-6 py-16 text-center shadow-dreamy motion-safe:animate-fade-in-up sm:px-10 md:px-20 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-softBeige/85 via-softPink/70 to-pastelPurple/60" aria-hidden="true" />
        <div className="absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-10 h-52 w-52 rounded-full bg-softMint/50 blur-3xl" />
          <div className="absolute right-10 top-10 h-48 w-48 rounded-full bg-babyPink/50 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-primary/80">Stay in the Loop</p>
          <h3 className="flex flex-col items-center gap-2 text-3xl text-blueberry sm:text-4xl">
            <span className="font-script text-primary drop-shadow-sm">Taylor-Made</span>
            <span className="font-heading text-blueberry">From Blog to Bespoke</span>
          </h3>
          <div className="gold-divider" />
          <p className="text-sm leading-relaxed text-blueberry/80 sm:text-base">
            Loving the stories? Step into the concierge experience for personalized registries, nursery styling, and celebration planning made just for your family.
          </p>
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-9 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Book a Consultation
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center justify-center rounded-full bg-primary px-9 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-dreamy transition duration-200 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              View Membership Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
