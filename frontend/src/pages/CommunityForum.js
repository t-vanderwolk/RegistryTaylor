import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForumStore } from "../hooks/useForumStore";

const initialThreadForm = {
  title: "",
  category: "",
  body: "",
  resourceLink: "",
};

const defaultReplyDraft = { body: "", resourceLink: "" };

const validateLink = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol && parsed.hostname);
  } catch (error) {
    return false;
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (error) {
    return timestamp;
  }
};

const CommunityForum = () => {
  const { token, role } = useAuth();
  const {
    threads,
    addThread,
    updateThread,
    deleteThread,
    addReply,
    updateReply,
    deleteReply,
  } = useForumStore();

  const [showThreadForm, setShowThreadForm] = useState(false);
  const [threadForm, setThreadForm] = useState(initialThreadForm);
  const [threadError, setThreadError] = useState("");
  const [editingThreadId, setEditingThreadId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedThreads, setExpandedThreads] = useState(() => new Set());

  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyErrors, setReplyErrors] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [editingReplyForm, setEditingReplyForm] = useState(defaultReplyDraft);

  const isAuthenticated = Boolean(token);

  const canEditThread = (thread) => {
    if (!role) return false;
    if (role === "admin" || role === "mentor") return true;
    return role === thread.createdBy;
  };

  const canDeleteThread = (thread) => {
    if (!role) return false;
    if (role === "admin") return true;
    return role === thread.createdBy;
  };

  const canModerateReplies = role === "admin" || role === "mentor";

  const categories = useMemo(() => {
    const unique = new Set(
      threads
        .map((thread) => thread.category)
        .filter((category) => Boolean(category && category.trim())),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [threads]);

  const filteredThreads = useMemo(() => {
    if (!isAuthenticated) return [];
    const query = search.trim().toLowerCase();
    return threads
      .filter((thread) => {
        const matchesCategory = categoryFilter === "all" || thread.category === categoryFilter;
        const matchesQuery =
          !query ||
          thread.title.toLowerCase().includes(query) ||
          thread.body.toLowerCase().includes(query) ||
          thread.category.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }, [threads, search, categoryFilter, isAuthenticated]);

  const resetThreadForm = () => {
    setThreadForm(initialThreadForm);
    setThreadError("");
    setEditingThreadId(null);
  };

  const handleThreadFormChange = (field) => (event) => {
    const value = event.target.value;
    setThreadForm((current) => ({ ...current, [field]: value }));
    setThreadError("");
  };

  const handleThreadSubmit = (event) => {
    event.preventDefault();
    const { title, category, body, resourceLink } = threadForm;

    if (!title.trim() || !category.trim() || !body.trim()) {
      setThreadError("Please complete every field before posting.");
      return;
    }

    if (!validateLink(resourceLink)) {
      setThreadError("Resource link must be a valid URL.");
      return;
    }

    if (editingThreadId) {
      updateThread(editingThreadId, {
        title: title.trim(),
        category: category.trim(),
        body: body.trim(),
        resourceLink,
      });
    } else {
      addThread({
        title: title.trim(),
        category: category.trim(),
        body: body.trim(),
        resourceLink,
        createdBy: role,
      });
    }

    resetThreadForm();
    setShowThreadForm(false);
  };

  const handleEditThread = (thread) => {
    setThreadForm({
      title: thread.title,
      category: thread.category,
      body: thread.body,
      resourceLink: thread.resourceLink || "",
    });
    setEditingThreadId(thread.id);
    setShowThreadForm(true);
    setThreadError("");
  };

  const handleDeleteThread = (thread) => {
    if (!canDeleteThread(thread)) return;
    if (window.confirm("Remove this discussion?")) {
      deleteThread(thread.id);
    }
  };

  const toggleThread = (threadId) => {
    setExpandedThreads((current) => {
      const next = new Set(current);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
    });
  };

  const getReplyDraft = (threadId) => replyDrafts[threadId] || defaultReplyDraft;

  const updateReplyDraft = (threadId, field, value) => {
    setReplyDrafts((current) => ({
      ...current,
      [threadId]: {
        ...(current[threadId] || defaultReplyDraft),
        [field]: value,
      },
    }));
    setReplyErrors((current) => ({ ...current, [threadId]: "" }));
  };

  const handleReplySubmit = (threadId) => (event) => {
    event.preventDefault();
    const { body, resourceLink } = getReplyDraft(threadId);

    if (!body.trim()) {
      setReplyErrors((current) => ({ ...current, [threadId]: "Add a message before posting." }));
      return;
    }

    if (!validateLink(resourceLink)) {
      setReplyErrors((current) => ({ ...current, [threadId]: "Please use a valid URL." }));
      return;
    }

    addReply(threadId, {
      body: body.trim(),
      resourceLink,
      authorRole: role || "client",
    });

    setReplyDrafts((current) => ({ ...current, [threadId]: defaultReplyDraft }));
    setReplyErrors((current) => ({ ...current, [threadId]: "" }));
    setExpandedThreads((current) => new Set(current).add(threadId));
  };

  const startEditingReply = (threadId, reply) => {
    setEditingReply({ threadId, replyId: reply.id });
    setEditingReplyForm({
      body: reply.body,
      resourceLink: reply.resourceLink || "",
    });
  };

  const handleEditReplyChange = (field) => (event) => {
    const value = event.target.value;
    setEditingReplyForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditReplySubmit = (event) => {
    event.preventDefault();
    if (!editingReply) return;
    const { body, resourceLink } = editingReplyForm;

    if (!body.trim()) return;
    if (!validateLink(resourceLink)) return;

    updateReply(editingReply.threadId, editingReply.replyId, {
      body: body.trim(),
      resourceLink,
    });
    setEditingReply(null);
    setEditingReplyForm(defaultReplyDraft);
  };

  const cancelEditReply = () => {
    setEditingReply(null);
    setEditingReplyForm(defaultReplyDraft);
  };

  const handleDeleteReply = (threadId, replyId) => {
    if (!canModerateReplies) return;
    if (window.confirm("Remove this reply?")) {
      deleteReply(threadId, replyId);
    }
  };

  return (
<<<<<<< HEAD
    <main className="min-h-screen bg-ivory/70 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="rounded-[2.5rem] border border-blush/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <h1 className="font-heading text-4xl text-mauve">Taylor-Made Community</h1>
          <p className="mt-3 text-sm font-body text-charcoal/70">
            A private home for members and mentors to share wisdom, celebrate milestones, and grow together. Every conversation honors the Learn · Plan · Connect cycle.
=======
    <main className="min-h-screen bg-cream/70 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
          <h1 className="font-playful text-4xl text-blueberry">Community Forum</h1>
          <p className="mt-3 text-sm font-body text-darkText/70">
            A confidential space for Taylor, mentors, and invited families to compare notes, share wins, and crowdsource concierge inspiration.
>>>>>>> heroku/main
          </p>
          {isAuthenticated && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  if (showThreadForm && editingThreadId) {
                    resetThreadForm();
                  }
                  setShowThreadForm((current) => !current);
                }}
<<<<<<< HEAD
                className="inline-flex items-center gap-2 rounded-full bg-blush px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
              >
                {showThreadForm ? "Close form" : "Share with the circle"}
=======
                className="inline-flex items-center gap-2 rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
              >
                {showThreadForm ? "Close form" : "Start a discussion"}
>>>>>>> heroku/main
              </button>
            </div>
          )}
        </header>

        {isAuthenticated ? (
<<<<<<< HEAD
          <section className="grid gap-4 rounded-[2.5rem] border border-mauve/30 bg-white/95 p-6 shadow-soft backdrop-blur-sm md:grid-cols-[2fr,1fr]">
            <label className="flex flex-col gap-2 text-sm font-body text-charcoal/70">
=======
          <section className="grid gap-4 rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-6 shadow-soft backdrop-blur-sm md:grid-cols-[2fr,1fr]">
            <label className="flex flex-col gap-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Search
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a topic or keyword"
<<<<<<< HEAD
                className="rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-body text-charcoal/70">
=======
                className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
              Category
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
<<<<<<< HEAD
                className="rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal focus:border-blush focus:outline-none"
=======
                className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
              >
                <option value="all">All threads</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </section>
        ) : null}

        {showThreadForm && isAuthenticated && (
<<<<<<< HEAD
          <section className="rounded-[2.5rem] border border-blush/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
            <h2 className="font-heading text-2xl text-charcoal">
              {editingThreadId ? "Edit discussion" : "Start a discussion"}
            </h2>
            <form className="mt-6 space-y-5" onSubmit={handleThreadSubmit}>
              <label className="flex flex-col gap-2 text-sm font-body text-charcoal/70">
=======
          <section className="rounded-[2.5rem] border border-babyPink/40 bg-white/95 p-8 shadow-soft backdrop-blur-sm">
            <h2 className="font-heading text-2xl text-blueberry">
              {editingThreadId ? "Edit discussion" : "Start a discussion"}
            </h2>
            <form className="mt-6 space-y-5" onSubmit={handleThreadSubmit}>
              <label className="flex flex-col gap-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
                Title
                <input
                  type="text"
                  value={threadForm.title}
                  onChange={handleThreadFormChange("title")}
                  placeholder="e.g. Favorite stroller accessories"
<<<<<<< HEAD
                  className="rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-body text-charcoal/70">
=======
                  className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
                Category
                <input
                  type="text"
                  value={threadForm.category}
                  onChange={handleThreadFormChange("category")}
                  placeholder="Registry, Nursery, Support…"
<<<<<<< HEAD
                  className="rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-body text-charcoal/70">
=======
                  className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
                Message
                <textarea
                  value={threadForm.body}
                  onChange={handleThreadFormChange("body")}
                  placeholder="Share details, photos to drop, or questions for the group."
<<<<<<< HEAD
                  className="h-40 rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-body text-charcoal/70">
=======
                  className="h-40 rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-body text-darkText/70">
>>>>>>> heroku/main
                Resource link (optional)
                <input
                  type="url"
                  value={threadForm.resourceLink}
                  onChange={handleThreadFormChange("resourceLink")}
                  placeholder="https://"
<<<<<<< HEAD
                  className="rounded-2xl border border-mauve/40 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
=======
                  className="rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
                />
              </label>

              {threadError && (
<<<<<<< HEAD
                <p className="rounded-2xl border border-blush/60 bg-blush/15 px-4 py-3 text-sm font-body text-mauve">
=======
                <p className="rounded-2xl border border-babyPink/60 bg-babyPink/15 px-4 py-3 text-sm font-body text-babyPink">
>>>>>>> heroku/main
                  {threadError}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
<<<<<<< HEAD
                  className="rounded-full bg-mauve px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
=======
                  className="rounded-full bg-babyBlue px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
>>>>>>> heroku/main
                >
                  {editingThreadId ? "Update discussion" : "Post discussion"}
                </button>
                {editingThreadId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetThreadForm();
                      setShowThreadForm(false);
                    }}
<<<<<<< HEAD
                    className="rounded-full border border-blush/60 px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-mauve shadow-soft transition hover:-translate-y-1 hover:bg-blush/10"
=======
                    className="rounded-full border border-babyPink/60 px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-babyPink shadow-soft transition hover:-translate-y-1 hover:bg-babyPink/10"
>>>>>>> heroku/main
                  >
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="space-y-5">
          {!isAuthenticated ? (
<<<<<<< HEAD
            <div className="rounded-[2.5rem] border border-mauve/30 bg-white/95 px-6 py-10 text-center text-sm font-body text-charcoal/70 shadow-soft">
              Sign in to read and contribute to community discussions.
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="rounded-[2.5rem] border border-mauve/30 bg-white/95 px-6 py-10 text-center text-sm font-body text-charcoal/70 shadow-soft">
=======
            <div className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 px-6 py-10 text-center text-sm font-body text-darkText/70 shadow-soft">
              Sign in to read and contribute to community discussions.
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 px-6 py-10 text-center text-sm font-body text-darkText/70 shadow-soft">
>>>>>>> heroku/main
              No discussions yet. Start the conversation above.
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isExpanded = expandedThreads.has(thread.id);
              return (
                <article
                  key={thread.id}
<<<<<<< HEAD
                  className="rounded-[2.5rem] border border-mauve/30 bg-white/95 p-6 shadow-soft backdrop-blur-sm"
=======
                  className="rounded-[2.5rem] border border-babyBlue/30 bg-white/95 p-6 shadow-soft backdrop-blur-sm"
>>>>>>> heroku/main
                >
                  <header className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleThread(thread.id)}
                        className="text-left"
                      >
<<<<<<< HEAD
                        <p className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/50">
                          {thread.category || "General"}
                        </p>
                        <h3 className="mt-1 font-heading text-xl text-charcoal">{thread.title}</h3>
                      </button>
                      <p className="mt-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal/40">
=======
                        <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">
                          {thread.category || "General"}
                        </p>
                        <h3 className="mt-1 font-heading text-xl text-blueberry">{thread.title}</h3>
                      </button>
                      <p className="mt-2 text-xs font-heading uppercase tracking-[0.3em] text-darkText/40">
>>>>>>> heroku/main
                        Updated {formatTimestamp(thread.updatedAt || thread.createdAt)} · {thread.createdBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {thread.resourceLink && (
                        <a
                          href={thread.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
<<<<<<< HEAD
                          className="inline-flex items-center justify-center rounded-full border border-mauve/30 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-charcoal transition hover:-translate-y-0.5 hover:bg-blush/20"
=======
                          className="inline-flex items-center justify-center rounded-full border border-babyBlue/30 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-blueberry transition hover:-translate-y-0.5 hover:bg-babyPink/20"
>>>>>>> heroku/main
                        >
                          View resource
                        </a>
                      )}
                      {canEditThread(thread) && (
                        <button
                          type="button"
                          onClick={() => handleEditThread(thread)}
<<<<<<< HEAD
                          className="rounded-full bg-mauve/20 px-3 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-charcoal shadow-soft transition hover:-translate-y-0.5 hover:bg-mauve/30"
=======
                          className="rounded-full bg-babyBlue/20 px-3 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-blueberry shadow-soft transition hover:-translate-y-0.5 hover:bg-babyBlue/30"
>>>>>>> heroku/main
                        >
                          Edit
                        </button>
                      )}
                      {canDeleteThread(thread) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteThread(thread)}
<<<<<<< HEAD
                          className="rounded-full bg-blush/20 px-3 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-mauve shadow-soft transition hover:-translate-y-0.5 hover:bg-blush/30"
=======
                          className="rounded-full bg-babyPink/20 px-3 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-babyPink shadow-soft transition hover:-translate-y-0.5 hover:bg-babyPink/30"
>>>>>>> heroku/main
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </header>

<<<<<<< HEAD
                  <p className="mt-4 whitespace-pre-wrap text-sm font-body leading-relaxed text-charcoal/80">
=======
                  <p className="mt-4 whitespace-pre-wrap text-sm font-body leading-relaxed text-darkText/80">
>>>>>>> heroku/main
                    {thread.body}
                  </p>

                  <footer className="mt-6 space-y-5">
                    <button
                      type="button"
                      onClick={() => toggleThread(thread.id)}
<<<<<<< HEAD
                      className="text-xs font-heading uppercase tracking-[0.3em] text-charcoal/70"
=======
                      className="text-xs font-heading uppercase tracking-[0.3em] text-blueberry/70"
>>>>>>> heroku/main
                    >
                      {isExpanded ? "Hide replies" : `Show replies (${thread.replies.length})`}
                    </button>

                    {isExpanded && (
                      <div className="space-y-4">
                        {thread.replies.length === 0 ? (
<<<<<<< HEAD
                          <p className="text-sm font-body text-charcoal/60">
=======
                          <p className="text-sm font-body text-darkText/60">
>>>>>>> heroku/main
                            No replies yet. Be the first to respond.
                          </p>
                        ) : (
                          thread.replies.map((reply) => {
                            const isEditing = editingReply && editingReply.replyId === reply.id;
                            return (
                              <div
                                key={reply.id}
<<<<<<< HEAD
                                className="rounded-2xl border border-mauve/25 bg-mauve/10 px-4 py-4"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <p className="text-xs font-heading uppercase tracking-[0.28em] text-charcoal/50">
=======
                                className="rounded-2xl border border-babyBlue/25 bg-babyBlue/10 px-4 py-4"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <p className="text-xs font-heading uppercase tracking-[0.28em] text-darkText/50">
>>>>>>> heroku/main
                                    {reply.authorRole || "client"} · {formatTimestamp(reply.updatedAt || reply.createdAt)}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    {(canModerateReplies || reply.authorRole === role) && (
                                      <button
                                        type="button"
                                        onClick={() => startEditingReply(thread.id, reply)}
<<<<<<< HEAD
                                        className="rounded-full border border-mauve/30 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-charcoal"
=======
                                        className="rounded-full border border-babyBlue/30 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-blueberry"
>>>>>>> heroku/main
                                      >
                                        Edit
                                      </button>
                                    )}
                                    {canModerateReplies && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteReply(thread.id, reply.id)}
<<<<<<< HEAD
                                        className="rounded-full border border-blush/40 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-mauve"
=======
                                        className="rounded-full border border-babyPink/40 px-3 py-1 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-babyPink"
>>>>>>> heroku/main
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {isEditing ? (
                                  <form className="mt-3 space-y-3" onSubmit={handleEditReplySubmit}>
                                    <textarea
                                      value={editingReplyForm.body}
                                      onChange={handleEditReplyChange("body")}
<<<<<<< HEAD
                                      className="h-28 w-full rounded-2xl border border-mauve/30 bg-white px-3 py-2 text-sm text-charcoal focus:border-blush focus:outline-none"
=======
                                      className="h-28 w-full rounded-2xl border border-babyBlue/30 bg-white px-3 py-2 text-sm text-blueberry focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
                                      required
                                    />
                                    <input
                                      type="url"
                                      value={editingReplyForm.resourceLink}
                                      onChange={handleEditReplyChange("resourceLink")}
                                      placeholder="https://"
<<<<<<< HEAD
                                      className="w-full rounded-2xl border border-mauve/30 bg-white px-3 py-2 text-sm text-charcoal focus:border-blush focus:outline-none"
=======
                                      className="w-full rounded-2xl border border-babyBlue/30 bg-white px-3 py-2 text-sm text-blueberry focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
                                    />
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="submit"
<<<<<<< HEAD
                                        className="rounded-full bg-mauve px-4 py-2 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-charcoal"
=======
                                        className="rounded-full bg-babyBlue px-4 py-2 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-blueberry"
>>>>>>> heroku/main
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={cancelEditReply}
<<<<<<< HEAD
                                        className="rounded-full border border-blush/40 px-4 py-2 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-mauve"
=======
                                        className="rounded-full border border-babyPink/40 px-4 py-2 text-[0.6rem] font-heading uppercase tracking-[0.3em] text-babyPink"
>>>>>>> heroku/main
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <>
<<<<<<< HEAD
                                    <p className="mt-3 whitespace-pre-wrap text-sm font-body leading-relaxed text-charcoal/80">
=======
                                    <p className="mt-3 whitespace-pre-wrap text-sm font-body leading-relaxed text-darkText/80">
>>>>>>> heroku/main
                                      {reply.body}
                                    </p>
                                    {reply.resourceLink && (
                                      <a
                                        href={reply.resourceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
<<<<<<< HEAD
                                        className="mt-3 inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal underline"
=======
                                        className="mt-3 inline-flex items-center gap-2 text-xs font-heading uppercase tracking-[0.28em] text-blueberry underline"
>>>>>>> heroku/main
                                      >
                                        View shared link
                                      </a>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })
                        )}

                        <form className="space-y-3" onSubmit={handleReplySubmit(thread.id)}>
                          <textarea
                            value={getReplyDraft(thread.id).body}
                            onChange={(event) => updateReplyDraft(thread.id, "body", event.target.value)}
                            placeholder="Add your perspective…"
<<<<<<< HEAD
                            className="h-28 w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
=======
                            className="h-28 w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
                          />
                          <input
                            type="url"
                            value={getReplyDraft(thread.id).resourceLink}
                            onChange={(event) => updateReplyDraft(thread.id, "resourceLink", event.target.value)}
                            placeholder="Optional resource link"
<<<<<<< HEAD
                            className="w-full rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
                          />
                          {replyErrors[thread.id] && (
                            <p className="rounded-2xl border border-blush/50 bg-blush/15 px-4 py-2 text-xs font-body text-mauve">
=======
                            className="w-full rounded-2xl border border-babyBlue/30 bg-white px-4 py-3 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
                          />
                          {replyErrors[thread.id] && (
                            <p className="rounded-2xl border border-babyPink/50 bg-babyPink/15 px-4 py-2 text-xs font-body text-babyPink">
>>>>>>> heroku/main
                              {replyErrors[thread.id]}
                            </p>
                          )}
                          <button
                            type="submit"
<<<<<<< HEAD
                            className="rounded-full bg-blush px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-charcoal shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
=======
                            className="rounded-full bg-babyPink px-5 py-2 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
>>>>>>> heroku/main
                          >
                            Reply
                          </button>
                        </form>
                      </div>
                    )}
                  </footer>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
};

export default CommunityForum;
