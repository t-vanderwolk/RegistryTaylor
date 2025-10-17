"use client";

import { useRef } from "react";
import { cn } from "../lib/utils";

type LectureCarouselProps = {
  bullets: string[];
  title?: string;
  className?: string;
};

export function LectureCarousel({ bullets, title, className }: LectureCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: "left" | "right") => {
    const node = listRef.current;
    if (!node) return;
    const scrollDistance = node.clientWidth * 0.9;
    node.scrollBy({
      left: direction === "left" ? -scrollDistance : scrollDistance,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "card-surface bg-white/95 px-6 py-7",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="font-heading text-xl text-tmCharcoal">{title ?? "Lecture Highlights"}</h3>
          <p className="text-sm text-tmCharcoal/65">
            Swipe through the Taylor-made touchpoints or use the arrows to explore each insight.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-tmMauve/30 bg-white/80 px-3 py-2 text-sm font-semibold text-tmMauve transition hover:border-tmGold hover:text-tmGold"
            onClick={() => scroll("left")}
          >
            ←
          </button>
          <button
            type="button"
            className="rounded-full border border-tmMauve/30 bg-white/80 px-3 py-2 text-sm font-semibold text-tmMauve transition hover:border-tmGold hover:text-tmGold"
            onClick={() => scroll("right")}
          >
            →
          </button>
        </div>
      </div>
      <ul
        ref={listRef}
        className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
      >
        {bullets.map((bullet, index) => (
          <li
            key={index}
            className="group min-w-[260px] snap-center rounded-2xl bg-tmIvory/80 p-5 shadow-soft transition duration-300 ease-studio hover:-translate-y-1 hover:bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tmBlush/70 font-heading text-lg text-tmMauve">
                {index + 1}
              </span>
              <p className="text-sm font-semibold uppercase tracking-wide text-tmMauve/80">
                Key Insight
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-tmCharcoal/90">
              {bullet}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
