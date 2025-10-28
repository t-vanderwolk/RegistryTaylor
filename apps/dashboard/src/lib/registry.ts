import items from "@/data/registryItems.json";
import { apiFetch } from "@/lib/apiClient";

export type RegistryItem = {
  id: string;
  name: string;
  brand: string | null;
  price: number | null;
  category: string | null;
  imageUrl: string | null;
  retailer: string | null;
  url: string | null;
  notes: string | null;
};

export type RegistryResponse = {
  items: RegistryItem[];
};

const AFFILIATE_PARAM = "_j";
const AFFILIATE_ID = "4496818";
const fallbackItems = items as Array<{
  id: string;
  name: string;
  brand: string;
  price: string;
  category: string;
  imageUrl: string;
  retailer: string;
  url: string;
  notes: string;
}>;

function withAffiliateParam(url: string): string {
  try {
    const target = new URL(url);
    if (!target.searchParams.has(AFFILIATE_PARAM)) {
      target.searchParams.set(AFFILIATE_PARAM, AFFILIATE_ID);
    }
    return target.toString();
  } catch {
    return url;
  }
}

export async function getRegistryItems(): Promise<RegistryItem[]> {
  try {
    const items = await apiFetch<RegistryItem[]>("/api/registry");
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item) => ({
        ...item,
        url: item.url ? withAffiliateParam(item.url) : item.url,
      }));
    }
  } catch {
    // Fallback to static data below.
  }

  return fallbackItems.map((item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    price: Number(item.price.replace(/[^0-9.]/g, "")) || null,
    category: item.category,
    imageUrl: item.imageUrl,
    retailer: item.retailer,
    url: withAffiliateParam(item.url),
    notes: item.notes,
  }));
}
