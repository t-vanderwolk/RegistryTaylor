"use client";

import type { RegistryCategory } from "@/types/registry";

type CategoryFilterProps = {
  activeCategory: RegistryCategory | null;
  onCategoryChange: (category: RegistryCategory | null) => void;
  babylistActive?: boolean;
  onToggleBabylist?: () => void;
};

const CATEGORY_TABS: Array<{ label: string; value: RegistryCategory | null }> = [
  { label: "All", value: null },
  { label: "Nursery", value: "Nursery" },
  { label: "Gear", value: "Gear" },
  { label: "Postpartum", value: "Postpartum" },
  { label: "Uncategorized", value: "Uncategorized" },
];

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  babylistActive,
  onToggleBabylist,
}: CategoryFilterProps) {
  return (
    <div className="inline-flex flex-wrap gap-2 rounded-full border border-[#C8A1B4]/40 bg-[#FFFAF8] p-1 shadow-sm">
      {CATEGORY_TABS.map((tab) => {
        const isActive = activeCategory === tab.value;
        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onCategoryChange(isActive ? null : tab.value)}
            className={[
              "rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8A1B4]",
              isActive
                ? "bg-[#C8A1B4] text-[#FFFAF8] shadow-[0_10px_24px_rgba(200,161,180,0.18)]"
                : "text-[#3E2F35] hover:-translate-y-0.5 hover:bg-[#EAC9D1]/20",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
      {onToggleBabylist ? (
        <button
          type="button"
          onClick={onToggleBabylist}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C8A1B4] ${
            babylistActive
              ? "bg-[#EAC9D1] text-[#3E2F35] shadow-[0_10px_24px_rgba(200,161,180,0.18)]"
              : "text-[#3E2F35] hover:-translate-y-0.5 hover:bg-[#EAC9D1]/20"
          }`}
        >
          Babylist
        </button>
      ) : null}
    </div>
  );
}
