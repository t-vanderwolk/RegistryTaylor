"use client";

import type { Dispatch, SetStateAction } from "react";
import type { RegistryCategory } from "@/types/plan";

type CategoryFilterProps = {
  activeCategory: RegistryCategory | null;
  onCategoryChange: Dispatch<SetStateAction<RegistryCategory | null>>;
  babylistActive: boolean;
  onToggleBabylist: () => void;
};

const CATEGORIES: RegistryCategory[] = ["Nursery", "Gear", "Postpartum", "Uncategorized"];

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  babylistActive,
  onToggleBabylist,
}: CategoryFilterProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#C8A1B4]/40 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 shadow-[0_12px_28px_rgba(200,161,180,0.15)]">
      <button
        type="button"
        onClick={() => onCategoryChange(null)}
        className={[
          "rounded-full px-4 py-1 transition",
          activeCategory === null ? "bg-[#C8A1B4] text-white" : "hover:-translate-y-0.5 hover:text-[#C8A1B4]",
        ].join(" ")}
      >
        All
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onCategoryChange((prev) => (prev === category ? null : category))}
          className={[
            "rounded-full px-4 py-1 transition",
            activeCategory === category
              ? "bg-[#C8A1B4] text-white"
              : "hover:-translate-y-0.5 hover:text-[#C8A1B4]",
          ].join(" ")}
        >
          {category}
        </button>
      ))}
      <span className="mx-2 inline-block h-5 w-px bg-[#C8A1B4]/30" aria-hidden="true" />
      <button
        type="button"
        onClick={onToggleBabylist}
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-1 transition",
          babylistActive ? "bg-[#D9C48E] text-[#3E2F35]" : "hover:-translate-y-0.5 hover:text-[#C8A1B4]",
        ].join(" ")}
      >
        Babylist spotlight
      </button>
    </div>
  );
}
