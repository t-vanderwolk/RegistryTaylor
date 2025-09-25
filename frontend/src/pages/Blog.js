import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Section from "../components/UI/Section";
import EmptyState from "../components/UI/EmptyState";
import api from "../lib/api";

const fallbackPosts = [
  {
    id: "registry-essentials",
    slug: "registry-essentials",
    title: "Registry Essentials Worth the Hype",
    category: "Registry",
    excerpt:
      "From carriers to bottles, here’s what parents actually reach for every day—and what can stay on the shelf.",
    visibility: 'public',
  },
  {
    id: "nursery-that-grows",
    slug: "nursery-that-grows",
    title: "Designing a Nursery That Grows with Baby",
    category: "Nursery",
    excerpt:
      "Set up a calm, functional space that transitions smoothly from newborn naps to toddler play.",
    visibility: 'public',
  },
];

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
          status: 'pending',
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

  const navigateToPrivateBlog = () => {
    navigate("/private-blog");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-pastelPurple/15 to-cream text-darkText">
      <Section title="Taylor-Made Blog" center tightTop compact className="bg-white/75">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-10 text-center">
          <p className="font-body text-lg leading-relaxed text-darkText/75 sm:text-xl">
            Cozy up with planning tips, product roundups, and gentle encouragement as you prepare for baby. These highlights give you a taste of the support my clients enjoy inside the Taylor-Made experience.
          </p>
          {loadingPosts && posts.length === 0 && (
            <p className="text-sm text-darkText/60">Loading latest posts…</p>
          )}
        </div>
      </Section>

      <Section tightTop compact className="bg-white/85">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.slug || post.id || `post-${index}`}
              className="rounded-3xl border border-pastelPurple/30 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-darkText/60">
                <span>{post.category}</span>
                {post.visibility === 'members_only' && (
                  <span className="text-gold flex items-center gap-1">🔒 Members Only</span>
                )}
              </div>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-blueberry">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-4 font-body text-sm leading-relaxed text-darkText/70">{post.excerpt}</p>
              )}
              <div className="mt-5 flex items-center gap-3">
                {post.visibility === 'members_only' ? (
                  <button
                    type="button"
                    onClick={navigateToPrivateBlog}
                    className="inline-flex items-center bg-transparent text-sm font-heading uppercase tracking-[0.18em] text-gold underline hover:text-blueberry"
                  >
                    Enter Private Blog
                  </button>
                ) : (
                  <Link
                    to={`/blog/${post.slug || post.id}`}
                    className="inline-flex items-center text-sm font-heading uppercase tracking-[0.18em] text-gold underline hover:text-blueberry"
                  >
                    Read More →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Q & A w/ Tay" compact className="bg-alt-purple">
        <div className="space-y-10">
          <div className="mx-auto max-w-3xl text-center text-darkText/75">
            <p className="font-body text-base leading-relaxed">
              Curious about registry strategy, concierge touches, or prepping for baby? Drop your question and I’ll handpick favorites to answer in upcoming posts and newsletters.
            </p>
          </div>

          <form onSubmit={handleSubmitQuestion} className="mx-auto grid w-full max-w-3xl gap-5 rounded-3xl border border-pastelPurple/40 bg-white/95 p-6 shadow-soft">
              <label className="text-sm font-heading uppercase tracking-[0.3em] text-darkText/60">
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={handleInputChange("name")}
                  placeholder="Taylor Fan"
                  className="mt-2 w-full rounded-2xl border border-pastelPurple/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyBlue focus:outline-none"
                  required
                />
              </label>
              <label className="text-sm font-heading uppercase tracking-[0.3em] text-darkText/60">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={handleInputChange("email")}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-pastelPurple/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyBlue focus:outline-none"
                  required
                />
              </label>
            <label className="text-sm font-heading uppercase tracking-[0.3em] text-darkText/60">
              Your Question
              <textarea
                value={form.question}
                onChange={handleInputChange("question")}
                placeholder="Ask Taylor anything about concierge planning, gifting, or milestone moments."
                rows={4}
                className="mt-2 w-full rounded-2xl border border-pastelPurple/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyBlue focus:outline-none"
              />
            </label>
            <button type="submit" className="btn-primary text-xs sm:text-sm">
              Submit Question
            </button>
            {feedback.status !== "idle" && (
              <p
                className={`text-center text-xs font-heading uppercase tracking-[0.3em] ${
                  feedback.status === "success" ? "text-gold" : "text-rose-500"
                }`}
              >
                {feedback.message}
              </p>
            )}
          </form>

          <section className="mx-auto grid w-full max-w-5xl gap-8">
            {loadingQuestions ? (
              <EmptyState
                title="Gathering questions"
                description="We’re polishing the latest submissions."
                icon={SparklesIcon}
              />
            ) : questions.length === 0 ? (
              <EmptyState
                title="No questions yet"
                description="Be the first to submit a question and see it answered here."
                icon={SparklesIcon}
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {questions.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-3xl border border-pastelPurple/40 bg-white/95 p-6 text-left shadow-soft"
                  >
                    <header className="flex items-center justify-between text-xs font-heading uppercase tracking-[0.3em] text-darkText/60">
                      <span>{item.username || "Anonymous"}</span>
                      <span className="text-gold">Q & A</span>
                    </header>
                    <p className="mt-4 font-heading text-lg text-blueberry">{item.question}</p>
                    {item.status === 'published' && item.answer ? (
                      <p className="mt-4 font-body text-sm leading-relaxed text-darkText/70">{item.answer}</p>
                    ) : (
                      <p className="mt-4 font-body text-sm italic text-darkText/60">
                        Taylor is curating a response
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </Section>
    </div>
  );
};

export default Blog;
