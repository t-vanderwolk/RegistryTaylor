import { normalizeAffiliateLink } from "@/app/api/registry/affiliate";
import registrySource from "@/data/registryItems.json";
import { BASE_CATEGORIES, resolveCategory } from "@/lib/server/registryTaxonomy";
import type { RegistryCategory, RegistryItem, RegistryNote, RegistrySource } from "@/types/registry";

type RawRegistryItem = {
  id: string;
  name: string;
  brand?: string | null;
  price?: string | number | null;
  category?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  retailer?: string | null;
  notes?: string | null;
};

type RegistryStore = {
  userItems: Map<string, Map<string, RegistryItem>>;
  notes: Map<string, Map<string, RegistryNote>>;
  myRegistryTokens: Map<string, { token: string; username?: string | null; connectedAt: string }>;
};

type GlobalWithRegistry = typeof globalThis & {
  __tmbcRegistryStore__?: RegistryStore;
};

const AFFILIATE_QUERY = "_j=taylormadebabyco.com";

const registryCatalog: RegistryItem[] = (registrySource as RawRegistryItem[]).map((item) => {
  const category = resolveCategory(item.category);
  return {
    id: item.id,
    name: item.name,
    brand: item.brand ?? "Taylor Concierge",
    price: parsePrice(item.price),
    category,
    image: item.imageUrl ?? null,
    affiliateUrl: appendAffiliateTag(item.url),
    registrySource: "macro",
    retailer: item.retailer ?? "MacroBaby",
    description: item.notes ?? null,
    affiliateId: null,
    externalId: item.id,
    mentorNote: null,
  };
});

function getStore(): RegistryStore {
  const globalRef = globalThis as GlobalWithRegistry;
  if (!globalRef.__tmbcRegistryStore__) {
    globalRef.__tmbcRegistryStore__ = {
      userItems: new Map(),
      notes: new Map(),
      myRegistryTokens: new Map(),
    };
  }
  return globalRef.__tmbcRegistryStore__;
}

function appendAffiliateTag(url?: string | null): string {
  if (!url) {
    return "";
  }
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("_j")) {
      parsed.searchParams.set("_j", "taylormadebabyco.com");
    } else if (parsed.searchParams.get("_j") !== "taylormadebabyco.com") {
      parsed.searchParams.set("_j", "taylormadebabyco.com");
    }
    return parsed.toString();
  } catch {
    const anchorIndex = url.indexOf("#");
    const hasAnchor = anchorIndex !== -1;
    const base = hasAnchor ? url.slice(0, anchorIndex) : url;
    if (base.includes("_j=")) {
      return url;
    }
    const separator = base.includes("?") ? "&" : "?";
    const affiliate = `${base}${separator}${AFFILIATE_QUERY}`;
    return hasAnchor ? `${affiliate}${url.slice(anchorIndex)}` : affiliate;
  }
}

function parsePrice(value?: string | number | null): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.]/g, "");
    if (!cleaned) {
      return null;
    }
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function cloneItem(item: RegistryItem): RegistryItem {
  return { ...item };
}

function getUserItemMap(userId: string): Map<string, RegistryItem> {
  const store = getStore();
  let map = store.userItems.get(userId);
  if (!map) {
    map = new Map();
    store.userItems.set(userId, map);
  }
  if (map.size === 0) {
    seedUserItems(userId, map);
  }
  return map;
}

function seedUserItems(userId: string, map: Map<string, RegistryItem>) {
  const seeded: RegistryItem[] = [];
  for (const category of BASE_CATEGORIES) {
    const picks = registryCatalog.filter((item) => item.category === category).slice(0, 3);
    picks.forEach((item) => seeded.push(cloneItem(item)));
  }
  seeded.forEach((item) => {
    map.set(item.id, item);
  });
  const store = getStore();
  if (!store.notes.has(userId)) {
    store.notes.set(userId, new Map());
  }
}

export function listCatalogItems(): RegistryItem[] {
  return registryCatalog.map(cloneItem);
}

export function listCatalogItemsByCategory(category: RegistryCategory): RegistryItem[] {
  return registryCatalog.filter((item) => item.category === category).map(cloneItem);
}

export function listCatalogItemsByFocus(focus: string): RegistryItem[] {
  const category = resolveCategory(focus);
  return listCatalogItemsByCategory(category);
}

export function listUserRegistryItems(userId: string): RegistryItem[] {
  const map = getUserItemMap(userId);
  const notes = getStore().notes.get(userId);
  return Array.from(map.values()).map((item) => {
    const note = notes?.get(item.id)?.note ?? null;
    return {
      ...item,
      mentorNote: note,
    };
  });
}

export function addItemsToUserRegistry(userId: string, items: RegistryItem[]): RegistryItem[] {
  const map = getUserItemMap(userId);
  applyAffiliateRules(items).forEach((item) => {
    map.set(item.id, {
      ...item,
      mentorNote: map.get(item.id)?.mentorNote ?? item.mentorNote ?? null,
    });
  });
  return listUserRegistryItems(userId);
}

export function addCatalogItemsToUserByFocus(userId: string, focus: string): RegistryItem[] {
  const items = listCatalogItemsByFocus(focus);
  return addItemsToUserRegistry(
    userId,
    items.map(cloneItem)
  );
}

export function upsertRegistryNote(userId: string, productId: string, note: string): RegistryNote | null {
  const store = getStore();
  let userNotes = store.notes.get(userId);
  if (!userNotes) {
    userNotes = new Map();
    store.notes.set(userId, userNotes);
  }

  const trimmed = note.trim();
  const map = getUserItemMap(userId);
  const existingItem = map.get(productId);

  if (!trimmed) {
    userNotes.delete(productId);
    if (existingItem) {
      map.set(productId, { ...existingItem, mentorNote: null });
    }
    return null;
  }

  const now = new Date().toISOString();
  const existing = userNotes.get(productId);
  const entry: RegistryNote = {
    id: existing?.id ?? `${userId}-${productId}`,
    userId,
    productId,
    note: trimmed,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  userNotes.set(productId, entry);

  if (existingItem) {
    map.set(productId, { ...existingItem, mentorNote: trimmed });
  }

  return entry;
}

export function getRegistryNote(userId: string, productId: string): RegistryNote | null {
  const notes = getStore().notes.get(userId);
  return notes?.get(productId) ?? null;
}

export function listRegistryNotesForUser(userId: string): RegistryNote[] {
  const notes = getStore().notes.get(userId);
  if (!notes) {
    return [];
  }
  return Array.from(notes.values()).map((note) => ({ ...note }));
}

function buildItemId(source: RegistrySource, externalId: string | undefined, name: string): string {
  const base = externalId?.toLowerCase().replace(/[^a-z0-9]/g, "-");
  if (base && base !== "-") {
    return `${source}-${base}`;
  }
  return `${source}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).slice(2, 6)}`;
}

export function saveMyRegistryConnection(userId: string, token: string, username?: string | null) {
  const store = getStore();
  store.myRegistryTokens.set(userId, {
    token,
    username: username ?? null,
    connectedAt: new Date().toISOString(),
  });
}

export function getMyRegistryConnection(userId: string) {
  return getStore().myRegistryTokens.get(userId) ?? null;
}

type MyRegistryItemInput = {
  externalId: string;
  name: string;
  brand?: string | null;
  price?: number | string | null;
  image?: string | null;
  link?: string | null;
  category?: string | null;
};

export function upsertMyRegistryItems(userId: string, items: MyRegistryItemInput[]): RegistryItem[] {
  const mapped: RegistryItem[] = items.map((entry) => {
    const id = buildItemId("myregistry", entry.externalId, entry.name);
    return {
      id,
      name: entry.name,
      brand: entry.brand ?? "MyRegistry",
      price: parsePrice(entry.price),
      image: entry.image ?? null,
      affiliateUrl: normalizeAffiliateLink(entry.link ?? "", "myregistry"),
      registrySource: "myregistry",
      category: resolveCategory(entry.category),
      retailer: "MyRegistry",
      description: null,
      affiliateId: entry.externalId ?? null,
      externalId: entry.externalId ?? null,
      mentorNote: null,
    };
  });
  return addItemsToUserRegistry(userId, mapped);
}

export function applyAffiliateRules(items: RegistryItem[]): RegistryItem[] {
  return items.map((item) => ({
    ...item,
    affiliateUrl: normalizeAffiliateLink(item.affiliateUrl, item.registrySource),
  }));
}

export function mergeAffiliateFeeds(userId: string | null, affiliateItems: RegistryItem[]): RegistryItem[] {
  if (!userId) {
    return applyAffiliateRules(affiliateItems);
  }
  const personal = listUserRegistryItems(userId);
  const seen = new Set(personal.map((item) => item.id));
  const normalized = applyAffiliateRules(affiliateItems);
  const merged = [...personal];
  normalized.forEach((item) => {
    if (!seen.has(item.id)) {
      merged.push(item);
    }
  });
  return merged;
}
