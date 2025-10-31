import type { RegistrySource } from "@/types/registry";

export const REGISTRY_SOURCE_META: Record<
  RegistrySource,
  { label: string; icon: string; retailer: string }
> = {
  macro: { label: "MacroBaby", icon: "🛍", retailer: "MacroBaby" },
  silvercross: { label: "Silver Cross", icon: "👶", retailer: "Silver Cross" },
  awin: { label: "AWIN", icon: "💎", retailer: "AWIN Partners" },
  cj: { label: "CJ Affiliate", icon: "🛒", retailer: "CJ Affiliate" },
  myregistry: { label: "MyRegistry", icon: "🌐", retailer: "MyRegistry" },
};

export function getRegistrySourceMeta(source: RegistrySource) {
  return REGISTRY_SOURCE_META[source] ?? REGISTRY_SOURCE_META.macro;
}
