// src/pages/Blog.js
import React from "react";
import Section from "../components/UI/Section";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "Registry Essentials Worth the Hype",
    excerpt:
      "From carriers to bottles, here’s what parents actually reach for every day—and what can stay on the shelf.",
    content:
      "After supporting hundreds of families, I have a shortlist of registry items that work hard without cluttering your home. We’ll look at everyday must-haves, splurges that are truly worth it, and smart swaps when you’re on a tight budget.",
  },
  {
    id: 2,
    title: "Designing a Nursery That Grows with Baby",
    excerpt:
      "Set up a calm, functional space that transitions smoothly from newborn naps to toddler play.",
    content:
      "Start with a neutral base, layer in cozy textures, and choose furniture that adapts as your little one grows. I share layout tips, storage ideas, and my favorite finishing touches to keep the room feeling magical and practical.",
  },
  {
    id: 3,
    title: "Planning the Shower You’ll Actually Enjoy",
    excerpt:
      "Celebrations should feel personal, joyful, and stress-free. Here’s how to make it happen.",
    content:
      "From invitations and mood boards to games that don’t feel cringey, I walk you through the decisions that matter. Plus, a timeline you can follow to stay organized without feeling overwhelmed.",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-transparent text-cozyGray">
      <Section title="Taylor‑Made Blog" center tightTop compact className="bg-alt-blue">
        <div className="max-w-4xl mx-auto text-cozyGray/80 space-y-8">
          <p className="text-lg text-cozyGray/75 leading-relaxed">
            Cozy up with planning tips, product roundups, and gentle encouragement as you prepare for baby. These curated highlights give you a taste of the support my clients enjoy inside the Taylor‑Made experience.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.id} className="cc-card text-left">
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
              className="btn-primary px-8 py-3"
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
