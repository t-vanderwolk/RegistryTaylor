// src/pages/Blog.js
import React from "react";
import Section from "../components/UI/Section";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blog";

const Blog = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section title="Taylor‑Made Blog" center tightTop compact className="bg-alt-blue">
        <div className="max-w-4xl mx-auto text-cozyGray/80 space-y-8">
          <p className="text-lg text-cozyGray/75 leading-relaxed">
            Cozy up with planning tips, product roundups, and gentle encouragement as you prepare for baby. These curated highlights give you a taste of the support my clients enjoy inside the Taylor‑Made experience.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {blogPosts.map((post) => (
              <article key={post.id} className="cc-card text-left">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-deepSlate/60 mb-2">
                  <span>{post.category}</span>
                  {post.isMembersOnly && <span className="text-softGold">Members Only</span>}
                </div>
                <h3 className="font-serif text-2xl text-deepSlate mb-3">{post.title}</h3>
                <p className="text-cozyGray/75 mb-4 leading-relaxed">{post.excerpt}</p>
                <p className="text-cozyGray/85 mb-4 leading-relaxed">{post.content}</p>
                <Link
                  to="/contact"
                  className="text-softGold hover:text-deepSlate underline tracking-[0.12em] uppercase text-xs"
                >
                  Let’s plan together
                </Link>
              </article>
            ))}
          </div>

          <div className="text-center">
            <a
              href="mailto:RegistrywithTaylor@gmail.com?subject=Blog%20Topic%20Suggestion&body=Hi%20Taylor%2C%20I%27d%20love%20to%20read%20about..."
              className="btn-primary text-sm sm:text-base px-7 sm:px-8 py-3"
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
