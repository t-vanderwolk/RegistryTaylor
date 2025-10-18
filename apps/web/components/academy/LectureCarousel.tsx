"use client";

import { AnimatePresence, motion } from "framer-motion";
import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../../lib/api";
import type { AffiliateProduct, LectureSlide, LectureSlideDetail } from "../../lib/types";
import { cn } from "../../lib/utils";

type LectureCarouselProps = {
  moduleCode: string;
  slides: LectureSlide[];
  title?: string;
  className?: string;
  onRegistryChange?: () => void;
};

const FALLBACK_INTERACTIVE = {
  prompt: "How ready do you feel to apply this insight?",
  options: ["Already practicing", "Trying this next", "Need mentor guidance"],
} as const;

const FALLBACK_TAKEAWAY =
  "Jot this moment down so your dashboard can surface the right Taylor-made support.";

const STORAGE_PREFIX = "tmba:lecture-responses:";

export function LectureCarousel({
  moduleCode,
  slides,
  title = "Lecture Highlights",
  className,
  onRegistryChange,
}: LectureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [suggestions, setSuggestions] = useState<AffiliateProduct[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [registryStatus, setRegistryStatus] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const storageKey = useMemo(() => `${STORAGE_PREFIX}${moduleCode}`, [moduleCode]);
  const hasHydratedResponses = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const clampIndex = useCallback(
    (index: number) => {
      if (slides.length === 0) return 0;
      return Math.max(0, Math.min(index, slides.length - 1));
    },
    [slides.length]
  );

  const goToIndex = useCallback(
    (next: number) => {
      setActiveIndex(clampIndex(next));
    },
    [clampIndex]
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName)) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToIndex(activeIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToIndex(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKey as unknown as EventListener);
    return () => window.removeEventListener("keydown", handleKey as unknown as EventListener);
  }, [activeIndex, goToIndex]);

  const dots = useMemo(
    () =>
      slides.map((_slide, index) => (
        <button
          key={`dot-${index}`}
          type="button"
          aria-label={`Go to insight ${index + 1}`}
          aria-pressed={activeIndex === index}
          onClick={() => goToIndex(index)}
          className={cn(
            "h-2.5 w-2.5 rounded-full bg-tmBlush transition duration-200",
            activeIndex === index && "scale-110 bg-tmMauve shadow-soft"
          )}
        />
      )),
    [activeIndex, slides, goToIndex]
  );

  const toggleDetail = useCallback((index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, unknown>;
        const sanitized = Object.entries(parsed).reduce<Record<number, string>>(
          (acc, [key, value]) => {
            const numericKey = Number(key);
            if (!Number.isNaN(numericKey) && typeof value === "string") {
              acc[numericKey] = value;
            }
            return acc;
          },
          {}
        );
        setResponses(sanitized);
      } else {
        setResponses({});
      }
    } catch (error) {
      console.error("Unable to restore lecture responses", error);
      setResponses({});
    } finally {
      hasHydratedResponses.current = true;
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedResponses.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(responses));
    } catch (error) {
      console.error("Unable to persist lecture responses", error);
    }
  }, [responses, storageKey]);

  useEffect(() => {
    if (slides.length === 0) return;
    setSuggestionsLoading(true);
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/registry/suggestions?module=${encodeURIComponent(moduleCode)}&slide=${activeIndex}`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          setSuggestions([]);
          return;
        }
        const json = await response.json();
        if (json?.success) {
          setSuggestions(json.data ?? []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error("Unable to load registry suggestions", error);
        }
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [activeIndex, moduleCode, slides.length]);

  const handleAddToRegistry = useCallback(
    async (productId: string) => {
      try {
        setRegistryStatus("Adding…");
        const response = await fetch(`${API_BASE}/api/registry/add`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ affiliate_product_id: productId }),
        });
        if (!response.ok) {
          throw new Error("Unable to add item");
        }
        const json = await response.json();
        if (!json.success) {
          throw new Error(json.error ?? "Unable to add item");
        }
        setRegistryStatus("Added to registry");
        onRegistryChange?.();
        window.setTimeout(() => setRegistryStatus(null), 1600);
      } catch (error) {
        console.error("Add to registry failed", error);
        setRegistryStatus("Unable to add right now");
        window.setTimeout(() => setRegistryStatus(null), 2000);
      }
    },
    [onRegistryChange]
  );

  const safeIndex = slides.length === 0 ? 0 : clampIndex(activeIndex);
  const activeSlide = slides.length === 0 ? null : slides[safeIndex];
  const isExpanded = !!expanded[safeIndex];
  const normalizedDetail = useMemo(() => {
    const rawDetail = activeSlide?.detail as unknown;
    if (!rawDetail) return null;
    if (typeof rawDetail === "string") {
      return {
        educational: rawDetail,
        interactive: {
          prompt: FALLBACK_INTERACTIVE.prompt,
          options: [...FALLBACK_INTERACTIVE.options],
        },
        takeaway: FALLBACK_TAKEAWAY,
      } satisfies LectureSlideDetail;
    }
    return rawDetail as LectureSlideDetail;
  }, [activeSlide]);

  const handleOptionSelect = useCallback((slideIndex: number, option: string) => {
    setResponses((prev) => ({
      ...prev,
      [slideIndex]: option,
    }));
    setExpanded((prev) => {
      if (prev[slideIndex]) return prev;
      return {
        ...prev,
        [slideIndex]: true,
      };
    });
  }, []);

  if (!activeSlide) {
    return (
      <section
        className={cn(
          "rounded-3xl border border-tmBlush/60 bg-white/95 px-6 py-7 text-center shadow-soft",
          className
        )}
      >
        <p className="font-display text-xl text-tmMauve">Taylor-made insights arriving soon.</p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "space-y-6 rounded-3xl border border-tmBlush/60 bg-white/95 px-6 py-7 shadow-soft",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-display text-2xl text-tmMauve">{title}</p>
          <p className="text-sm text-tmCharcoal/65">
            Navigate at your own pace—one Taylor-made insight at a time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToIndex(activeIndex - 1)}
            aria-label="View previous insight"
            className="rounded-full border border-tmMauve/40 bg-tmBlush/80 px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => goToIndex(activeIndex + 1)}
            aria-label="View next insight"
            className="rounded-full border border-tmMauve/40 bg-tmBlush/80 px-4 py-2 text-sm font-semibold text-tmMauve transition duration-200 hover:border-tmGold hover:text-tmGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
          >
            Next
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-[28px] bg-tmIvory p-8 shadow-md md:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={safeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tmBlush/80 font-heading text-lg text-tmMauve shadow-inner">
                  {safeIndex + 1}
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tmMauve/70">
                  Taylor-made insight
                </p>
              </div>
              <p className="mt-6 text-xl font-heading text-tmCharcoal md:text-2xl">
                {activeSlide.text}
              </p>
              {normalizedDetail && (
                <>
                  <button
                    type="button"
                    onClick={() => toggleDetail(safeIndex)}
                    aria-expanded={isExpanded}
                    aria-controls={`insight-detail-${safeIndex}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-tmMauve transition-colors hover:text-tmGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
                  >
                    {isExpanded ? "▲ Hide Insight" : "▼ Learn More"}
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`insight-detail-${safeIndex}`}
                        key={`detail-${safeIndex}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
                        className="mt-6 overflow-hidden"
                      >
                        <div className="rounded-xl border border-tmBlush/60 bg-tmIvory p-6 text-sm text-tmCharcoal shadow-soft transition-all duration-300 ease-out md:p-7">
                          <p className="text-base font-semibold text-tmMauve">Educational Insight</p>
                          <p className="mt-2 leading-relaxed text-tmCharcoal/80">
                            {normalizedDetail.educational}
                          </p>
                          <div className="mt-5 space-y-3">
                            <p className="text-sm font-semibold text-tmMauve">
                              {normalizedDetail.interactive.prompt}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {normalizedDetail.interactive.options.map((option) => {
                                const isSelected = responses[safeIndex] === option;
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleOptionSelect(safeIndex, option)}
                                    aria-pressed={isSelected}
                                    className={cn(
                                      "rounded-full border border-tmBlush/60 bg-white/85 px-4 py-2 text-sm font-semibold text-tmMauve transition-all duration-300 ease-out shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory",
                                      isSelected
                                        ? "border-tmMauve bg-tmMauve text-tmIvory shadow-soft"
                                        : "hover:border-tmGold hover:text-tmGold"
                                    )}
                                  >
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <AnimatePresence initial={false}>
                            {responses[safeIndex] && (
                              <motion.div
                                key={`takeaway-${safeIndex}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{
                                  duration: prefersReducedMotion ? 0 : 0.25,
                                  ease: "easeOut",
                                }}
                                className="mt-5 rounded-lg border border-tmBlush/50 bg-white/95 p-4 text-sm text-tmMauve shadow-inner"
                                aria-live="polite"
                              >
                                <p>{normalizedDetail.takeaway}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              <div className="mt-8 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tmMauve/70">
                  Registry suggestions
                </p>
                {suggestionsLoading ? (
                  <p className="text-sm text-tmCharcoal/60">Curating suggestions…</p>
                ) : suggestions.length === 0 ? (
                  <p className="text-sm text-tmCharcoal/60">Add mentor-approved pieces as you go.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-2xl border border-tmBlush/60 bg-white/90 p-4 text-sm text-tmCharcoal shadow-inner"
                      >
                        <p className="font-semibold text-tmCharcoal">
                          {product.brand} · {product.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-tmMauve/70">
                          {product.category}
                        </p>
                        <a
                          href={product.product_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-tmMauve transition hover:text-tmGold"
                        >
                          View on MacroBaby →
                        </a>
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center justify-center rounded-full border border-tmMauve/40 bg-tmBlush/70 px-3 py-1 text-xs font-semibold text-tmMauve transition hover:border-tmGold hover:text-tmGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tmGold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-tmIvory"
                          onClick={() => handleAddToRegistry(product.id)}
                        >
                          Add to Registry
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {registryStatus && (
                  <p className="text-xs text-tmCharcoal/60">{registryStatus}</p>
                )}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">{dots}</div>
      </div>
    </section>
  );
}
