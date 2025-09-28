import { useSyncExternalStore } from "react";

const STORAGE_KEY = "tm_private_forum";

const defaultThreads = [
  {
    id: "forum-thread-1",
    title: "Registry wins this week",
    category: "Registry",
    body: "Share items that excited you, retailers with quick shipping, or concierge updates Taylor should know.",
    resourceLink: "",
    createdBy: "mentor",
    createdAt: "2024-09-01T09:00:00.000Z",
    updatedAt: "2024-09-01T09:00:00.000Z",
    replies: [
      {
        id: "forum-reply-1",
        threadId: "forum-thread-1",
        body: "We locked the UppaBaby Vista configuration for the Parker family. Linking the colorway here so everyone is synced.",
        resourceLink: "https://www.uppababy.com/vista-v2/",
        authorRole: "mentor",
        createdAt: "2024-09-01T11:12:00.000Z",
        updatedAt: "2024-09-01T11:12:00.000Z",
      },
    ],
  },
  {
    id: "forum-thread-2",
    title: "Postpartum support ideas",
    category: "Support",
    body: "Drop gentle ideas for helping families settle in those first few weeks—meal train links, scheduling tips, or gifts that landed well.",
    resourceLink: "",
    createdBy: "admin",
    createdAt: "2024-08-24T10:30:00.000Z",
    updatedAt: "2024-08-24T10:30:00.000Z",
    replies: [],
  },
];

const listeners = new Set();

const loadThreads = () => {
  if (typeof window === "undefined") return defaultThreads;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultThreads;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.error("Unable to read forum threads", error);
  }
  return defaultThreads;
};

let threads = loadThreads();

const persist = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error("Unable to save forum threads", error);
  }
};

const emit = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Forum listener error", error);
    }
  });
};

const setThreads = (updater) => {
  const next = typeof updater === "function" ? updater(threads) : updater;
  threads = Array.isArray(next) ? next : [];
  persist();
  emit();
};

const now = () => new Date().toISOString();

const randomId = (prefix) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
};

const addThread = ({ title, category, body, resourceLink, createdBy }) => {
  const timestamp = now();
  const newThread = {
    id: randomId("forum-thread"),
    title: title.trim(),
    category: category.trim(),
    body: body.trim(),
    resourceLink: resourceLink?.trim() || "",
    createdBy,
    createdAt: timestamp,
    updatedAt: timestamp,
    replies: [],
  };
  setThreads((current) => [newThread, ...current]);
  return newThread.id;
};

const updateThread = (id, updates) => {
  const timestamp = now();
  setThreads((current) =>
    current.map((thread) =>
      thread.id === id
        ? {
            ...thread,
            ...updates,
            resourceLink: updates.resourceLink?.trim() || "",
            updatedAt: timestamp,
          }
        : thread,
    ),
  );
};

const deleteThread = (id) => {
  setThreads((current) => current.filter((thread) => thread.id !== id));
};

const addReply = (threadId, { body, resourceLink, authorRole }) => {
  const timestamp = now();
  const reply = {
    id: randomId("forum-reply"),
    threadId,
    body: body.trim(),
    resourceLink: resourceLink?.trim() || "",
    authorRole,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  setThreads((current) =>
    current.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            replies: [...thread.replies, reply],
            updatedAt: timestamp,
          }
        : thread,
    ),
  );
  return reply.id;
};

const updateReply = (threadId, replyId, updates) => {
  const timestamp = now();
  setThreads((current) =>
    current.map((thread) => {
      if (thread.id !== threadId) return thread;
      return {
        ...thread,
        replies: thread.replies.map((reply) =>
          reply.id === replyId
            ? {
                ...reply,
                ...updates,
                resourceLink: updates.resourceLink?.trim() || reply.resourceLink || "",
                updatedAt: timestamp,
              }
            : reply,
        ),
        updatedAt: timestamp,
      };
    }),
  );
};

const deleteReply = (threadId, replyId) => {
  setThreads((current) =>
    current.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            replies: thread.replies.filter((reply) => reply.id !== replyId),
            updatedAt: now(),
          }
        : thread,
    ),
  );
};

export const forumStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => threads,
  addThread,
  updateThread,
  deleteThread,
  addReply,
  updateReply,
  deleteReply,
};

export const useForumStore = () => {
  const threads = useSyncExternalStore(forumStore.subscribe, forumStore.getSnapshot);

  return {
    threads,
    addThread: forumStore.addThread,
    updateThread: forumStore.updateThread,
    deleteThread: forumStore.deleteThread,
    addReply: forumStore.addReply,
    updateReply: forumStore.updateReply,
    deleteReply: forumStore.deleteReply,
  };
};
