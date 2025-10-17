import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";

export interface CommunityReply {
  id: number | string;
  postId: number;
  userId: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  optimistic?: boolean;
}

export interface CommunityPost {
  id: number | string;
  userId: string;
  moduleSlug: string;
  content: string;
  mediaUrl?: string | null;
  mentorReply?: string | null;
  createdAt?: string;
  updatedAt?: string;
  replies: CommunityReply[];
  optimistic?: boolean;
}

type ThreadStatus = "idle" | "loading" | "error" | "success";

const mapReply = (raw: any): CommunityReply => ({
  id: raw.id,
  postId: raw.post_id,
  userId: raw.user_id,
  content: raw.content,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

const mapPost = (raw: any): CommunityPost => ({
  id: raw.id,
  userId: raw.user_id,
  moduleSlug: raw.module_slug,
  content: raw.content,
  mediaUrl: raw.media_url,
  mentorReply: raw.mentor_reply,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  replies: Array.isArray(raw.replies) ? raw.replies.map(mapReply) : [],
});

export const useCommunityThread = (
  moduleSlug: string,
  options: { userId?: string; userName?: string } = {}
) => {
  const userId = options.userId || "user_demo";
  const [status, setStatus] = useState<ThreadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const fetchPosts = useCallback(async () => {
    if (!moduleSlug) return;
    setStatus("loading");
    setError(null);
    try {
      const response = await api.get(`/api/community/${moduleSlug}`);
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setPosts(data.map(mapPost));
      setStatus("success");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Unable to load community posts.");
      setStatus("error");
    }
  }, [moduleSlug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const optimisticUpdate = useCallback((updater: (current: CommunityPost[]) => CommunityPost[]) => {
    setPosts((current) => updater(current));
  }, []);

  const createPost = useCallback(
    async (payload: { content: string; mediaUrl?: string | null }) => {
      if (!moduleSlug) return;
      const tempId = `temp-${Date.now()}`;
      const optimisticPost: CommunityPost = {
        id: tempId,
        userId,
        moduleSlug,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        replies: [],
        optimistic: true,
      };

      optimisticUpdate((current) => [optimisticPost, ...current]);

      try {
        const response = await api.post("/api/community", {
          module_slug: moduleSlug,
          content: payload.content,
          media_url: payload.mediaUrl,
        });
        const saved = mapPost(response.data?.data);
        optimisticUpdate((current) => [saved, ...current.filter((post) => post.id !== tempId)]);
        return saved;
      } catch (err) {
        optimisticUpdate((current) => current.filter((post) => post.id !== tempId));
        throw err;
      }
    },
    [moduleSlug, optimisticUpdate, userId]
  );

  const replyToPost = useCallback(
    async (postId: number | string, content: string) => {
      const tempId = `reply-${Date.now()}`;
      const optimisticReply: CommunityReply = {
        id: tempId,
        postId: Number(postId),
        userId,
        content,
        optimistic: true,
      };

      optimisticUpdate((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, replies: [...post.replies, optimisticReply] }
            : post
        )
      );

      try {
        const response = await api.post(`/api/community/${postId}/replies`, { content });
        const saved = mapReply(response.data?.data);
        optimisticUpdate((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  replies: post.replies.map((reply) =>
                    reply.id === tempId ? saved : reply
                  ),
                }
              : post
          )
        );
        return saved;
      } catch (err) {
        optimisticUpdate((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  replies: post.replies.filter((reply) => reply.id !== tempId),
                }
              : post
          )
        );
        throw err;
      }
    },
    [optimisticUpdate, userId]
  );

  const updateMentorReply = useCallback(
    async (postId: number | string, mentorReply: string) => {
      optimisticUpdate((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, mentorReply } : post
        )
      );

      try {
        const response = await api.patch(`/api/community/${postId}`, { mentor_reply: mentorReply });
        const saved = mapPost(response.data?.data);
        optimisticUpdate((current) =>
          current.map((post) => (post.id === postId ? saved : post))
        );
        return saved;
      } catch (err) {
        await fetchPosts();
        throw err;
      }
    },
    [fetchPosts, optimisticUpdate]
  );

  const orderedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      }),
    [posts]
  );

  return {
    posts: orderedPosts,
    status,
    error,
    createPost,
    replyToPost,
    updateMentorReply,
    refresh: fetchPosts,
  };
};

export default useCommunityThread;
