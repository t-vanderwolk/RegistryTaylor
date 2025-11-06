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
  getMilestone: (_slug: string) => { index: number; total: number };
};

const AcademyProgressContext = createContext<ContextValue | null>(null);

type AcademyProgressProviderProps = {
  initialProgress: ProgressMap;
  children: ReactNode;
  moduleOrder?: string[];
};

export function AcademyProgressProvider({
  initialProgress,
  children,
  moduleOrder,
}: AcademyProgressProviderProps) {
  const [progress, setProgress] = useState<ProgressMap>(initialProgress);
  const orderedSlugs = useMemo(
    () => moduleOrder ?? Object.keys(initialProgress),
    [moduleOrder, initialProgress]
  );

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
            quizScore: (entry as { quizScore?: number | null }).quizScore ?? null,
            reflection: (entry as { reflection?: string | null }).reflection ?? null,
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
      getMilestone: (_slug: string) => {
        const index = orderedSlugs.indexOf(_slug);
        const total = orderedSlugs.length || 1;
        return {
          index: index >= 0 ? index : 0,
          total,
        };
      },
    }),
    [progress, refresh, setProgressFor, orderedSlugs]
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
