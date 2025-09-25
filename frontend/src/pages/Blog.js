// src/pages/Blog.js
import React, { useEffect, useState } from "react";
import Section from "../components/UI/Section";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../lib/api";
import { blogPosts as fallbackPosts } from "../data/blog";

const Blog = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const storageKey = "tm_public_blog_questions";
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ name: "", question: "" });
  const [feedback, setFeedback] = useState({ status: "idle", message: "" });
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        }
      }
    } catch (error) {
      console.warn("Unable to load saved questions", error);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const adaptPosts = (items) =>
      items.map((post) => ({
        id: post.slug || post.id,
        slug: post.slug || post.id,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt || post.content?.slice(0, 200) || "",
        isMembersOnly: post.visibility ? post.visibility === "members_only" : Boolean(post.isMembersOnly),
      }));

    (async () => {
      setLoadingPosts(true);
      try {
        const response = await api.get("/api/v1/blog");
        if (!active) return;
        const payload = Array.isArray(response.data?.data) ? response.data.data : [];
        if (payload.length) {
          setPosts(adaptPosts(payload));
        } else {
          setPosts(adaptPosts(fallbackPosts));
        }
      } catch (error) {
        console.warn("Unable to load blog posts", error);
        if (active) {
          setPosts(adaptPosts(fallbackPosts));
        }
      } finally {
        if (active) setLoadingPosts(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const persistQuestions = (items) => {
    setQuestions(items);
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.warn("Unable to persist questions", error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setFeedback({ status: "idle", message: "" });
  };

  const createId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `q_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  };

  const handleSubmitQuestion = (event) => {
    event.preventDefault();
    if (!form.question.trim()) {
      setFeedback({ status: "error", message: "Please share a question before submitting." });
      return;
    }

    const entry = {
      id: createId(),
      name: form.name.trim() || "Anonymous",
      question: form.question.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [entry, ...questions].slice(0, 24);
    persistQuestions(next);
    setForm({ name: "", question: "" });
    setFeedback({ status: "success", message: "Thanks! Taylor will feature your question soon." });
  };

  const handleEnterPrivateBlog = () => {
    if (token) {
      navigate("/private-blog");
      return;
    }

    navigate("/portal?redirect=/private-blog", {
      state: { redirectTo: "/private-blog" },
      replace: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white text-cozyGray">
      <Section
        title="Taylor-Made Blog"
        center
        tightTop
        compact
        className="bg-alt-blue"
      >
        <motion.h2>Hi Awin!</motion.h2>
        <div className="max-w-5xl mx-auto text-cozyGray/80 space-y-10">
          <p className="text-lg text-cozyGray/75 leading-relaxed text-center">
            Cozy up with planning tips, product roundups, and gentle
            encouragement as you prepare for baby. These curated highlights
            give you a taste of the support my clients enjoy inside the
            Taylor-Made experience.
          </p>

          {/* Blog Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {loadingPosts && posts.length === 0 && (
              <p className="text-center text-sm text-cozyGray/60">Loading latest posts…</p>
            )}
            {posts.map((post, index) => (
              <motion.article
                key={post.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="cc-card text-left rounded-2xl bg-white/90 shadow-soft p-6 backdrop-blur-sm"
              >
                {/* Category + Member tag */}
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-deepSlate/60 mb-2">
                  <span>{post.category}</span>
                  {post.isMembersOnly && (
                    <span className="text-softGold flex items-center gap-1">
                      🔒 Members Only
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-deepSlate mb-3">
                  {post.title}
                </h3>

                {/* Public vs Members-only */}
                {!post.isMembersOnly ? (
                  <>
                    <p className="text-cozyGray/75 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="text-softGold hover:text-deepSlate underline tracking-[0.12em] uppercase text-xs"
                    >
                      Read More →
                    </Link>
                  </>
                ) : (
                  <p className="text-cozyGray/60 italic">
                    Full content available in the Private Blog.{" "}
                    <button
                      type="button"
                      onClick={handleEnterPrivateBlog}
                      className="inline bg-transparent text-left text-softGold underline hover:text-deepSlate"
                    >
                      Enter Private Blog
                    </button>
                  </p>
                )}
              </motion.article>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={handleEnterPrivateBlog}
              className="btn-primary text-sm sm:text-base px-7 sm:px-8 py-3"
            >
              ✨ Enter Private Blog
            </button>
            <a
              href="mailto:RegistryWihTaylor@gmail.com?subject=Blog%20Topic%20Suggestion&body=Hi%20Taylor%2C%20I%27d%20love%20to%20read%20about..."
              className="btn-secondary text-sm sm:text-base px-7 sm:px-8 py-3"
            >
              Suggest a Topic
            </a>
          </div>

          {/* Q & A Section */}
          <div className="mt-16 space-y-8">
            <header className="text-center space-y-3">
              <h2 className="font-serif text-3xl text-deepSlate">Q &amp; A w/ Tay</h2>
              <p className="mx-auto max-w-3xl text-cozyGray/75 leading-relaxed">
                Curious about registry strategy, concierge touches, or prepping for baby? Drop your question and Taylor will handpick favorites to answer in upcoming posts and newsletters.
              </p>
              <p className="text-xs font-heading uppercase tracking-[0.35em] text-softGold">
                Taylor personally reads every submission and will hand-answer each question ASAP.
              </p>
            </header>

            <form onSubmit={handleSubmitQuestion} className="mx-auto grid w-full max-w-3xl gap-4 rounded-3xl border border-softGold/30 bg-white/90 p-6 shadow-soft">
              <label className="text-sm font-heading uppercase tracking-[0.3em] text-deepSlate/60">
                Name (optional)
                <input
                  type="text"
                  value={form.name}
                  onChange={handleInputChange("name")}
                  placeholder="Taylor Fan"
                  className="mt-2 w-full rounded-2xl border border-softGold/30 bg-white px-4 py-3 text-sm text-deepSlate shadow-inner focus:border-softGold focus:outline-none"
                />
              </label>
              <label className="text-sm font-heading uppercase tracking-[0.3em] text-deepSlate/60">
                Your Question
                <textarea
                  value={form.question}
                  onChange={handleInputChange("question")}
                  placeholder="Ask Taylor anything about concierge planning, gifting, or milestone moments."
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-softGold/30 bg-white px-4 py-3 text-sm text-deepSlate shadow-inner focus:border-softGold focus:outline-none"
                />
              </label>
              {feedback.status !== "idle" && (
                <p
                  className={`text-sm font-body ${
                    feedback.status === "success" ? "text-softGold" : "text-rose-500"
                  }`}
                >
                  {feedback.message}
                </p>
              )}
              <button
                type="submit"
                className="btn-primary max-w-xs justify-center self-end text-sm uppercase tracking-[0.3em]"
              >
                Submit Question
              </button>
            </form>

            {questions.length > 0 && (
              <section className="mx-auto grid w-full max-w-5xl gap-4">
                <h3 className="text-center font-heading text-sm uppercase tracking-[0.35em] text-deepSlate/50">
                  Community Curiosity
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {questions.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-3xl border border-softGold/30 bg-white/95 p-6 text-left shadow-soft"
                    >
                      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-deepSlate/50">
                        <span>{entry.name}</span>
                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-3 text-sm text-deepSlate/80 leading-relaxed">{entry.question}</p>
                      <p className="mt-4 text-xs font-heading uppercase tracking-[0.3em] text-softGold">
                        Taylor is curating a response
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Blog;
