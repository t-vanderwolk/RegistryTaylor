import React, { useEffect, useRef, useState } from "react";

export function ThreadView({ threadId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const boxRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("tm_token");
        const response = await fetch(`/api/threads/${threadId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = await response.json().catch(() => ({}));
        if (!cancelled) {
          if (response.ok) {
            setMessages(Array.isArray(payload?.data?.messages) ? payload.data.messages : []);
          } else {
            throw new Error(payload?.error || "Unable to load messages.");
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load messages.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (threadId) {
      loadMessages();
    }
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const token = localStorage.getItem("tm_token");
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ threadId, body: text.trim() }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send message.");
      }
      if (payload?.data) {
        setMessages((prev) => [...prev, payload.data]);
      }
      setText("");
    } catch (err) {
      setError(err.message || "Unable to send message.");
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex h-[60vh] flex-col rounded-2xl border border-blush/40 bg-white/85 shadow-soft">
      <div ref={boxRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {loading && <p className="text-sm text-charcoal/60">Loading messages…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-charcoal/60">No messages yet. Say hello!</p>
=======
    <div className="flex h-[60vh] flex-col rounded-2xl border border-babyPink/40 bg-white/85 shadow-soft">
      <div ref={boxRef} className="flex-1 space-y-2 overflow-y-auto p-4">
        {loading && <p className="text-sm text-darkText/60">Loading messages…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-darkText/60">No messages yet. Say hello!</p>
>>>>>>> heroku/main
        )}
        {messages.map((message) => (
          <div
            key={message.id}
<<<<<<< HEAD
            className="max-w-lg rounded-xl bg-mauve/20 px-3 py-2 text-sm text-charcoal/80 shadow-soft"
          >
            <p className="font-semibold text-charcoal">{message.sender_name || "You"}</p>
            <p className="whitespace-pre-line">{message.body}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/40">
=======
            className="max-w-lg rounded-xl bg-babyBlue/20 px-3 py-2 text-sm text-darkText/80 shadow-soft"
          >
            <p className="font-semibold text-blueberry">{message.sender_name || "You"}</p>
            <p className="whitespace-pre-line">{message.body}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-darkText/40">
>>>>>>> heroku/main
              {message.created_at ? new Date(message.created_at).toLocaleString() : ""}
            </p>
          </div>
        ))}
      </div>
<<<<<<< HEAD
      <div className="flex items-center gap-2 border-t border-blush/30 bg-white/80 p-3">
=======
      <div className="flex items-center gap-2 border-t border-babyPink/30 bg-white/80 p-3">
>>>>>>> heroku/main
        <input
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError("");
          }}
<<<<<<< HEAD
          className="flex-1 rounded-xl border border-blush/40 bg-white px-3 py-2 text-sm text-charcoal shadow-inner focus:border-blush focus:outline-none"
=======
          className="flex-1 rounded-xl border border-babyPink/40 bg-white px-3 py-2 text-sm text-blueberry shadow-inner focus:border-babyPink focus:outline-none"
>>>>>>> heroku/main
          placeholder="Write a message…"
        />
        <button
          type="button"
          onClick={sendMessage}
<<<<<<< HEAD
          className="inline-flex items-center justify-center rounded-xl bg-mauve px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
=======
          className="inline-flex items-center justify-center rounded-xl bg-blueberry px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-dreamy"
>>>>>>> heroku/main
        >
          Send
        </button>
      </div>
      {error && <p className="px-4 pb-3 text-sm text-rose-500">{error}</p>}
    </div>
  );
}

export default ThreadView;
