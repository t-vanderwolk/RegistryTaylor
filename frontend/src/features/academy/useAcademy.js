import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../lib/api";

const buildAsyncState = (overrides = {}) => ({
  status: "idle",
  data: null,
  error: null,
  ...overrides,
});

const normalizeError = (error) => {
  if (!error) return "Unexpected error";
  if (error.response?.data?.error?.message) return error.response.data.error.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return "Unexpected error";
};

const extractReflectAnswers = (responses) => {
  if (!responses) return [];
  if (Array.isArray(responses.reflectAnswers)) return responses.reflectAnswers;
  if (Array.isArray(responses.reflect)) return responses.reflect;
  if (Array.isArray(responses.answers)) return responses.answers;
  return [];
};

const extractJournalAnswer = (responses) => {
  if (!responses) return "";
  return (
    responses.journal_answer ??
    responses.journalAnswer ??
    responses.user_answer ??
    responses.userAnswer ??
    responses.journal_prompt_answer ??
    responses.journalPromptAnswer ??
    ""
  );
};

const normalizeProgressValue = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  if (value <= 1) {
    return Math.round(Math.max(0, Math.min(1, value)) * 100);
  }
  return Math.round(Math.max(0, Math.min(100, value)));
};

const computeLocalProgress = (module, responses) => {
  if (!module) return null;
  let safeResponses = responses;
  if (!safeResponses) {
    safeResponses = {};
  } else if (typeof safeResponses === "string") {
    try {
      safeResponses = JSON.parse(safeResponses);
    } catch {
      safeResponses = {};
    }
  }
  const reflectCount = Array.isArray(module.content?.reflect) ? module.content.reflect.length : 0;
  const hasJournal = module.content?.journal_prompt ? 1 : 0;
  const total = reflectCount + hasJournal;

  if (total === 0) {
    const progressOverride = normalizeProgressValue(safeResponses?.progress ?? safeResponses?.percent);
    return progressOverride !== null
      ? { percent: progressOverride, completedPrompts: 0, totalPrompts: 0 }
      : null;
  }

  const reflectAnswers = extractReflectAnswers(safeResponses).filter((answer) =>
    answer && String(answer).trim().length > 0
  );
  const journalAnswer = extractJournalAnswer(safeResponses);

  const completed =
    Math.min(reflectAnswers.length, reflectCount) +
    (journalAnswer && journalAnswer.trim().length > 0 && hasJournal ? 1 : 0);

  const basePercent = Math.round((completed / total) * 100);
  const progressOverride = normalizeProgressValue(safeResponses?.progress ?? safeResponses?.percent);

  return {
    percent: progressOverride !== null ? Math.max(progressOverride, basePercent) : basePercent,
    completedPrompts: completed,
    totalPrompts: total,
  };
};

const defaultModuleState = () => ({
  module: null,
  entry: null,
  progress: null,
});

const useAcademy = ({ autoLoad = true, initialMenteeId = null } = {}) => {
  const [selectedMenteeId, setSelectedMenteeId] = useState(initialMenteeId);
  const [modulesState, setModulesState] = useState(() => buildAsyncState({ data: [] }));
  const [moduleState, setModuleState] = useState(() => buildAsyncState({ data: defaultModuleState() }));
  const [menteesState, setMenteesState] = useState(() => buildAsyncState({ data: [] }));
  const [savingMap, setSavingMap] = useState({});

  const lastLoadedModuleRef = useRef(null);

  const loadModules = useCallback(
    async (menteeIdOverride = undefined) => {
      const menteeId = menteeIdOverride ?? selectedMenteeId ?? undefined;
      setModulesState((state) => buildAsyncState({ ...state, status: "loading" }));

      try {
        const response = await api.get("/api/v1/academy/modules", {
          params: menteeId ? { menteeId } : undefined,
        });
        setModulesState(
          buildAsyncState({
            status: "success",
            data: response.data?.data ?? [],
          })
        );
      } catch (error) {
        setModulesState(
          buildAsyncState({
            status: "error",
            error: normalizeError(error),
            data: [],
          })
        );
      }
    },
    [selectedMenteeId]
  );

  const loadModule = useCallback(
    async (moduleId, menteeIdOverride = undefined) => {
      if (!moduleId) return;
      const menteeId = menteeIdOverride ?? selectedMenteeId ?? undefined;
      lastLoadedModuleRef.current = moduleId;

      setModuleState(() =>
        buildAsyncState({
          status: "loading",
          data: defaultModuleState(),
        })
      );

      try {
        const response = await api.get(`/api/v1/academy/modules/${moduleId}`, {
          params: menteeId ? { menteeId } : undefined,
        });

        const payload = response.data?.data ?? {};
        setModuleState(
          buildAsyncState({
            status: "success",
            data: {
              module: payload.module ?? null,
              entry: payload.workbookEntry ?? null,
              progress: payload.progress ?? null,
            },
          })
        );
      } catch (error) {
        setModuleState(
          buildAsyncState({
            status: "error",
            error: normalizeError(error),
            data: defaultModuleState(),
          })
        );
      }
    },
    [selectedMenteeId]
  );

  const saveWorkbookEntry = useCallback(
    async ({ moduleId, responses, mentorNotes }) => {
      if (!moduleId) return null;
      setSavingMap((state) => ({ ...state, [moduleId]: true }));

      try {
        const payload = {
          moduleId,
        };

        if (responses !== undefined) {
          payload.responses = responses;
        }

        if (mentorNotes !== undefined) {
          payload.mentorNotes = mentorNotes;
        }

        const response = await api.post("/api/v1/academy/workbook", payload);
        const entry = response.data?.data ?? null;

        setModuleState((state) => {
          if (state.status !== "success") return state;
          const moduleRef = state.data.module;
          const computedProgress =
            moduleRef && entry
              ? computeLocalProgress(moduleRef, entry.responses)
              : state.data.progress;
          return buildAsyncState({
            status: "success",
            data: {
              module: moduleRef,
              entry,
              progress: computedProgress,
            },
          });
        });

        if (lastLoadedModuleRef.current === moduleId) {
          loadModules();
        }

        return entry;
      } catch (error) {
        throw new Error(normalizeError(error));
      } finally {
        setSavingMap((state) => {
          const next = { ...state };
          delete next[moduleId];
          return next;
        });
      }
    },
    [loadModules]
  );

  const updateMentorNotes = useCallback(async ({ entryId, mentorNotes }) => {
    if (!entryId) return null;
    setSavingMap((state) => ({ ...state, [entryId]: true }));

    try {
      const response = await api.patch(`/api/v1/academy/workbook/${entryId}/mentor-notes`, {
        mentorNotes,
      });
      const entry = response.data?.data ?? null;

      setModuleState((state) => {
        if (state.status !== "success") return state;
        if (!state.data.entry || state.data.entry.id !== entryId) return state;
        const moduleRef = state.data.module;
        const computedProgress =
          moduleRef && entry ? computeLocalProgress(moduleRef, entry.responses) : state.data.progress;
        return buildAsyncState({
          status: "success",
          data: {
            module: moduleRef,
            entry,
            progress: computedProgress,
          },
        });
      });

      return entry;
    } catch (error) {
      throw new Error(normalizeError(error));
    } finally {
      setSavingMap((state) => {
        const next = { ...state };
        delete next[entryId];
        return next;
      });
    }
  }, []);

  const loadMentees = useCallback(async () => {
    setMenteesState((state) => buildAsyncState({ ...state, status: "loading" }));
    try {
      const response = await api.get("/api/v1/academy/mentees");
      setMenteesState(
        buildAsyncState({
          status: "success",
          data: response.data?.data ?? [],
        })
      );
    } catch (error) {
      setMenteesState(
        buildAsyncState({
          status: "error",
          error: normalizeError(error),
          data: [],
        })
      );
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadModules();
    }
  }, [autoLoad, loadModules, selectedMenteeId]);

  const isSaving = useCallback(
    (key) => Boolean(savingMap[key]),
    [savingMap]
  );

  const moduleProgress = useMemo(() => {
    if (moduleState.status !== "success") return null;
    return moduleState.data.progress;
  }, [moduleState]);

  return {
    modulesState,
    moduleState,
    moduleProgress,
    menteesState,
    isSaving,
    selectedMenteeId,
    setSelectedMenteeId,
    loadModules,
    loadModule,
    loadMentees,
    saveWorkbookEntry,
    updateMentorNotes,
  };
};

export default useAcademy;
