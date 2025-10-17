"use client";

import { useState } from "react";
import { API_BASE } from "../lib/api";
import { CommunityPost as CommunityPostType, CommunityComment } from "../lib/types";
import { cn } from "../lib/utils";

export function CommunityPost({ post }: { post: CommunityPostType }) {
  const [comments, setComments] = useState<CommunityComment[]>(post.comments);
  const [pendingContent, setPendingContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitComment = async () => {
    if (!pendingContent.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/community/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: pendingContent }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Unable to post comment");
      }
      setComments((prev) => [...prev, json.data as CommunityComment]);
      setPendingContent("");
    } catch (error) {
      console.error(error);
      window.alert("We couldn't post that comment. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="card-surface space-y-6 bg-white/95 px-6 py-6">
      <header className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
          <span>{post.category}</span>
          <time>{new Date(post.created_at).toLocaleDateString()}</time>
        </div>
        <h3 className="font-heading text-2xl text-tmCharcoal">{post.title}</h3>
        <p className="text-sm leading-relaxed text-tmCharcoal/80">{post.content}</p>
      </header>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-tmMauve">
          Community Replies
        </h4>
        {comments.length === 0 && (
          <p className="text-sm text-tmCharcoal/60">
            Be the first to share encouragement or insight.
          </p>
        )}
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-tmBlush/40 bg-tmIvory/75 p-4 text-sm leading-relaxed text-tmCharcoal shadow-soft"
            >
              <div className="flex gap-3">
                <span className="h-full w-1 rounded-full bg-tmGold/70" aria-hidden />
                <p>{comment.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3 rounded-2xl border border-tmBlush/60 bg-white/80 p-4 shadow-soft">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve/70">
          Share your perspective
        </label>
        <textarea
          value={pendingContent}
          onChange={(event) => setPendingContent(event.target.value)}
          placeholder="Add encouragement, resources, or questions for fellow parents."
          className="w-full rounded-2xl border border-transparent bg-tmIvory/80 p-4 text-sm text-tmCharcoal/90 shadow-inner transition focus:border-tmGold/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-tmGold/30"
          rows={3}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submitComment}
            disabled={isSubmitting}
            className={cn(
              "rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-tmGold transition duration-200 hover:-translate-y-0.5 hover:bg-tmMauve/90 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
              isSubmitting && "opacity-60"
            )}
          >
            {isSubmitting ? "Sending..." : "Post Comment"}
          </button>
        </div>
      </div>
    </article>
  );
}
