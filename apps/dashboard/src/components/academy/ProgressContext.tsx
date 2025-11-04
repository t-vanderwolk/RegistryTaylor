"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ModuleProgress } from "@/types/academy";

type ProgressMap = Record<string, ModuleProgress>;

type ContextValue = {
  progress: ProgressMap;
  setProgressFor: (_slug: string, _next: ModuleProgress) => void;
  refresh: () => Promise<void>;
};

const AcademyProgressContext = createContext<ContextValue | null>(null);

type AcademyProgressProviderProps = {
  initialProgress: ProgressMap;
  children: ReactNode;
};

export function AcademyProgressProvider({ initialProgress, children }: AcademyProgressProviderProps) {
  const [progress, setProgress] = useState<ProgressMap>(initialProgress);

  const setProgressFor = useCallback((slug: string, next: ModuleProgress) => {
    setProgress((current) => ({
      ...current,
      [slug]: next,
    }));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/academy/progress", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        progress:
          | Array<{
              slug: string;
              percentComplete: number;
              completed: boolean;
            }>
          | ModuleProgress;
      };

      if (!data || !Array.isArray(data.progress)) {
        return;
      }

      setProgress(
        data.progress.reduce<ProgressMap>((acc, entry) => {
          acc[entry.slug] = {
            percentComplete: entry.percentComplete ?? 0,
            completed: entry.completed ?? (entry.percentComplete ?? 0) >= 100,
          };
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Failed to refresh academy progress", error);
    }
  }, []);

  const value = useMemo<ContextValue>(
    () => ({
      progress,
      setProgressFor,
      refresh,
    }),
    [progress, refresh, setProgressFor]
  );

  return <AcademyProgressContext.Provider value={value}>{children}</AcademyProgressContext.Provider>;
}

export function useAcademyProgress() {
  const context = useContext(AcademyProgressContext);
  if (!context) {
    throw new Error("useAcademyProgress must be used within AcademyProgressProvider");
  }
  return context;
}
