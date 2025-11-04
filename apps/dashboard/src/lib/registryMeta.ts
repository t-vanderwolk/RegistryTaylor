import type { RegistrySource } from "@/types/registry";

export const REGISTRY_SOURCE_META: Record<
  RegistrySource,
  { label: string; icon: string; retailer: string; badgeColor: string }
> = {
  macro: { label: "MacroBaby", icon: "🛍", retailer: "MacroBaby", badgeColor: "#C8A1B4" },
  silvercross: { label: "Silver Cross", icon: "👶", retailer: "Silver Cross", badgeColor: "#D9C48E" },
  awin: { label: "AWIN", icon: "💎", retailer: "AWIN Partners", badgeColor: "#B89BAC" },
  cj: { label: "CJ Affiliate", icon: "🛒", retailer: "CJ Affiliate", badgeColor: "#C8A1B4" },
  myregistry: { label: "MyRegistry", icon: "🌐", retailer: "MyRegistry", badgeColor: "#3E2F35" },
  babylist: { label: "Babylist", icon: "🍼", retailer: "Babylist", badgeColor: "#EAC9D1" },
  impact: { label: "Impact", icon: "✨", retailer: "Impact Network", badgeColor: "#B0A2B8" },
  static: { label: "Taylor Picks", icon: "🎁", retailer: "Concierge Curated", badgeColor: "#9B8C91" },
};

export function getRegistrySourceMeta(source: RegistrySource) {
  return REGISTRY_SOURCE_META[source] ?? REGISTRY_SOURCE_META.macro;
}
