import type { RegistryCategory } from "@/types/registry";

export const BASE_CATEGORIES: RegistryCategory[] = ["Nursery", "Gear", "Postpartum"];

export const CATEGORY_KEYWORDS: Record<RegistryCategory, string[]> = {
  Nursery: [
    "nursery",
    "sleep",
    "atmosphere",
    "lighting",
    "furniture",
    "space",
    "storage",
    "decor",
    "ambience",
  ],
  Gear: ["gear", "travel", "stroller", "carrier", "on-the-go", "transport", "tech", "monitor"],
  Postpartum: [
    "postpartum",
    "trimester",
    "support",
    "wellness",
    "feeding",
    "care",
    "emotional",
    "parent",
    "recovery",
    "ritual",
  ],
};

export function resolveCategory(input?: string | null): RegistryCategory {
  if (!input) {
    return "Gear";
  }

  const normalised = input.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as Array<[
    RegistryCategory,
    string[],
  ]>) {
    if (keywords.some((keyword) => normalised.includes(keyword))) {
      return category;
    }
  }

  if (normalised.includes("gear")) return "Gear";
  if (normalised.includes("nursery")) return "Nursery";
  if (normalised.includes("support") || normalised.includes("wellness")) return "Postpartum";

  return "Gear";
}
