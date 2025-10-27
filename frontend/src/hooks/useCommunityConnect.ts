import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";
import {
  CommunityAnnouncement,
  CommunityEvent,
  MentorProfileMeta,
  MentorSummary,
} from "../components/dashboard/MentorSidebar";

export type CommunityConnectPayload = {
  mentor: MentorSummary | null;
  profile: MentorProfileMeta | null;
  events: CommunityEvent[];
  announcements: CommunityAnnouncement[];
  threads: Array<{
    id: string;
    senderName: string;
    senderRole: string;
    body: string;
    createdAt: string;
  }>;
};

type UseCommunityConnectOptions = {
  userId?: string;
};

type UseCommunityConnectResult = {
  data: CommunityConnectPayload | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const useCommunityConnect = (options: UseCommunityConnectOptions = {}): UseCommunityConnectResult => {
  const [data, setData] = useState<CommunityConnectPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/v1/community/overview", {
        params: options.userId ? { userId: options.userId } : undefined,
      });
      const payload = response.data?.data;
      if (payload) {
        setData(payload as CommunityConnectPayload);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message || err?.message || "Unable to load community updates.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [options.userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};

export default useCommunityConnect;
