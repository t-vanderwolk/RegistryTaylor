import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { AcademyModuleSummary } from "../components/dashboard/AcademyModuleCard";

type UseAcademyModulesOptions = {
  limit?: number;
  userId?: string;
};

type UseAcademyModulesResult = {
  modules: AcademyModuleSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const useAcademyModules = (options: UseAcademyModulesOptions = {}): UseAcademyModulesResult => {
  const [modules, setModules] = useState<AcademyModuleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const query: Record<string, unknown> = {};
    if (options.limit) query.limit = options.limit;
    if (options.userId) query.userId = options.userId;
    return query;
  }, [options.limit, options.userId]);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/v1/academy/modules", { params });
      const payload = Array.isArray(response.data?.data) ? response.data.data : [];
      setModules(payload as AcademyModuleSummary[]);
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.message || "Unable to load academy modules.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, loading, error, refresh: fetchModules };
};

export default useAcademyModules;
