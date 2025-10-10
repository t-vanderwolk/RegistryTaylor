import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProgressTracker from "./ProgressTracker";
import MentorNotesPanel from "./MentorNotesPanel";

const normalizeArray = (value, length) => {
  if (!Array.isArray(value)) return Array.from({ length }, () => "");
  const padded = [...value];
  while (padded.length < length) {
    padded.push("");
  }
  return padded.slice(0, length);
};

const extractJournalAnswer = (responses) =>
  responses?.journal_answer ??
  responses?.journalAnswer ??
  responses?.user_answer ??
  responses?.userAnswer ??
  "";

const computeProgress = (reflectPrompts, reflectDrafts, journalPrompt, journalDraft) => {
  const totalReflect = reflectPrompts.length;
  const hasJournal = journalPrompt ? 1 : 0;
  const total = totalReflect + hasJournal;

  if (total === 0) {
    return {
      completed: 0,
      total,
      percent: 0,
    };
  }

  const reflectCompleted = reflectDrafts.filter((answer) => answer && String(answer).trim().length > 0).length;
  const journalCompleted = journalPrompt && journalDraft && journalDraft.trim().length > 0 ? 1 : 0;
  const completed = Math.min(reflectCompleted, totalReflect) + journalCompleted;
  const percent = Math.round((completed / total) * 100);

  return { completed, total, percent };
};

const WorkbookPage = ({
  module,
  entry,
  onSave,
  isSaving,
  mentorMode = false,
  onMentorNotes,
  menteeName = "",
  progress,
}) => {
  const reflectPrompts = useMemo(() => {
    if (!module?.content?.reflect) return [];
    return Array.isArray(module.content.reflect) ? module.content.reflect : [];
  }, [module?.content]);

  const journalPrompt = module?.content?.journal_prompt || "";

  const initialResponses = entry?.responses || {};
  const [reflectDrafts, setReflectDrafts] = useState(() =>
    normalizeArray(initialResponses.reflectAnswers || initialResponses.reflect, reflectPrompts.length)
  );
  const [journalDraft, setJournalDraft] = useState(() => extractJournalAnswer(initialResponses));

  const autosaveTimers = useRef({});

  useEffect(() => {
    setReflectDrafts(
      normalizeArray(
        entry?.responses?.reflectAnswers || entry?.responses?.reflect,
        reflectPrompts.length
      )
    );
    setJournalDraft(extractJournalAnswer(entry?.responses));
  }, [module?.id, entry?.id, entry?.responses, reflectPrompts.length]);

  useEffect(() => () => {
    Object.values(autosaveTimers.current).forEach((timer) => clearTimeout(timer));
    autosaveTimers.current = {};
  }, []);

  const triggerAutosave = useCallback(
    (nextReflectDrafts, nextJournalDraft) => {
      if (!onSave || !module?.id) return;

      const key = module.id;

      if (autosaveTimers.current[key]) {
        clearTimeout(autosaveTimers.current[key]);
      }

      autosaveTimers.current[key] = setTimeout(async () => {
        const stats = computeProgress(reflectPrompts, nextReflectDrafts, journalPrompt, nextJournalDraft);
        try {
          await onSave({
            moduleId: module.id,
            responses: {
              reflectAnswers: nextReflectDrafts,
              journal_answer: nextJournalDraft,
              progress: stats.percent / 100,
            },
          });
        } catch {
          // errors bubbled via hook
        }
      }, 800);
    },
    [module?.id, onSave, reflectPrompts, journalPrompt]
  );

  const handleReflectChange = useCallback(
    (index, value) => {
      setReflectDrafts((current) => {
        const next = [...current];
        next[index] = value;
        triggerAutosave(next, journalDraft);
        return next;
      });
    },
    [journalDraft, triggerAutosave]
  );

  const handleJournalChange = useCallback(
    (value) => {
      setJournalDraft(value);
      triggerAutosave(reflectDrafts, value);
    },
    [reflectDrafts, triggerAutosave]
  );

  const stats = useMemo(() => {
    const baseStats = computeProgress(reflectPrompts, reflectDrafts, journalPrompt, journalDraft);
    if (progress) {
      return {
        percent: progress.percent ?? baseStats.percent,
        completedPrompts: progress.completedPrompts ?? baseStats.completed,
        totalPrompts: progress.totalPrompts ?? baseStats.total,
      };
    }
    return {
      percent: module?.progress ?? baseStats.percent,
      completedPrompts: module?.completedPrompts ?? baseStats.completed,
      totalPrompts: module?.totalPrompts ?? baseStats.total,
    };
  }, [reflectPrompts, reflectDrafts, journalPrompt, journalDraft, progress, module]);

  const isModuleSaving = isSaving ? isSaving(module?.id) : false;

  const reflectionSummaries = useMemo(() => {
    return reflectPrompts
      .map((prompt, index) => ({
        prompt,
        response: reflectDrafts[index],
      }))
      .filter((item) => item.response && item.response.trim().length > 0)
      .slice(0, 4);
  }, [reflectPrompts, reflectDrafts]);

  const mentorNotesSaving = isSaving && entry?.id ? isSaving(entry.id) : false;

  return (
    <div className="space-y-8 rounded-[2.5rem] border border-charcoal/10 bg-white/90 p-6 shadow-soft backdrop-blur-sm md:p-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-heading uppercase tracking-[0.32em] text-mauve/80">
            {module?.section || "Taylor-Made Academy"}
          </p>
          <h1 className="font-playful text-3xl text-charcoal">{module?.title}</h1>
          {module?.content?.overview && (
            <p className="mt-2 max-w-2xl text-sm font-body text-charcoal/70">{module.content.overview}</p>
          )}
          {mentorMode && menteeName && (
            <p className="mt-1 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/50">
              Viewing {menteeName}&rsquo;s workbook
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ProgressTracker value={stats.percent} label="Complete" />
          </div>
          <div className="flex flex-col text-right text-xs font-heading uppercase tracking-[0.28em] text-charcoal/50">
            <span>{stats.percent}% complete</span>
            <span>
              {stats.completedPrompts}/{stats.totalPrompts} reflections
            </span>
          </div>
        </div>
      </header>

      {Array.isArray(module?.content?.objectives) && module.content.objectives.length > 0 && (
        <section className="rounded-[2rem] border border-ivory/80 bg-ivory/60 px-5 py-4">
          <h2 className="text-sm font-heading uppercase tracking-[0.32em] text-charcoal/70">You will</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {module.content.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-3 text-sm font-body text-charcoal/70">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mauve" aria-hidden />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-6">
        {reflectPrompts.map((prompt, index) => (
          <article
            key={`${module?.id || "module"}-reflect-${index}`}
            className="space-y-4 rounded-[2rem] border border-charcoal/10 bg-ivory/60 p-5 shadow-inner"
          >
            <header className="space-y-1">
              <p className="text-[0.65rem] font-heading uppercase tracking-[0.32em] text-mauve/70">
                Reflection {index + 1}
              </p>
              <h3 className="font-serif text-lg text-charcoal">{prompt}</h3>
            </header>
            <textarea
              className="min-h-[140px] w-full rounded-3xl border border-mauve/30 bg-white/80 px-4 py-3 text-sm font-body text-charcoal shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/20"
              value={reflectDrafts[index] ?? ""}
              onChange={(event) => handleReflectChange(index, event.target.value)}
              placeholder="Capture how this module resonates with your family story..."
            />
          </article>
        ))}
      </section>

      {journalPrompt && (
        <section className="space-y-3 rounded-[2rem] border border-charcoal/10 bg-ivory/60 p-5 shadow-inner">
          <header className="space-y-1">
            <p className="text-[0.65rem] font-heading uppercase tracking-[0.32em] text-mauve/70">Journal Prompt</p>
            <h3 className="font-serif text-lg text-charcoal">{journalPrompt}</h3>
          </header>
          <textarea
            className="min-h-[160px] w-full rounded-3xl border border-mauve/30 bg-white/80 px-4 py-3 text-sm font-body text-charcoal shadow-inner focus:border-mauve focus:outline-none focus:ring-2 focus:ring-mauve/20"
            value={journalDraft}
            onChange={(event) => handleJournalChange(event.target.value)}
            placeholder="Let your concierge reflections flow here..."
          />
          <div className="flex items-center justify-between text-[0.65rem] font-heading uppercase tracking-[0.32em] text-charcoal/40">
            <span>{isModuleSaving ? "Saving…" : "Auto-save ready"}</span>
            {entry?.updated_at && (
              <time dateTime={entry.updated_at}>
                {new Date(entry.updated_at).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            )}
          </div>
        </section>
      )}

      {module?.content?.apply && (
        <section className="rounded-[2rem] border border-gold/20 bg-gold/10 px-5 py-4">
          <h2 className="text-sm font-heading uppercase tracking-[0.32em] text-gold/90">Apply</h2>
          <ul className="mt-3 space-y-2 text-sm font-body text-charcoal/70">
            {(Array.isArray(module.content.apply) ? module.content.apply : [module.content.apply]).map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1 w-1 rounded-full bg-mauve" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mentorMode && entry && (
        <MentorNotesPanel
          entry={entry}
          onSave={(notes) => (onMentorNotes && entry?.id ? onMentorNotes(entry.id, notes) : undefined)}
          isSaving={mentorNotesSaving}
        />
      )}

      {reflectionSummaries.length > 0 && (
        <section className="rounded-[2rem] border border-gold/20 bg-gold/10 px-5 py-4">
          <h2 className="text-sm font-heading uppercase tracking-[0.32em] text-gold/90">Reflection Summary</h2>
          <ul className="mt-3 space-y-2">
            {reflectionSummaries.map((item) => (
              <li key={item.prompt} className="space-y-1 text-sm font-body text-charcoal/80">
                <p className="font-semibold text-charcoal">{item.prompt}</p>
                <p className="text-charcoal/70">{item.response.trim().slice(0, 160)}{item.response.length > 160 ? "…" : ""}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default WorkbookPage;
