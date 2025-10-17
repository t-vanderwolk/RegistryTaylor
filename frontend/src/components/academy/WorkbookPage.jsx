import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProgressTracker from "./ProgressTracker";
import MentorNotesPanel from "./MentorNotesPanel";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../context/AuthContext";
import useRegistry from "../../hooks/useRegistry";
import * as Dialog from "@radix-ui/react-dialog";

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
  const { user } = useAuth();
  const { addItem: addRegistryItem } = useRegistry(user?.id, { autoLoad: false });
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [registryStatus, setRegistryStatus] = useState("idle");
  const [registryToast, setRegistryToast] = useState(null);
  const [registryForm, setRegistryForm] = useState(() => ({
    moduleId: module?.id || module?.slug || "",
    productName: "",
    brand: "",
    productUrl: "",
    category: module?.content?.journey || "Nursery",
    mentorTag: "",
  }));

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
  useEffect(() => {
    setRegistryForm((prev) => ({
      ...prev,
      category: module?.content?.journey || prev.category || "Nursery",
    }));
  }, [module?.content?.journey]);

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

  useEffect(() => {
    if (!registryToast) return undefined;
    const timer = setTimeout(() => setRegistryToast(null), 3200);
    return () => clearTimeout(timer);
  }, [registryToast]);

  const handleRegistryOpenChange = (open) => {
    setIsRegistryOpen(open);
    if (open) {
      setRegistryForm((prev) => ({
        ...prev,
        moduleId: module?.id || module?.slug || prev.moduleId,
        category: module?.content?.journey || prev.category || "Nursery",
      }));
    } else {
      setRegistryForm((prev) => ({
        ...prev,
        productName: "",
        brand: "",
        productUrl: "",
        mentorTag: "",
      }));
    }
  };

  const handleRegistrySubmit = async (event) => {
    event.preventDefault();
    const moduleIdentifier = registryForm.moduleId || module?.id || module?.slug;
    if (!moduleIdentifier) {
      setRegistryToast({ tone: "error", message: "Module ID missing — cannot save registry item." });
      return;
    }
    if (!registryForm.productName.trim()) {
      setRegistryToast({ tone: "error", message: "Name your item before saving it to the registry." });
      return;
    }

    setRegistryStatus("loading");
    try {
      await addRegistryItem({
        moduleId: String(moduleIdentifier),
        category: registryForm.category,
        productName: registryForm.productName,
        brand: registryForm.brand,
        productUrl: registryForm.productUrl,
        mentorTag: registryForm.mentorTag,
      });
      setRegistryToast({ tone: "success", message: "Added to your registry." });
      setRegistryForm((prev) => ({
        ...prev,
        productName: "",
        brand: "",
        productUrl: "",
        mentorTag: "",
      }));
      setIsRegistryOpen(false);
    } catch (error) {
      setRegistryToast({
        tone: "error",
        message: error.response?.data?.error || error.message || "Unable to save item right now.",
      });
    } finally {
      setRegistryStatus("idle");
    }
  };

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
          <Dialog.Root open={isRegistryOpen} onOpenChange={handleRegistryOpenChange}>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-tmMauve/25 bg-white/90 p-4 shadow-soft">
              <p className="text-xs font-heading uppercase tracking-[0.32em] text-tmMauve">
                Capture this step in your registry
              </p>
              <Dialog.Trigger asChild>
                <Button type="button" variant="primary" size="sm" aria-label="Add this action to registry">
                  + Add to Registry
                </Button>
              </Dialog.Trigger>
            </div>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(90vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-dreamy focus:outline-none">
                <Dialog.Title className="text-lg font-heading text-charcoal">Add to registry</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm font-body text-charcoal/70">
                  Save this module action with a mentor tag or sourcing link.
                </Dialog.Description>
                <form onSubmit={handleRegistrySubmit} className="mt-4 space-y-3">
                  <Input
                    id="registry-module"
                    label="Module reference"
                    helperText="Prefills from the current module — adjust only if you are saving for another module."
                    value={registryForm.moduleId}
                    onChange={(event) =>
                      setRegistryForm((prev) => ({
                        ...prev,
                        moduleId: event.target.value,
                      }))
                    }
                    required
                  />
                  <label className="flex flex-col gap-2 text-xs font-heading uppercase tracking-[0.28em] text-charcoal/60">
                    Journey
                    <select
                      value={registryForm.category}
                      onChange={(event) =>
                        setRegistryForm((prev) => ({
                          ...prev,
                          category: event.target.value,
                        }))
                      }
                      className="rounded-2xl border border-tmMauve/25 bg-white px-4 py-3 text-sm font-body text-charcoal shadow-soft focus:border-tmMauve focus:outline-none focus-visible:ring-2 focus-visible:ring-tmMauve/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      <option value="Nursery">Nursery</option>
                      <option value="Gear">Gear</option>
                      <option value="Postpartum">Postpartum</option>
                    </select>
                  </label>
                  <Input
                    id="registry-product-name"
                    label="Product name"
                    value={registryForm.productName}
                    onChange={(event) =>
                      setRegistryForm((prev) => ({
                        ...prev,
                        productName: event.target.value,
                      }))
                    }
                    placeholder="Feather-light stroller"
                    required
                  />
                  <Input
                    id="registry-brand"
                    label="Brand"
                    value={registryForm.brand}
                    onChange={(event) =>
                      setRegistryForm((prev) => ({
                        ...prev,
                        brand: event.target.value,
                      }))
                    }
                    placeholder="Maison Bébé"
                  />
                  <Input
                    id="registry-url"
                    label="Product link"
                    helperText="Paste the URL — we’ll append the Taylor affiliate ID automatically."
                    value={registryForm.productUrl}
                    onChange={(event) =>
                      setRegistryForm((prev) => ({
                        ...prev,
                        productUrl: event.target.value,
                      }))
                    }
                    placeholder="https://"
                  />
                  <Input
                    id="registry-mentor"
                    label="Mentor tag"
                    helperText="Ping a mentor with @username"
                    value={registryForm.mentorTag}
                    onChange={(event) =>
                      setRegistryForm((prev) => ({
                        ...prev,
                        mentorTag: event.target.value,
                      }))
                    }
                    placeholder="@taylor"
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <Dialog.Close asChild>
                      <Button type="button" variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button type="submit" variant="mauve" size="sm" disabled={registryStatus === "loading"}>
                      {registryStatus === "loading" ? "Saving…" : "Save item"}
                    </Button>
                  </div>
                </form>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          {registryToast && (
            <div
              role="status"
              className={`mt-3 rounded-2xl border px-3 py-2 text-xs font-body ${
                registryToast.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-600"
              }`}
            >
              {registryToast.message}
            </div>
          )}
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
