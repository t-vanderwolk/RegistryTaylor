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

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

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

  const featuredPost = posts.find((post) => post.slug === "stroller-styles-demystified") || posts[0] || null;
  const remainingPosts = featuredPost
    ? posts.filter((post) => post.id !== featuredPost.id)
    : posts;

  const authorLabel = (post) => post.author || "Taylor-Made Baby Co.";

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
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[3.5rem] border border-primary/30 bg-softPink px-6 py-16 text-center shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <img
          src={blogHeroImage}
          alt="Curated nursery with pastel accents"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Taylor-Made Blog</p>
          <h1 className="flex flex-col items-center gap-2 text-4xl text-blueberry sm:text-5xl md:text-6xl">
            <span className="font-cursive text-primary drop-shadow-sm sm:text-6xl md:text-7xl">Taylor-Made</span>
            <span className="font-serif uppercase tracking-[0.32em] text-sm text-neutral-700 sm:text-base md:text-lg">Baby Co. Blog</span>
          </h1>
          <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
            Let’s face it—stroller shopping can feel like learning a new language. If “modular,” “travel system,” or “convertible” make you pause, you’re in the right place.
          </p>
          {loadingPosts && posts.length === 0 && (
            <p className="text-sm text-neutral-500">Loading the latest pastel pages…</p>
          )}
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link
              to="/membership"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
            >
              Explore Memberships
            </Link>
            <a
              href="#qa"
              className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-primary shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink"
            >
              Ask a Question
            </a>
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="mx-auto max-w-6xl rounded-[3.25rem] border border-primary/25 bg-softPink px-6 py-16 text-left shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
          <header className="space-y-3 text-center md:text-left">
            <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Featured Guide</p>
            <h2 className="text-3xl font-serif text-blueberry sm:text-4xl md:text-5xl">{featuredPost.title}</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base md:mx-0">
              {featuredPost.excerpt || "Explore the latest Taylor-Made stroller insights."}
            </p>
          </header>

          <article className="mt-8 flex flex-col gap-4 rounded-[2.5rem] border border-primary/20 bg-white p-6 shadow-soft sm:flex-row sm:p-8">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-neutral-500">
                <span>{featuredPost.category || "Guides"}</span>
                <span className="text-primary">Highlighted</span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
                {featuredPost.content
                  ? `${featuredPost.content.replace(/\s+/g, ' ').trim().slice(0, 260)}...`
                  : featuredPost.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-neutral-400">
                <span>By {authorLabel(featuredPost)}</span>
                {featuredPost.publishedAt && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </>
                )}
                <span aria-hidden="true">•</span>
                <span>{computeReadLength(featuredPost)}</span>
              </div>
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md sm:w-auto"
              >
                Read the Full Guide
              </Link>
            </div>
          </article>
        </section>
      )}


      <section id="qa" className="mx-auto max-w-6xl space-y-10 rounded-[3.25rem] border border-primary/25 bg-softMint px-6 py-16 shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Q &amp; A with Tay</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">Ask the Concierge</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Wondering about registry timelines, nursery palettes, or celebration etiquette? Submit your questions and Taylor will answer favorites in upcoming spotlights.
          </p>
        </header>

        <form
          onSubmit={handleSubmitQuestion}
          className="mx-auto grid w-full max-w-3xl gap-5 rounded-[2.75rem] border border-primary/25 bg-white p-6 shadow-soft"
        >
          <label className="text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
            Name
            <input
              type="text"
              value={form.name}
              onChange={handleInputChange("name")}
              placeholder="Taylor Fan"
              className="mt-2 w-full rounded-2xl border border-primary/25 bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </label>
          <label className="text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
            Email
            <input
              type="email"
              value={form.email}
              onChange={handleInputChange("email")}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-primary/25 bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </label>
          <label className="text-sm font-heading uppercase tracking-[0.3em] text-primary/70">
            Your Question
            <textarea
              value={form.question}
              onChange={handleInputChange("question")}
              placeholder="Ask Taylor anything about concierge planning, gifting, or milestone moments."
              rows={4}
              className="mt-2 w-full rounded-2xl border border-primary/25 bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md">
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
                  className="rounded-[2.5rem] border border-primary/25 bg-white p-6 text-left shadow-soft"
                >
                  <header className="flex items-center justify-between text-xs font-heading uppercase tracking-[0.3em] text-neutral-500">
                    <span>{item.username || "Anonymous"}</span>
                    <span className="text-primary">Q &amp; A</span>
                  </header>
                  <p className="mt-4 font-serif text-lg text-blueberry">{item.question}</p>
                  {item.status === "published" && item.answer ? (
                    <p className="mt-4 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                  ) : (
                    <p className="mt-4 text-sm italic text-neutral-500">Taylor is curating a response</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl overflow-hidden rounded-[3.5rem] border border-primary/30 bg-softBeige px-6 py-16 text-center shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Stay in the Loop</p>
          <h3 className="flex flex-col items-center gap-2 text-3xl text-blueberry sm:text-4xl">
            <span className="font-cursive text-primary drop-shadow-sm">Taylor-Made</span>
            <span className="font-serif text-neutral-700">From Blog to Bespoke</span>
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            Loving the stories? Step into the concierge experience for personalized registries, nursery styling, and celebration planning made just for your family.
          </p>
          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
            >
              Book a Consultation
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-8 py-3 text-xs font-heading uppercase tracking-[0.32em] text-primary shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink"
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
