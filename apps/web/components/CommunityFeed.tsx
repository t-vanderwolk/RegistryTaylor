"use client";

import { useState } from "react";
import { API_BASE } from "../lib/api";
import { CommunityPost as CommunityPostType } from "../lib/types";
import { CommunityPost } from "./CommunityPost";
import { cn } from "../lib/utils";

const CATEGORY_OPTIONS = [
  "Nursery",
  "Gear",
  "Postpartum",
  "Community",
];

export function CommunityFeed({ initialPosts }: { initialPosts: CommunityPostType[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async () => {
    if (!title.trim() || !content.trim()) {
      window.alert("Add a title and message before sharing.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/community/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          category,
          isAnonymous,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to post to community");
      }
      setPosts((prev) => [json.data as CommunityPostType, ...prev]);
      setTitle("");
      setContent("");
      setIsAnonymous(false);
    } catch (error) {
      console.error(error);
      window.alert("We couldn't share that. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="card-surface space-y-6 bg-white/95 px-6 py-7">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
            Community hub
          </p>
          <h2 className="font-heading text-3xl text-tmCharcoal">Start a Conversation</h2>
          <p className="text-sm text-tmCharcoal/70">
            Ask for guidance, celebrate a win, or share what’s working in your home.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
              Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
              placeholder="What do you want to talk about?"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
              Category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
            Message
          </label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-transparent bg-tmIvory/90 p-4 text-sm text-tmCharcoal shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
            placeholder="Share context or ask for recommendations."
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-tmCharcoal/70">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
              className="h-4 w-4 rounded border-tmMauve/40 text-tmMauve focus:ring-tmGold"
            />
            Post anonymously
          </label>
          <button
            type="button"
            onClick={submitPost}
            disabled={isSubmitting}
            className={cn(
              "rounded-full bg-tmMauve px-6 py-2 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
              isSubmitting && "opacity-60"
            )}
          >
            {isSubmitting ? "Posting..." : "Share with community"}
          </button>
        </div>
      </section>

      <div className="space-y-6">
        {posts.map((post) => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
