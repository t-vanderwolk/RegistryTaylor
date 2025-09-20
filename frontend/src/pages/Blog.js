// src/pages/Blog.js
import React from "react";
import Section from "../components/UI/Section";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { blogPosts } from "../data/blog";
import { motion } from "framer-motion";

const Blog = () => {
  const navigate = useNavigate();

  const { token } = useAuth();

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
        <div className="max-w-5xl mx-auto text-cozyGray/80 space-y-10">
          <p className="text-lg text-cozyGray/75 leading-relaxed text-center">
            Cozy up with planning tips, product roundups, and gentle
            encouragement as you prepare for baby. These curated highlights
            give you a taste of the support my clients enjoy inside the
            Taylor-Made experience.
          </p>

          {/* Blog Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
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
                      to={`/blog/${post.id}`}
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
        </div>
      </Section>
    </div>
  );
};

export default Blog;
