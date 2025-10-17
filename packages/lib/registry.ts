const CATEGORY_BY_TRACK: Record<string, string[]> = {
  "vision-foundations": ["cribs", "sleep_aids", "feeding_accessories"],
  "sleep-space": ["sleep_aids", "monitors", "cribs"],
  organization: ["cribs", "feeding_accessories", "play_yards"],
  "gear-foundations": ["strollers", "car_seats", "wagons"],
  "travel-mobility": ["strollers", "car_seats", "carriers"],
  "feeding-comfort": ["bottles", "pumps", "feeding_accessories"],
  "safety-monitoring": ["monitors", "sleep_aids", "tubs"],
  "recovery-wellness": ["postpartum", "sleep_aids", "pumps"],
  "support-systems": ["postpartum", "feeding_accessories", "sleep_aids"],
  "mentor-intro": ["postpartum", "sleep_aids", "feeding_accessories"],
};

const CATEGORY_FALLBACK = ["postpartum", "sleep_aids"];

export function categoriesForModule(
  _moduleCode: string,
  trackSlug?: string
): string[] {
  if (trackSlug && CATEGORY_BY_TRACK[trackSlug]) {
    return Array.from(new Set(CATEGORY_BY_TRACK[trackSlug]));
  }
  return [...CATEGORY_FALLBACK];
}
