import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { useCommunityThread, CommunityPost } from "../hooks/useCommunityThread";

type ToastState = {
  tone: "success" | "error";
  message: string;
} | null;

type CommunityThreadProps = {
  moduleSlug: string;
  moduleOptions?: Array<{ slug: string; title: string }>;
  allowModuleFilter?: boolean;
  userId?: string;
};

const highlightMentions = (text: string) => {
  const segments = text.split(/(@[a-zA-Z0-9_-]+)/g);
  return segments.map((segment, index) => {
    if (segment.startsWith("@")) {
      return (
        <span key={`${segment}-${index}`} className="font-heading text-tmMauve">
          {segment}
        </span>
      );
    }
    return <React.Fragment key={`${segment}-${index}`}>{segment}</React.Fragment>;
  });
};

const CommunityThread: React.FC<CommunityThreadProps> = ({
  moduleSlug,
  moduleOptions,
  allowModuleFilter,
  userId,
}) => {
  const [activeSlug, setActiveSlug] = useState(moduleSlug);
  const [composer, setComposer] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<number | string, string>>({});
  const [toast, setToast] = useState<ToastState>(null);

  const { posts, status, error, createPost, replyToPost } = useCommunityThread(activeSlug, { userId });

  useEffect(() => {
    setActiveSlug(moduleSlug);
  }, [moduleSlug]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const moduleTitle = useMemo(() => {
    if (!moduleOptions) return "";
    return moduleOptions.find((option) => option.slug === activeSlug)?.title || "";
  }, [moduleOptions, activeSlug]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!composer.trim()) {
      setToast({ tone: "error", message: "Share at least one thought before posting." });
      return;
    }
    try {
      await createPost({ content: composer.trim(), mediaUrl: mediaUrl.trim() || undefined });
      setComposer("");
      setMediaUrl("");
      setToast({ tone: "success", message: "Shared with the community." });
    } catch (err: any) {
      setToast({
        tone: "error",
        message: err.response?.data?.error || err.message || "Unable to share post right now.",
      });
    }
  };

  const handleReply = async (post: CommunityPost) => {
    const draft = replyDrafts[post.id];
    if (!draft || !draft.trim()) {
      setToast({ tone: "error", message: "Add a reply before sending." });
      return;
    }
    try {
      await replyToPost(post.id, draft.trim());
      setReplyDrafts((current) => {
        const copy = { ...current };
        delete copy[post.id];
        return copy;
      });
      setToast({ tone: "success", message: "Reply shared." });
    } catch (err: any) {
      setToast({
        tone: "error",
        message: err.response?.data?.error || err.message || "Unable to reply right now.",
      });
    }
  };

  return (
    <div className="space-y-6" data-testid="community-thread">
      {allowModuleFilter && moduleOptions?.length ? (
        <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
          Module
          <select
            value={activeSlug}
            onChange={(event) => setActiveSlug(event.target.value)}
            className="w-full rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {moduleOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <section className="rounded-[2rem] border border-ivory/80 bg-white/95 p-5 shadow-soft">
        <form onSubmit={handleCreate} className="space-y-3">
          <header className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-heading text-charcoal">
                {moduleTitle ? `${moduleTitle} · Community` : "Ask the community"}
              </h3>
              <p className="text-sm font-body text-charcoal/60">
                Share how the module is landing, tag a mentor for bespoke notes, or drop a resource for fellow parents.
              </p>
            </div>
          </header>
          <textarea
            value={composer}
            onChange={(event) => setComposer(event.target.value)}
            placeholder="Ask the community..."
            className="min-h-[120px] w-full rounded-2xl border border-tmMauve/30 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
          <input
            type="url"
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
            placeholder="Share a reference link (optional)"
            className="w-full rounded-2xl border border-tmMauve/20 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-tmMauve via-tmBlush to-tmMauve px-6 py-3 text-xs font-heading uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-1 hover:shadow-dreamy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <SendHorizonal className="h-3.5 w-3.5" aria-hidden />
            Share
          </button>
        </form>
      </section>

      {status === "loading" && (
        <p className="rounded-[2rem] border border-tmMauve/20 bg-white/80 px-5 py-4 text-sm font-body text-charcoal/60">
          Gathering stories from the lounge…
        </p>
      )}
      {status === "error" && error && (
        <p className="rounded-[2rem] border border-rose-200 bg-rose-50/80 px-5 py-4 text-sm font-body text-rose-600">
          {error}
        </p>
      )}
      {status === "success" && !posts.length && (
        <p className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-5 py-4 text-sm font-body text-charcoal/60">
          No threads yet — be the first to begin the conversation.
        </p>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="space-y-4 rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-soft"
            >
              <header className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tmMauve/15 text-sm font-heading text-tmMauve">
                  {post.userId?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-heading text-charcoal">
                    @{post.userId}
                    {post.mentorReply ? (
                      <span className="ml-2 inline-flex items-center rounded-full bg-tmGold/20 px-2 py-0.5 text-[0.6rem] font-heading uppercase tracking-[0.28em] text-tmGold">
                        Mentor
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm font-body text-charcoal/80">
                    {highlightMentions(post.content)}
                  </p>
                  {post.mediaUrl && (
                    <a
                      href={post.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-tmMauve/25 bg-tmMauve/10 px-3 py-1 text-xs font-heading uppercase tracking-[0.28em] text-tmMauve transition hover:border-tmMauve/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      View reference
                    </a>
                  )}
                </div>
              </header>

              {post.mentorReply && (
                <div className="rounded-2xl border border-tmGold/30 bg-tmGold/10 px-4 py-3 text-sm font-body text-charcoal/80">
                  <p className="mb-1 text-xs font-heading uppercase tracking-[0.32em] text-tmGold/80">Mentor Reply</p>
                  <p>{post.mentorReply}</p>
                </div>
              )}

              {post.replies.length > 0 && (
                <ul className="space-y-3 border-t border-tmMauve/20 pt-3">
                  {post.replies.map((reply) => (
                    <li key={reply.id} className="rounded-2xl border border-ivory/80 bg-ivory/80 px-4 py-3">
                      <p className="text-xs font-heading uppercase tracking-[0.32em] text-charcoal/60">
                        @{reply.userId}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-body text-charcoal/70">
                        {highlightMentions(reply.content)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="rounded-2xl border border-tmMauve/20 bg-tmMauve/5 p-4">
                <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-[0.32em] text-charcoal/50">
                  <MessageCircle className="h-4 w-4 text-tmMauve" aria-hidden />
                  Reply
                </label>
                <textarea
                  value={replyDrafts[post.id] || ""}
                  onChange={(event) =>
                    setReplyDrafts((current) => ({
                      ...current,
                      [post.id]: event.target.value,
                    }))
                  }
                  placeholder="Share encouragement or a next-step tip…"
                  className="mt-2 min-h-[80px] w-full rounded-2xl border border-tmMauve/30 bg-white px-4 py-2 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Reply to community post"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleReply(post)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-tmMauve/30 bg-white px-4 py-2 text-xs font-heading uppercase tracking-[0.28em] text-tmMauve shadow-soft transition hover:border-tmMauve focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="assertive"
          className={`rounded-2xl border px-4 py-3 text-sm font-body ${
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default CommunityThread;
