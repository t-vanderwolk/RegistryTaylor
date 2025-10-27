import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { AcademyModuleProgress, AcademyModuleSummary } from "../components/dashboard/AcademyModuleCard";

export type AcademyModuleChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
  notes?: string | null;
};

export type AcademyModuleDetail = AcademyModuleSummary & {
  lecture: string;
  journalPrompt: string;
  checklist: AcademyModuleChecklistItem[];
};

type UseAcademyModuleOptions = {
  moduleId: string | null;
  userId?: string;
};

type UpdatePayload = {
  exploreCompleted?: boolean;
  lectureCompleted?: boolean;
  applyCompleted?: boolean;
  checklist?: AcademyModuleChecklistItem[];
  journalEntry?: string;
  userId?: string;
};

type UseAcademyModuleResult = {
  module: AcademyModuleDetail | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProgress: (payload: UpdatePayload) => Promise<void>;
};

const useAcademyModule = ({ moduleId, userId }: UseAcademyModuleOptions): UseAcademyModuleResult => {
  const [module, setModule] = useState<AcademyModuleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(moduleId));
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const query: Record<string, unknown> = {};
    if (userId) query.userId = userId;
    return query;
  }, [userId]);

  const fetchModule = useCallback(async () => {
    if (!moduleId) {
      setModule(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/academy/modules/${moduleId}`, { params });
      const payload = response.data?.data;
      if (payload) {
        setModule(payload as AcademyModuleDetail);
      }
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.message || "Unable to load module.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [moduleId, params]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  const updateProgress = useCallback(
    async (payload: UpdatePayload) => {
      if (!moduleId) return;
      setSaving(true);
      setError(null);
      try {
        const response = await api.post(`/api/v1/academy/modules/${moduleId}/progress`, {
          ...payload,
          userId,
        });
        const updated = response.data?.data;
        if (updated) {
          setModule(updated as AcademyModuleDetail);
        }
      } catch (err: any) {
        const message = err?.response?.data?.error?.message || err?.message || "Unable to update progress.";
        setError(message);
      } finally {
        setSaving(false);
      }
    },
    [moduleId, userId]
  );

  return {
    module,
    loading,
    saving,
    error,
    refresh: fetchModule,
    updateProgress,
  };
};

export default useAcademyModule;
