"use client";

import { useEffect, useMemo, useState } from "react";
import type { CommunityFeedPost, FeedCategory } from "./data";

const FILTERS: FeedCategory[] = ["All", "Mentor Insight", "Parent Reflection"];

type ReactionType = "heart" | "clap";

type CommunityFeedProps = {
  posts: CommunityFeedPost[];
};

export default function CommunityFeed({ posts }: CommunityFeedProps) {
  const [entries, setEntries] = useState<CommunityFeedPost[]>(() =>
    posts.map((post) => ({
      ...post,
      comments: [...post.comments],
      reactions: { ...post.reactions },
    }))
  );
  const [activeFilter, setActiveFilter] = useState<FeedCategory>("All");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setEntries(
      posts.map((post) => ({
        ...post,
        comments: [...post.comments],
        reactions: { ...post.reactions },
      }))
    );
  }, [posts]);

  const filteredEntries = useMemo(() => {
    if (activeFilter === "All") {
      return entries;
    }
    return entries.filter((post) => post.category === activeFilter);
  }, [activeFilter, entries]);

  const handleReact = (postId: string, reaction: ReactionType) => {
    setEntries((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reaction]: post.reactions[reaction] + 1,
              },
            }
          : post
      )
    );
  };

  const handleDraftChange = (postId: string, message: string) => {
    setCommentDrafts((drafts) => ({
      ...drafts,
      [postId]: message,
    }));
  };

  const handleAddComment = (postId: string) => {
    const nextComment = (commentDrafts[postId] ?? "").trim();
    if (!nextComment) {
      return;
    }

    setEntries((current) =>
      current.map((post) => {
        if (post.id !== postId) {
          return post;
        }
        const comments = [
          ...post.comments,
          {
            id: `local-${Date.now()}`,
            author: "You",
            body: nextComment,
            createdAt: new Date().toISOString(),
          },
        ];

        return {
          ...post,
          comments,
          reactions: {
            ...post.reactions,
            comment: Math.max(post.reactions.comment, comments.length),
          },
        };
      })
    );

    setCommentDrafts((drafts) => ({
      ...drafts,
      [postId]: "",
    }));
  };

  return (
    <section className="space-y-6 rounded-[2.5rem] border border-[#C8A1B4]/35 bg-white/95 p-6 shadow-[0_24px_55px_rgba(200,161,180,0.18)]">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">Community Feed</p>
        <h2 className="font-[var(--font-playfair)] text-2xl text-[#3E2F35] sm:text-3xl">
          Mentor salons, reflections, and studio threads
        </h2>
        <p className="text-sm text-[#3E2F35]/70">
          Swap rituals, share progress, and respond with quick reactions. Filter by mentor spotlights or member reflections.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition",
                isActive
                  ? "border-[#C8A1B4] bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] text-[#3E2F35] shadow-[0_12px_28px_rgba(200,161,180,0.32)]"
                  : "border-[#C8A1B4]/50 text-[#3E2F35]/70 hover:-translate-y-0.5 hover:border-[#D9C48E] hover:text-[#3E2F35]",
              ].join(" ")}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        {filteredEntries.map((post) => {
          const draft = commentDrafts[post.id] ?? "";

          return (
            <article
              key={post.id}
              className="space-y-5 rounded-[2.2rem] border border-[#C8A1B4]/35 bg-white/90 p-6 shadow-[0_22px_55px_rgba(200,161,180,0.18)]"
            >
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]/80">
                    <span>{post.author.displayName}</span>
                    <span className="text-[#3E2F35]/60">{formatRelativeTime(post.createdAt)}</span>
                  </div>
                  <h3 className="mt-3 font-[var(--font-playfair)] text-xl text-[#3E2F35]">{post.title}</h3>
                </div>
                <span className="rounded-full bg-gradient-to-r from-[#C8A1B4]/15 via-[#EAC9D1]/20 to-[#FFFAF8] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/75">
                  {post.category}
                </span>
              </header>

              <p className="text-sm leading-relaxed text-[#3E2F35]/75">{post.body}</p>

              {post.tags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-[#C8A1B4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/60 px-4 py-2 transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                  onClick={() => handleReact(post.id, "heart")}
                >
                  ❤️ {post.reactions.heart}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/60 px-4 py-2 transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                  onClick={() => handleReact(post.id, "clap")}
                >
                  👏 {post.reactions.clap}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C8A1B4]/60 px-4 py-2 transition hover:-translate-y-0.5 hover:border-[#D9C48E]"
                  onClick={() => focusCommentInput(post.id)}
                >
                  💬 {post.comments.length}
                </button>
              </div>

              <div className="space-y-4 rounded-[1.75rem] border border-[#C8A1B4]/25 bg-[#FFFAF8]/90 p-4">
                <ul className="space-y-3">
                  {post.comments.map((comment) => (
                    <li key={comment.id} className="space-y-1 text-sm text-[#3E2F35]/75">
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4]/80">
                        <span>{comment.author}</span>
                        <time dateTime={comment.createdAt} className="text-[#3E2F35]/55">
                          {formatRelativeTime(comment.createdAt)}
                        </time>
                      </div>
                      <p>{comment.body}</p>
                    </li>
                  ))}
                  {post.comments.length === 0 && (
                    <li className="text-sm text-[#3E2F35]/60">Start the conversation with the first reflection.</li>
                  )}
                </ul>

                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAddComment(post.id);
                  }}
                >
                  <label htmlFor={`comment-${post.id}`} className="sr-only">
                    Add a comment
                  </label>
                  <textarea
                    id={`comment-${post.id}`}
                    value={draft}
                    onChange={(event) => handleDraftChange(post.id, event.target.value)}
                    placeholder="Share a thought or cheer on a member..."
                    className="h-20 w-full resize-none rounded-[1.5rem] border border-[#C8A1B4]/35 bg-white/95 px-4 py-3 text-sm text-[#3E2F35] shadow-inner focus:border-[#D9C48E] focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#3E2F35]/50">Anonymous to peers—mentors see your name for follow-up.</span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C8A1B4] via-[#EAC9D1] to-[#D9C48E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_12px_28px_rgba(200,161,180,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(200,161,180,0.4)]"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function focusCommentInput(postId: string) {
  const element = document.getElementById(`comment-${postId}`) as HTMLTextAreaElement | null;
  if (!element) {
    return;
  }
  element.focus();
  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "Just now";
  }
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes}m ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffMs / day);
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
