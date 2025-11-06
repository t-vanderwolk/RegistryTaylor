"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useAcademyProgress } from "@/components/academy/ProgressContext";
import ReflectionSection from "@/components/academy/ReflectionSection";
import QuizBlock from "@/components/academy/QuizBlock";
import type { ModuleProgress } from "@/types/academy";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
};

type QuizPayload = {
  moduleId: string;
  questions: QuizQuestion[];
};

type QuizSubmissionResponse = {
  score: number;
  total: number;
  progress?: {
    percent?: number | null;
    completed?: boolean | null;
    quizScore?: number | null;
  };
};

type ReflectionResponse = {
  reflection: string | null;
  quizScore: number | null;
  percent: number;
  completed: boolean;
  shareWithCommunity?: boolean;
  isAnonymous?: boolean;
};

type InteractiveSectionProps = {
  moduleSlug: string;
  moduleTitle?: string;
};

const AUTO_SAVE_DELAY = 900;

export default function InteractiveSection({ moduleSlug, moduleTitle }: InteractiveSectionProps) {
  const { setProgressFor, progress } = useAcademyProgress();
  const baseProgress = progress[moduleSlug];

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(baseProgress?.quizScore ?? null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [showScoreCelebration, setShowScoreCelebration] = useState(false);

  const [reflection, setReflection] = useState("");
  const [reflectionStatus, setReflectionStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [reflectionError, setReflectionError] = useState<string | null>(null);
  const [shareWithCommunity, setShareWithCommunity] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const hasBootstrapped = useRef(false);
  const skippedInitialSave = useRef(false);
  const pendingSave = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    hasBootstrapped.current = false;
    skippedInitialSave.current = false;

    async function bootstrap() {
      setLoading(true);
      try {
        const [quizRes, reflectionRes] = await Promise.allSettled([
          fetch(`/api/academy/quiz?moduleSlug=${encodeURIComponent(moduleSlug)}`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`/api/academy/reflection?moduleSlug=${encodeURIComponent(moduleSlug)}`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!cancelled && quizRes.status === "fulfilled" && quizRes.value.ok) {
          const payload = (await quizRes.value.json()) as QuizPayload;
          const quizQuestions = payload.questions ?? [];
          setQuestions(quizQuestions);
          setTotalQuestions(quizQuestions.length);
        }

        if (!cancelled && reflectionRes.status === "fulfilled" && reflectionRes.value.ok) {
          const payload = (await reflectionRes.value.json()) as ReflectionResponse;
          setReflection(payload.reflection ?? "");
          setScore((prev) => payload.quizScore ?? prev);
          setShareWithCommunity(Boolean(payload.shareWithCommunity));
          setIsAnonymous(Boolean(payload.isAnonymous));
          updateProgress({
            percentComplete: payload.percent,
            completed: payload.completed,
            quizScore: payload.quizScore,
            reflection: payload.reflection,
          });
        }
      } catch (error) {
        console.error("Unable to bootstrap interactive section", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
          hasBootstrapped.current = true;
        }
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
      if (pendingSave.current) {
        window.clearTimeout(pendingSave.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug]);

  const unanswered = useMemo(() => {
    if (!questions.length) return 0;
    return questions.filter((question) => !answers[question.id]).length;
  }, [questions, answers]);

  const updateProgress = (next: Partial<ModuleProgress>) => {
    const current = progress[moduleSlug];
    setProgressFor(moduleSlug, {
      percentComplete: next.percentComplete ?? current?.percentComplete ?? 0,
      completed: next.completed ?? current?.completed ?? false,
      updatedAt: next.updatedAt ?? current?.updatedAt,
      completedAt: next.completedAt ?? current?.completedAt,
      quizScore: next.quizScore ?? current?.quizScore ?? null,
      reflection: next.reflection ?? current?.reflection ?? null,
    });
  };

  const submitQuiz = async () => {
    if (!questions.length) {
      return;
    }

    setSubmittingQuiz(true);
    setQuizError(null);

    try {
      const response = await fetch("/api/academy/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug,
          responses: answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save quiz results.");
      }

      const payload = (await response.json()) as QuizSubmissionResponse;
      const nextScore = payload.score;
      const nextTotal = payload.total ?? questions.length;
      const current = progress[moduleSlug];

      setScore(nextScore);
      setTotalQuestions(nextTotal);
      setShowScoreCelebration(true);
      window.setTimeout(() => setShowScoreCelebration(false), 1800);

      updateProgress({
        percentComplete: payload.progress?.percent ?? current?.percentComplete ?? 0,
        completed: payload.progress?.completed ?? current?.completed ?? false,
        quizScore: payload.progress?.quizScore ?? nextScore ?? null,
      });
    } catch (error) {
      console.error(error);
      setQuizError("We couldn’t record that attempt. Please try again.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  useEffect(() => {
    if (!hasBootstrapped.current) {
      return;
    }

    if (!skippedInitialSave.current) {
      skippedInitialSave.current = true;
      return;
    }

    if (pendingSave.current) {
      window.clearTimeout(pendingSave.current);
    }

    setReflectionStatus("saving");
    setReflectionError(null);

    pendingSave.current = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/academy/reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleSlug,
            reflection,
            shareWithCommunity,
            shared: shareWithCommunity,
            isAnonymous,
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to save reflection.");
        }

        const payload = (await response.json()) as { reflection: string | null; shareWithCommunity?: boolean; isAnonymous?: boolean };
        setReflectionStatus("saved");
        setShareWithCommunity((currentShare) =>
          payload.shareWithCommunity !== undefined ? Boolean(payload.shareWithCommunity) : currentShare
        );
        setIsAnonymous((currentAnon) =>
          payload.isAnonymous !== undefined ? Boolean(payload.isAnonymous) : currentAnon
        );
        updateProgress({
          reflection: payload.reflection ?? reflection,
        });
        window.setTimeout(() => setReflectionStatus("idle"), 1800);
      } catch (error) {
        console.error(error);
        setReflectionStatus("error");
        setReflectionError("We couldn’t auto-save your reflection. Try again in a moment.");
      }
    }, AUTO_SAVE_DELAY);

    return () => {
      if (pendingSave.current) {
        window.clearTimeout(pendingSave.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflection, shareWithCommunity, isAnonymous, moduleSlug]);

  const handleShareToggle = (share: boolean) => {
    setShareWithCommunity(share);
    if (!share) {
      setIsAnonymous(false);
    }
  };

  const renderQuiz = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`quiz-skeleton-${index}`} className="h-24 animate-pulse rounded-academy bg-ivory/70" />
          ))}
        </div>
      );
    }

    if (!questions.length) {
      return (
        <p className="rounded-academy border border-dashed border-blush-300/80 bg-ivory px-5 py-4 text-sm text-charcoal-400">
          This module is reflective-only for now. Quiz prompts arrive with the next studio drop.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuizBlock
            key={question.id}
            index={index}
            question={question.question}
            options={question.options}
            selected={answers[question.id]}
            onSelect={(option) =>
              setAnswers((current) => ({
                ...current,
                [question.id]: option,
              }))
            }
          />
        ))}
      </div>
    );
  };

  return (
    <motion.section
      className="space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="academy-card space-y-6 p-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-mauve-500/80">Quiz & reflection studio</p>
          <h2 className="font-serif text-2xl text-charcoal-700 md:text-[2.1rem]">
            Check your mastery, then journal it in
          </h2>
          {moduleTitle ? (
            <p className="text-sm text-charcoal-400">
              Module: <span className="font-semibold text-charcoal-600">{moduleTitle}</span>
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-charcoal-300">
              Mentor quiz
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
              Answer each prompt with your best concierge instincts. Submit to reveal your score and nudge this chapter toward completion.
            </p>
          </div>

          {renderQuiz()}

          {quizError ? (
            <p className="rounded-academy border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
              {quizError}
            </p>
          ) : null}

          {questions.length ? (
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={submitQuiz}
                disabled={unanswered > 0 || submittingQuiz}
                className="academy-button px-8"
              >
                {submittingQuiz
                  ? "Scoring…"
                  : unanswered > 0
                  ? `Answer ${unanswered} more`
                  : "Reveal my score"}
              </button>
              <AnimatePresence>
                {score !== null ? (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-sm font-semibold text-charcoal-600"
                  >
                    Score: {score}/{totalQuestions}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          ) : null}

          <AnimatePresence>
            {showScoreCelebration ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-mauve-500/40 bg-blush-200/60 px-4 py-2 text-sm font-semibold text-charcoal-600 shadow-blush-soft"
              >
                <CheckCircle2 className="h-4 w-4 text-mauve-500" aria-hidden />
                <span>Nice work! Answers saved.</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <ReflectionSection
        value={reflection}
        onChange={setReflection}
        status={reflectionStatus}
        error={reflectionError}
        shareWithCommunity={shareWithCommunity}
        onShareToggle={handleShareToggle}
        isAnonymous={isAnonymous}
        onAnonymousToggle={setIsAnonymous}
        helperText="You can share this reflection anonymously or as yourself — both ways help others grow."
        title="Capture the ritual shift this module inspired"
      />
    </motion.section>
  );
}
