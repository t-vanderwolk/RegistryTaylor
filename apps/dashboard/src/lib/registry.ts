import { getSession } from "@/lib/auth";
import {
  listCatalogItems,
  listCatalogItemsByFocus,
  listUserRegistryItems,
  addCatalogItemsToUserByFocus,
  addItemsToUserRegistry,
} from "@/lib/server/registryStore";
import { resolveCategory } from "@/lib/server/registryTaxonomy";
import { loadAffiliateFeed } from "@/utils/registryLoaders";
import type { RegistryItem, RegistrySource } from "@/types/registry";

export async function getRegistryItems(): Promise<RegistryItem[]> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return listCatalogItems();
  }
  return listUserRegistryItems(userId);
}

export async function getRegistryItemsByFocus(focus: string): Promise<RegistryItem[]> {
return listCatalogItemsByFocus(resolveCategory(focus));}


export async function addModuleFocusToRegistry(userId: string, focus: string): Promise<RegistryItem[]> {
  const category = resolveCategory(focus);

  try {
    const sources: RegistrySource[] = ["macro", "silvercross"];
    const [macro, silver] = await Promise.all(sources.map((source) => loadAffiliateFeed(source)));

    const curated = [...macro, ...silver].filter((item) => item.category === category).slice(0, 6);

    if (curated.length > 0) {
      return addItemsToUserRegistry(userId, curated);
    }
  } catch {
    // Fall back to catalog assignment below.
  }

  return addCatalogItemsToUserByFocus(userId, focus);
}
