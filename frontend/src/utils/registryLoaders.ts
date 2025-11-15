import AWIN_FEED from "@/data/awin-feed.json" assert { type: "json" };
import CJ_FEED from "@/data/cj-feed.json" assert { type: "json" };
import { buildRegistryItemFromAffiliate } from "@/app/api/registry/affiliate";
import { parsePrice } from "@/lib/server/registryStore";
import { listCatalogItems } from "@/lib/server/registryStore";
import { resolveCategory } from "@/lib/server/registryTaxonomy";
import type { RegistryItem, RegistrySource } from "@/types/registry";

type MacroBabyProduct = {
  id: string;
  title?: string;
  name?: string;
  brand?: string;
  price?: string | number;
  image?: string;
  url?: string;
  category?: string;
  description?: string;
};

async function loadMacroBabyFeed(): Promise<RegistryItem[]> {
  try {
    const response = await fetch("https://www.macrobaby.com/api/products", {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`MacroBaby feed ${response.status}`);
    }

    const payload = await response.json();
    const products = Array.isArray(payload?.products) ? payload.products : payload;
    if (!Array.isArray(products)) {
      return listCatalogItems();
    }

    return products.slice(0, 60).map((product: MacroBabyProduct) =>
      buildRegistryItemFromAffiliate("macro", {
        id: product.id,
        name: product.name ?? product.title ?? "MacroBaby Favorite",
        brand: product.brand ?? "MacroBaby",
        price: product.price,
        image: product.image,
        affiliateUrl: product.url,
        category: product.category,
        description: product.description ?? null,
      })
    );
  } catch {
    return listCatalogItems();
  }
}

export async function loadAffiliateFeed(source: RegistrySource): Promise<RegistryItem[]> {
  switch (source) {
    case "macro":
      return loadMacroBabyFeed();
    case "silvercross":
      return [
        buildRegistryItemFromAffiliate("silvercross", {
          id: "silvercross-london-black",
          name: "London Black Collection Stroller",
          brand: "Silver Cross",
          price: 1299,
          image: "https://silvercrossus.com/wp-content/uploads/2022/12/affiliate-banner.jpg",
          affiliateUrl: "https://silvercrossus.com/product/london-black-collection/",
          category: "Gear Foundations",
          description: "Heritage stroller craftsmanship reborn in a modern travel system.",
        }),
        buildRegistryItemFromAffiliate("silvercross", {
          id: "silvercross-wave-pram",
          name: "Wave Stroller + Bassinet",
          brand: "Silver Cross",
          price: 1599,
          image: "https://silvercrossus.com/wp-content/uploads/2023/03/wave-luxe.jpg",
          affiliateUrl: "https://silvercrossus.com/product/wave-2024/",
          category: "Travel & On-the-Go",
          description: "Boutique pram styling with modular flexibility for luxe adventures.",
        }),
      ];
    case "awin":
      return (AWIN_FEED as Array<Record<string, unknown>>).map((entry) =>
        buildRegistryItemFromAffiliate("awin", {
          id: typeof entry.id === "string" ? entry.id : undefined,
          externalId: typeof entry.externalId === "string" ? entry.externalId : undefined,
          name: String(entry.name ?? "Registry Feature"),
          brand: typeof entry.brand === "string" ? entry.brand : undefined,
          price:
            typeof entry.price === "number" || typeof entry.price === "string"
              ? parsePrice(entry.price)
              : null,
          image: typeof entry.image === "string" ? entry.image : undefined,
          affiliateUrl: typeof entry.affiliateUrl === "string" ? entry.affiliateUrl : undefined,
          category: typeof entry.category === "string" ? entry.category : undefined,
          retailer: typeof entry.retailer === "string" ? entry.retailer : undefined,
          description: typeof entry.description === "string" ? entry.description : undefined,
        })
      );
    case "cj":
      return (CJ_FEED as Array<Record<string, unknown>>).map((entry) =>
        buildRegistryItemFromAffiliate("cj", {
          id: typeof entry.id === "string" ? entry.id : undefined,
          externalId: typeof entry.externalId === "string" ? entry.externalId : undefined,
          name: String(entry.name ?? "Registry Feature"),
          brand: typeof entry.brand === "string" ? entry.brand : undefined,
          price:
            typeof entry.price === "number" || typeof entry.price === "string"
              ? parsePrice(entry.price)
              : null,
          image: typeof entry.image === "string" ? entry.image : undefined,
          affiliateUrl: typeof entry.affiliateUrl === "string" ? entry.affiliateUrl : undefined,
          category: typeof entry.category === "string" ? entry.category : undefined,
          retailer: typeof entry.retailer === "string" ? entry.retailer : undefined,
          description: typeof entry.description === "string" ? entry.description : undefined,
        })
      );
    case "myregistry":
      // MyRegistry data is managed per-user and lives in the database/store.
      return [];
    default:
      return [];
  }
}

export function filterRegistryItems(
  items: RegistryItem[],
  {
    category,
    source,
  }: {
    category?: string | null;
    source?: RegistrySource | RegistrySource[] | null;
  }
): RegistryItem[] {
  const categoryFilter = category ? resolveCategory(category) : null;
  const sourceFilter = Array.isArray(source)
    ? new Set(source)
    : source
      ? new Set<RegistrySource>([source])
      : null;

  return items.filter((item) => {
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesSource = sourceFilter ? sourceFilter.has(item.registrySource) : true;
    return matchesCategory && matchesSource;
  });
}
