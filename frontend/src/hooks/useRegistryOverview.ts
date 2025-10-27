import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { RegistryProduct } from "../components/dashboard/RegistryCard";

export type MemberRegistryItem = RegistryProduct & {
  status: "wishlist" | "shortlist" | "ordered" | "arriving" | "fulfilled";
  quantity: number;
};

export type RegistryOverview = {
  unlocked: boolean;
  totalCore: number;
  completedCore: number;
  items: MemberRegistryItem[];
  suggestions: RegistryProduct[];
  macroBaby: RegistryProduct[];
};

type UseRegistryOverviewOptions = {
  userId?: string;
};

type UseRegistryOverviewResult = {
  overview: RegistryOverview | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (payload: Partial<MemberRegistryItem> & { title: string }) => Promise<void>;
  updateItem: (id: string, payload: Partial<MemberRegistryItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
};

const useRegistryOverview = (options: UseRegistryOverviewOptions = {}): UseRegistryOverviewResult => {
  const [overview, setOverview] = useState<RegistryOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const query: Record<string, unknown> = {};
    if (options.userId) query.userId = options.userId;
    return query;
  }, [options.userId]);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/v1/registry/overview", { params });
      const payload = response.data?.data;
      if (payload) {
        setOverview(payload as RegistryOverview);
      }
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.message || "Unable to load registry.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const addItem = useCallback(
    async (payload: Partial<MemberRegistryItem> & { title: string }) => {
      setError(null);
      try {
        await api.post("/api/v1/registry/items", {
          ...payload,
          userId: options.userId,
        });
        await fetchOverview();
      } catch (err: any) {
        const message = err?.response?.data?.error?.message || err?.message || "Unable to add registry item.";
        setError(message);
        throw err;
      }
    },
    [fetchOverview, options.userId]
  );

  const updateItem = useCallback(
    async (id: string, payload: Partial<MemberRegistryItem>) => {
      setError(null);
      try {
        await api.patch(`/api/v1/registry/items/${id}`, payload);
        await fetchOverview();
      } catch (err: any) {
        const message =
          err?.response?.data?.error?.message || err?.message || "Unable to update registry item.";
        setError(message);
        throw err;
      }
    },
    [fetchOverview]
  );

  const removeItem = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await api.delete(`/api/v1/registry/items/${id}`);
        await fetchOverview();
      } catch (err: any) {
        const message =
          err?.response?.data?.error?.message || err?.message || "Unable to remove registry item.";
        setError(message);
        throw err;
      }
    },
    [fetchOverview]
  );

  return {
    overview,
    loading,
    error,
    refresh: fetchOverview,
    addItem,
    updateItem,
    removeItem,
  };
};

export default useRegistryOverview;
