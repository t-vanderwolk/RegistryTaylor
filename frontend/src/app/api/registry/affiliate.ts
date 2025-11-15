import { getRegistrySourceMeta } from "@/lib/registryMeta";
import { resolveCategory } from "@/lib/server/registryTaxonomy";
import type { RegistryItem, RegistrySource } from "@/types/registry";

export function getSourceMeta(source: RegistrySource) {
  return getRegistrySourceMeta(source);
}

export function normalizeAffiliateLink(url: string | null | undefined, source: RegistrySource): string {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    switch (source) {
      case "macro": {
        parsed.searchParams.set("_j", "taylormadebabyco.com");
        break;
      }
      case "silvercross": {
        parsed.searchParams.set("ref", "4762");
        break;
      }
      case "awin": {
        if (!parsed.searchParams.has("awc")) {
          parsed.searchParams.set("awc", "luxury-registry");
        }
        parsed.searchParams.set("clickref", "TaylorMadeBabyCo");
        break;
      }
      case "cj": {
        parsed.searchParams.set("cjevent", "taylormadebabyco_registry");
        break;
      }
      default:
        break;
    }
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    switch (source) {
      case "macro":
        return `${url}${separator}_j=taylormadebabyco.com`;
      case "silvercross":
        return `${url}${separator}ref=4762`;
      case "awin":
        return `${url}${separator}clickref=TaylorMadeBabyCo`;
      case "cj":
        return `${url}${separator}cjevent=taylormadebabyco_registry`;
      default:
        return url;
    }
  }
}

export function buildRegistryItemFromAffiliate(
  source: RegistrySource,
  product: {
    id?: string;
    externalId?: string;
    name: string;
    brand?: string | null;
    price?: number | string | null;
    image?: string | null;
    affiliateUrl?: string | null;
    category?: string | null;
    retailer?: string | null;
    description?: string | null;
  }
): RegistryItem {
  const meta = getSourceMeta(source);
  const priceValue =
    typeof product.price === "string"
      ? Number.parseFloat(product.price.replace(/[^0-9.]/g, "")) || null
      : product.price ?? null;

  const externalId = product.externalId ?? product.id ?? `${source}-${product.name}`;
  const id = `${source}-${externalId}`.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();

  return {
    id,
    name: product.name,
    brand: product.brand ?? meta.retailer,
    price: Number.isFinite(priceValue as number) ? (priceValue as number) : null,
    image: product.image ?? null,
    affiliateUrl: normalizeAffiliateLink(product.affiliateUrl ?? "", source),
    registrySource: source,
    category: resolveCategory(product.category),
    retailer: product.retailer ?? meta.retailer,
    description: product.description ?? null,
    affiliateId: externalId ?? null,
    externalId,
    mentorNote: null,
  };
}
