import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import api from "../../lib/api";
import EmptyState from "../../components/UI/EmptyState";

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
    <section className="rounded-[2.5rem] border border-pastelPurple/40 bg-white/95 p-8 shadow-soft">
      <header className="space-y-3 border-b border-pastelPurple/40 pb-6 text-center">
        <h1 className="font-heading text-3xl font-semibold text-blueberry sm:text-4xl">Concierge Messages</h1>
        <p className="font-body text-sm text-darkText/70 sm:text-base">
          Chat with your mentor team and Taylor. All notes stay under NDA and live inside your portal.
        </p>
        {mentors.length > 0 && (
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-darkText/50">
            Mentor team: {mentors.map((mentor) => mentor.name).join(", ")}
          </p>
        )}
      </header>

      <div className="mt-10 flex min-h-[360px] flex-col gap-6">
        {loading ? (
          <EmptyState
            title="Loading your conversation…"
            description="We’re gathering every note from your concierge circle."
            icon={SparklesIcon}
          />
        ) : error ? (
          <EmptyState title="We hit a snag" description={error} icon={SparklesIcon} />
        ) : messages.length === 0 ? (
          <EmptyState
            title="Your thread is waiting"
            description="Drop a note below and your concierge will respond within 24 hours."
            icon={SparklesIcon}
          />
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-xl rounded-2xl px-5 py-4 text-sm shadow-soft ring-1 ring-pastelPurple/30 ${
                  clientUser && message.sender_id === clientUser.id
                    ? 'ml-auto bg-babyBlue/20 text-darkText'
                    : 'bg-babyPink/15 text-darkText'
                }`}
              >
                <p className="font-heading text-xs uppercase tracking-[0.3em] text-blueberry/70">{message.sender_name}</p>
                <p className="mt-2 whitespace-pre-line font-body leading-relaxed">{message.body}</p>
                <p className="mt-3 text-[0.6rem] font-body uppercase tracking-[0.3em] text-darkText/40">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <form className="mt-auto space-y-4" onSubmit={handleSubmit}>
          <textarea
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError("");
            }}
            rows={5}
            placeholder="Write a note for your mentor or Taylor"
            className="w-full rounded-2xl border border-pastelPurple/40 bg-white px-5 py-4 font-body text-base text-blueberry focus:border-babyPink focus:outline-none focus:ring-2 focus:ring-babyBlue/30"
          />
          <div className="flex flex-col items-center gap-3 text-xs text-darkText/60 sm:flex-row sm:justify-between">
            <span className="font-body">Response times are typically within 24 hours.</span>
            <button
              type="submit"
              disabled={!body.trim() || sending}
              className={`rounded-full bg-babyPink px-6 py-2 font-heading uppercase tracking-[0.3em] text-blueberry shadow-pop transition ${
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
