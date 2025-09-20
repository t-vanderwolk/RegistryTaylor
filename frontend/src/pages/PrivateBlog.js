import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const initialFormState = {
  title: "",
  category: "",
  content: "",
};

const PrivateBlog = () => {
  const { token, role, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState(initialFormState);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const canCreate = ["client", "mentor", "admin"].includes(role);
  const canEdit = ["mentor", "admin"].includes(role);
  const canDelete = role === "admin";

  const resetForm = () => {
    setFormValues(initialFormState);
    setFormError("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const fetchPosts = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/v1/private-blog", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error(payload?.error?.message || "Please sign in again to view private posts.");
      }

      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to load posts");
      }

      const postsDataCandidate = (() => {
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.posts)) return payload.posts;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data?.posts)) return payload.data.posts;
        return [];
      })();

      setPosts(postsDataCandidate);
    } catch (err) {
      setError(err.message || "Failed to load private blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formValues.title.trim() || !formValues.category.trim() || !formValues.content.trim()) {
      setFormError("All fields are required.");
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(editingId);
      const endpoint = isEditing ? `/api/v1/private-blog/${editingId}` : "/api/v1/private-blog";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formValues.title.trim(),
          category: formValues.category.trim(),
          content: formValues.content.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error?.message || "Unable to save post");
      }

      resetForm();
      fetchPosts();
    } catch (err) {
      setFormError(err.message || "Unable to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setFormValues({
      title: post.title,
      category: post.category,
      content: post.content,
    });
    setEditingId(post.id);
    setShowForm(true);
    setFormError("");
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    if (!window.confirm("Delete this post?")) return;

    try {
      const response = await fetch(`/api/v1/private-blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error?.message || "Unable to delete post");
      }

      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete post");
    }
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 px-10 py-12 text-center shadow-soft">
          <h1 className="font-playful text-3xl text-blueberry">Private Blog</h1>
          <p className="mt-4 text-sm font-body text-darkText/70">
            You must log in to access the Private Blog.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream/60 min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="rounded-[2.5rem] border border-babyPink/40 bg-white/90 p-8 shadow-soft backdrop-blur-sm">
          <h1 className="font-playful text-4xl text-blueberry">Private Blog</h1>
          <p className="mt-3 text-sm font-body text-darkText/70">
            Exclusive updates curated for our concierge circle. Draft, refine, and share in confidence.
          </p>
          {canCreate && (
            <button
              type="button"
              onClick={() => {
                if (editingId) {
                  resetForm();
                }
                setShowForm((current) => !current);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-babyPink px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy"
            >
              {showForm ? "Close" : "New Post"}
            </button>
          )}
        </header>

        {showForm && canCreate && (
          <section className="rounded-[2.5rem] border border-babyBlue/40 bg-white/90 p-8 shadow-soft backdrop-blur-sm">
            <h2 className="font-heading text-2xl text-blueberry">
              {editingId ? "Edit Post" : "New Post"}
            </h2>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-heading uppercase tracking-[0.25em] text-darkText/60">
                  Title
                </label>
                <input
                  type="text"
                  value={formValues.title}
                  onChange={handleChange("title")}
                  className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white/95 px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                  placeholder="Write a captivating title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-heading uppercase tracking-[0.25em] text-darkText/60">
                  Category
                </label>
                <input
                  type="text"
                  value={formValues.category}
                  onChange={handleChange("category")}
                  className="mt-2 w-full rounded-2xl border border-babyBlue/40 bg-white/95 px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                  placeholder="Registry, Nursery, Lifestyle…"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-heading uppercase tracking-[0.25em] text-darkText/60">
                  Content
                </label>
                <textarea
                  value={formValues.content}
                  onChange={handleChange("content")}
                  className="mt-2 h-40 w-full rounded-2xl border border-babyBlue/40 bg-white/95 px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
                  placeholder="Share your update, insight, or concierge note…"
                  required
                />
              </div>

              {formError && (
                <p className="rounded-2xl border border-babyPink/60 bg-babyPink/20 px-4 py-3 text-sm font-body text-babyPink">
                  {formError}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`rounded-full bg-babyBlue px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition hover:-translate-y-1 hover:shadow-dreamy ${
                    saving ? "cursor-wait opacity-60" : ""
                  }`}
                >
                  {saving ? "Saving…" : editingId ? "Update Post" : "Publish Post"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-babyPink/60 px-6 py-3 text-xs font-heading uppercase tracking-[0.3em] text-babyPink shadow-soft transition hover:-translate-y-1 hover:bg-babyPink/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl text-blueberry">Recent Posts</h2>
            {loading && (
              <span className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">
                Loading…
              </span>
            )}
          </div>

          {error && (
            <div className="rounded-[2rem] border border-babyPink/50 bg-babyPink/20 px-5 py-4 text-sm font-body text-babyPink">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="rounded-[2rem] border border-babyBlue/40 bg-white/90 px-6 py-8 text-center font-body text-darkText/70 shadow-soft">
              No private posts yet. Be the first to share an update!
            </div>
          )}

          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-[2.5rem] border border-babyBlue/30 bg-white/90 p-6 shadow-soft backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-xl text-blueberry">{post.title}</h3>
                    <p className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/50">
                      {post.category || "Uncategorized"}
                    </p>
                  </div>
                  <span className="text-xs font-heading uppercase tracking-[0.3em] text-darkText/40">
                    {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm font-body leading-relaxed text-darkText/80">
                  {post.content}
                </p>

                {(canEdit || canDelete) && (
                  <div className="mt-6 flex items-center gap-3">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        className="rounded-full bg-babyBlue/20 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-blueberry shadow-soft transition hover:-translate-y-1 hover:bg-babyBlue/30"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="rounded-full bg-babyPink/20 px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.28em] text-babyPink shadow-soft transition hover:-translate-y-1 hover:bg-babyPink/30"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default PrivateBlog;
