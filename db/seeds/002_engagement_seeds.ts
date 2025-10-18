import { Knex } from "knex";

const ACHIEVEMENTS = [
  {
    code: "VISION_COMPLETE",
    title: "Visionary Curator",
    description: "Completed every module in the Vision & Foundations track.",
    icon_svg:
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" stroke="#7A5968" stroke-width="4" fill="#EED8DF"/><path d="M20 34l8 8 16-20" stroke="#7A5968" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    code: "SLEEP_SPACE_SERIES",
    title: "Sleep Sanctuary",
    description: "Completed the full Sleep & Space track with confidence.",
    icon_svg:
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="22" width="40" height="28" rx="6" stroke="#7A5968" stroke-width="4" fill="#FAF7F4"/><path d="M20 30h8m8 0h8" stroke="#7A5968" stroke-width="4" stroke-linecap="round"/><path d="M20 38h24" stroke="#7A5968" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    code: "POSTPARTUM_READY",
    title: "Postpartum Ready",
    description: "Curated care systems to welcome the fourth trimester.",
    icon_svg:
      '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="24" r="10" stroke="#7A5968" stroke-width="4" fill="#FAF7F4"/><path d="M18 48c2-8 8-12 14-12s12 4 14 12" stroke="#7A5968" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
];

const INSIGHT_MAP = [
  {
    module_code: "sleep-space-setup",
    slide_idx: 0,
    categories: ["crib", "mattress"],
  },
  {
    module_code: "sleep-space-setup",
    slide_idx: 3,
    categories: ["monitor", "cord-management"],
  },
  {
    module_code: "sound-light-safety",
    slide_idx: 1,
    categories: ["night-light", "bulb-2700k"],
  },
  {
    module_code: "sound-light-safety",
    slide_idx: 2,
    categories: ["cord-cover", "outlet-cover"],
  },
  {
    module_code: "calm-care-routine",
    slide_idx: 0,
    categories: ["diaper-station", "organizer"],
  },
  {
    module_code: "comfort-care-stations",
    slide_idx: 1,
    categories: ["storage-basket", "drawer-label"],
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("reflection_shares").del();
  await knex("mentor_feedback").del();
  await knex("reflections").del();
  await knex("user_achievements").del();
  await knex("achievements").del();
  await knex("insight_registry_map").del();

  await knex("achievements").insert(ACHIEVEMENTS);

  await knex("insight_registry_map").insert(
    INSIGHT_MAP.map(({ module_code, slide_idx, categories }) => ({
      module_code,
      slide_idx,
      categories,
    }))
  );

  // Optional mentor demo user hint (no direct insert to users here to avoid overriding real data)
}
