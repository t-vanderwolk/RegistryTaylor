import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

const ClientMessages = () => {
  const [mentors, setMentors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const clientUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("tm_user") || "null");
    } catch (parseError) {
      return null;
    }
  }, []);

  const markThreadRead = useCallback(
    async (fetchedMessages) => {
      if (!clientUser) return;
      const unread = fetchedMessages.filter(
        (message) => !message.read && message.sender_id !== clientUser.id
      );
      if (!unread.length) return;
      await Promise.allSettled(
        unread.map((message) => api.patch(`/api/v1/client/messages/${message.id}/read`))
      );
    },
    [clientUser]
  );

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/v1/client/messages");
      const data = response.data?.data || {};
      const fetchedMessages = Array.isArray(data.messages) ? data.messages : [];
      setMentors(Array.isArray(data.mentors) ? data.mentors : []);
      setMessages(fetchedMessages);
      await markThreadRead(fetchedMessages);
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to load messages.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [markThreadRead]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      const response = await api.post("/api/v1/client/messages", { body: body.trim() });
      const newMessage = response.data?.data;
      if (newMessage) {
        setMessages((current) => [...current, newMessage]);
      }
      setBody("");
    } catch (err) {
      const message = err.response?.data?.error?.message || "Unable to send message.";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rounded-[2.5rem] border border-babyPink/30 bg-white/95 p-6 shadow-soft">
      <header className="space-y-2 border-b border-babyPink/30 pb-4">
        <h1 className="font-playful text-3xl text-blueberry">Concierge Messages</h1>
        <p className="text-sm text-darkText/70">
          Chat with your mentor team and Taylor. All notes stay under NDA and live inside your portal.
        </p>
        {mentors.length > 0 && (
          <p className="text-xs uppercase tracking-[0.3em] text-darkText/50">
            Mentor team: {mentors.map((mentor) => mentor.name).join(", ")}
          </p>
        )}
      </header>

      <div className="mt-6 flex min-h-[360px] flex-col gap-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading your conversation…</p>
        ) : error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-500">No messages yet. Send your concierge a note below.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-soft ${
                  clientUser && message.sender_id === clientUser.id
                    ? 'ml-auto bg-babyBlue/25 text-darkText'
                    : 'bg-babyPink/20 text-darkText'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-darkText/60">{message.sender_name}</p>
                <p className="mt-1 whitespace-pre-line">{message.body}</p>
                <p className="mt-2 text-[0.6rem] uppercase tracking-[0.3em] text-darkText/40">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <form className="mt-auto space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError("");
            }}
            rows={4}
            placeholder="Write a note for your mentor or Taylor"
            className="w-full rounded-2xl border border-babyBlue/40 bg-white px-4 py-3 text-sm text-blueberry focus:border-babyPink focus:outline-none"
          />
          <div className="flex items-center justify-between text-xs text-darkText/50">
            <span>Response times are typically within 24 hours.</span>
            <button
              type="submit"
              disabled={!body.trim() || sending}
              className={`rounded-full bg-babyPink px-5 py-2 font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
                !body.trim() || sending ? 'opacity-60' : 'hover:-translate-y-1 hover:shadow-dreamy'
              }`}
            >
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ClientMessages;
