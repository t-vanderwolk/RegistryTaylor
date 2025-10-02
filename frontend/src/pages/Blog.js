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

const fallbackPosts = [
  {
    id: "registry-essentials",
    slug: "registry-essentials",
    title: "Registry Essentials Worth the Hype",
    category: "Registry",
    excerpt:
      "From carriers to bottles, here’s what parents actually reach for every day—and what can stay on the shelf.",
    visibility: "public",
  },
  {
    id: "nursery-that-grows",
    slug: "nursery-that-grows",
    title: "Designing a Nursery That Grows with Baby",
    category: "Nursery",
    excerpt:
      "Set up a calm, functional space that transitions smoothly from newborn naps to toddler play.",
    visibility: "public",
  },
  {
    id: "stroller-styles-demystified",
    slug: "stroller-styles-demystified",
    title: "Stroller Styles, Demystified",
    category: "Guides",
    author: "Taylor Vanderwolk",
    publishedAt: "2024-09-15T10:00:00Z",
    excerpt:
      "Confused about modular versus travel systems, or which stroller grows with two kids? This Taylor-Made guide breaks every stroller style into plain-language essentials—complete with quick comparison chart and concierge tips.",
    visibility: "public",
  },
];

const blogGallery = [blogImageOne, blogImageTwo, blogImageThree, blogImageFour];

const Blog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [feedback, setFeedback] = useState({ status: "idle", message: "" });
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await api.get("/api/v1/blog");
        if (!active) return;
        const data = Array.isArray(response.data?.data) ? response.data.data : [];
        if (data.length) {
          setPosts(data);
        } else {
          setPosts(fallbackPosts);
        }
      } catch (error) {
        if (active) setPosts(fallbackPosts);
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

      <section className="mx-auto max-w-6xl rounded-[3.25rem] border border-primary/25 bg-softMint px-6 py-16 text-left shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="space-y-3 text-center md:text-left">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">🍼 Stroller Styles, Demystified</p>
          <h2 className="text-3xl font-serif text-blueberry sm:text-4xl md:text-5xl">What’s the Difference Between All Those Stroller Types?</h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-neutral-6
00 sm:text-base md:mx-0">
            This guide clears the clutter by covering core features first (Modular, Travel System), then rolling through every stroller category. Whether you’re registry-new or registry-repeat, this layout keeps decisions confident and informed.
          </p>
        </header>

        <article className="mt-8 rounded-[2.5rem] border border-primary/20 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-neutral-500">
            <span>Guides</span>
            <span className="text-primary">Feature Post</span>
          </div>
          <div className="mt-4 space-y-4">
            <h3 className="text-3xl font-serif text-blueberry sm:text-4xl">Stroller Styles, Demystified</h3>
            <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
              Confused about modular versus travel systems, or which stroller grows with two kids? This Taylor-Made guide breaks every stroller style into plain-language essentials—complete with quick comparison chart and concierge tips.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-neutral-400">
              <span>By Taylor Vanderwolk</span>
              <span aria-hidden="true">•</span>
              <span>{new Date("2024-09-15T10:00:00Z").toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/blog/stroller-styles-demystified"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
            >
              Read the Full Guide
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-primary shadow-soft transition hover:-translate-y-1 hover:scale-105 hover:bg-softPink"
            >
              Book a Stroller Consult
            </Link>
          </div>
        </article>
      </section>

      {/* <section className="mx-auto max-w-6xl space-y-8 rounded-[3.25rem] border border-primary/25 bg-white px-6 py-14 shadow-soft motion-safe:animate-fade-in-up sm:px-10 md:px-16">
        <header className="text-center">
          <p className="text-xs font-serif uppercase tracking-[0.32em] text-primary/80">Fresh Highlights</p>
          <h2 className="mt-3 text-3xl font-serif text-blueberry sm:text-4xl">
            Latest on the <span className="font-cursive text-primary">Taylor-Made</span> Blog
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            These stories offer a glimpse inside the concierge experience. From product picks to celebration playbooks, each one carries Taylor’s signature attention to detail.
          </p>
        </header>
        <div className="space-y-6">
          {posts.map((post, index) => (
            <article
              key={post.slug || post.id || `post-${index}`}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-primary/20 bg-white text-left shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-md"
            >
              <figure className="relative h-64 w-full overflow-hidden">
                <img
                  src={blogGallery[index % blogGallery.length]}
                  alt={post.title || "Taylor-Made blog story"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </figure>
              <div className="flex flex-wrap items-center justify-between gap-3 px-8 pt-6 text-[0.7rem] font-heading uppercase tracking-[0.28em] text-neutral-500">
                <span>{post.category || "Blog"}</span>
                {post.visibility === "members_only" && <span className="flex items-center gap-1 text-primary">🔒 Members Only</span>}
              </div>
              <div className="space-y-4 px-8 pb-6">
                <h3 className="text-3xl font-serif text-blueberry sm:text-4xl">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">{post.excerpt}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs font-heading uppercase tracking-[0.24em] text-neutral-400">
                  {post.author && <span>By {post.author}</span>}
                  {post.publishedAt && post.author && <span aria-hidden="true">•</span>}
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 px-8 pb-8">
                {post.visibility === "members_only" ? (
                  <button
                    type="button"
                    onClick={navigateToCommunityForum}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
                  >
                    Visit Community Forum
                  </button>
                ) : (
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white transition hover:-translate-y-1 hover:scale-105 hover:shadow-md"
                  >
                    Read Article
                  </Link>
                )}
                <span className="text-xs font-heading uppercase tracking-[0.28em] text-neutral-400">
                  {post.readLength ? `${post.readLength} read` : "Concierge insights"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section> */}

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
