import { randomUUID } from "node:crypto";
import axios, { type AxiosRequestConfig } from "axios";
import { normalizeAffiliateLink } from "@/app/api/registry/affiliate";
import registrySource from "@/data/registryItems.json";
import { API_URL } from "@/lib/apiClient";
import { getSession } from "@/lib/auth";
import { resolveCategory } from "@/lib/server/registryTaxonomy";
import type {
  RegistryCategory,
  RegistryItem as AppRegistryItem,
  RegistryNote as AppRegistryNote,
  RegistrySource,
} from "@/types/registry";

// ----------------------------------------------------
// Connection Store (for MyRegistry & Babylist)
// ----------------------------------------------------
type RegistryConnectionStore = {
  myRegistryTokens: Map<string, { token: string; username?: string | null; connectedAt: string }>;
  babylistConnections: Map<string, { username: string; syncedAt: string }>;
};
type GlobalWithStores = typeof globalThis & { __tmbcRegistryConnections__?: RegistryConnectionStore };

const globalRef = globalThis as GlobalWithStores;
function getConnectionStore(): RegistryConnectionStore {
  if (!globalRef.__tmbcRegistryConnections__) {
    globalRef.__tmbcRegistryConnections__ = {
      myRegistryTokens: new Map(),
      babylistConnections: new Map(),
    };
  }
  return globalRef.__tmbcRegistryConnections__;
}

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
const AFFILIATE_QUERY = "_j=taylormadebabyco.com";

type RegistryMentorNoteRecord = {
  id: string;
  registryItemId: string;
  mentorId?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
};

type RegistryItemRecord = {
  id: string;
  userId: string;
  name: string;
  brand?: string | null;
  price?: number | string | null;
  category?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  retailer?: string | null;
  notes?: string | null;
  source?: RegistrySource;
  affiliateUrl?: string | null;
  affiliateId?: string | null;
  externalId?: string | null;
  importedFrom?: string | null;
  mentorNotes: RegistryMentorNoteRecord[];
};

type RegistryCatalogRecord = {
  id: string;
  externalId?: string | null;
  title: string;
  brand?: string | null;
  retailer?: string | null;
  category?: string | null;
  price?: number | string | null;
  image?: string | null;
  url?: string | null;
  affiliateUrl?: string | null;
  source: RegistrySource;
};

type RegistryNoteRecord = {
  id: string;
  registryItemId: string;
  mentorId?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  registryItem: {
    userId: string;
  };
};

async function registryRequest<T>(
  config: AxiosRequestConfig,
  { requireAuth = true }: { requireAuth?: boolean } = {}
): Promise<T> {
  const session = await getSession();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(config.headers as Record<string, string>),
  };

  if (config.data !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (requireAuth) {
    if (!session?.token) {
      throw new Error("Not authenticated");
    }
    headers.Authorization = `Bearer ${session.token}`;
  } else if (session?.token && !headers.Authorization) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await axios({
    baseURL: API_URL,
    withCredentials: true,
    ...config,
    headers,
  });

  return response.data as T;
}

function appendAffiliateTag(url?: string | null): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.get("_j") !== "taylormadebabyco.com") {
      parsed.searchParams.set("_j", "taylormadebabyco.com");
    }
    return parsed.toString();
  } catch {
    const base = url.split("#")[0];
    if (base.includes("_j=")) return url;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}${AFFILIATE_QUERY}`;
  }
}

export function parsePrice(value?: string | number | null): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.]/g, "");
    if (!cleaned) return null;
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function cloneItem(item: AppRegistryItem): AppRegistryItem {
  return { ...item };
}

// ----------------------------------------------------
// Registry Catalog (Static Seeds)
// ----------------------------------------------------
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

const registryCatalog: AppRegistryItem[] = (registrySource as RawRegistryItem[]).map((item) => ({
  id: item.id,
  name: item.name,
  brand: item.brand ?? "Taylor Concierge",
  price: parsePrice(item.price),
  category: resolveCategory(item.category),
  image: item.imageUrl ?? null,
  affiliateUrl: appendAffiliateTag(item.url),
  registrySource: "macro",
  retailer: item.retailer ?? "MacroBaby",
  description: item.notes ?? null,
  affiliateId: null,
  externalId: item.id,
  importedFrom: item.url ?? null,
  url: item.url ?? null,
  mentorNote: null,
}));

// ----------------------------------------------------
// Mappers
// ----------------------------------------------------
function toAppRegistryItem(record: RegistryItemRecord): AppRegistryItem {
  const mentorNotes = Array.isArray(record.mentorNotes) ? record.mentorNotes : [];
  const latestNote =
    mentorNotes.length > 0
      ? mentorNotes.reduce((a, b) =>
          new Date(b.updatedAt ?? 0).getTime() > new Date(a.updatedAt ?? 0).getTime() ? b : a
        )
      : null;

  return {
    id: record.id,
    name: record.name,
    brand: record.brand ?? record.retailer ?? "Taylor Concierge",
    price: parsePrice(record.price),
    category: resolveCategory(record.category),
    image: record.imageUrl ?? null,
    affiliateUrl: record.affiliateUrl ?? record.url ?? "",
    registrySource: (record.source ?? "static") as RegistrySource,
    retailer: record.retailer ?? null,
    description: record.notes ?? null,
    affiliateId: record.affiliateId ?? null,
    externalId: record.externalId ?? null,
    importedFrom: record.importedFrom ?? null,
    url: record.url ?? null,
    mentorNote: latestNote?.content ?? null,
  };
}

function toAppRegistryNote(record: RegistryNoteRecord): AppRegistryNote {
  const createdAt = new Date(record.createdAt ?? Date.now()).toISOString();
  const updatedAt = new Date(record.updatedAt ?? record.createdAt ?? Date.now()).toISOString();

  return {
    id: record.id,
    userId: record.registryItem.userId,
    productId: record.registryItemId,
    mentorId: record.mentorId ?? undefined,
    note: record.content ?? "",
    createdAt,
    updatedAt,
  };
}

// ----------------------------------------------------
// Core Registry Logic
// ----------------------------------------------------
export async function listUserRegistryItems(userId: string): Promise<AppRegistryItem[]> {
  const data = await registryRequest<{ items: RegistryItemRecord[] }>({
    method: "GET",
    url: "/registry/entry",
    params: { userId },
  });
  return data.items.map(toAppRegistryItem);
}

export async function getRegistryItems(userId: string): Promise<AppRegistryItem[]> {
  return listUserRegistryItems(userId);
}

export async function getCatalogItems() {
  const data = await registryRequest<{ items: RegistryCatalogRecord[] }>(
    {
      method: "GET",
      url: "/registry/catalog",
    },
    { requireAuth: false }
  );
  return data.items;
}

export async function addRegistryItem(input: {
  userId: string;
  name: string;
  brand?: string | null;
  price?: number | null;
  url?: string | null;
  retailer?: string | null;
  category?: string | null;
  image?: string | null;
  description?: string | null;
  affiliateUrl?: string | null;
  affiliateId?: string | null;
  externalId?: string | null;
  source?: RegistrySource;
}): Promise<AppRegistryItem> {
  const payload = {
    name: input.name,
    brand: input.brand ?? null,
    price: input.price ?? null,
    category: input.category ?? null,
    imageUrl: input.image ?? null,
    url: input.url ?? null,
    retailer: input.retailer ?? null,
    notes: input.description ?? null,
    source: input.source ?? "static",
    affiliateUrl: input.affiliateUrl ?? input.url ?? null,
    affiliateId: input.affiliateId ?? input.externalId ?? null,
    externalId: input.externalId ?? input.url ?? randomUUID(),
    importedFrom: input.url ?? null,
  };

  const { item } = await registryRequest<{ item: RegistryItemRecord }>({
    method: "POST",
    url: "/registry/entry",
    data: {
      userId: input.userId,
      item: payload,
    },
  });

  return toAppRegistryItem(item);
}

export async function updateRegistryItem(id: string, data: Partial<AppRegistryItem>): Promise<AppRegistryItem> {
  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.brand !== undefined) payload.brand = data.brand ?? null;
  if (data.price !== undefined) payload.price = data.price ?? null;
  if (data.category !== undefined) payload.category = data.category ?? null;
  if (data.image !== undefined) payload.image = data.image ?? null;
  if (data.url !== undefined) payload.url = data.url ?? null;
  if (data.retailer !== undefined) payload.retailer = data.retailer ?? null;
  if (data.description !== undefined) payload.description = data.description ?? null;
  if (data.affiliateUrl !== undefined) payload.affiliateUrl = data.affiliateUrl ?? null;
  if (data.affiliateId !== undefined) payload.affiliateId = data.affiliateId ?? null;

  const { item } = await registryRequest<{ item: RegistryItemRecord }>({
    method: "PUT",
    url: `/registry/entry/${id}`,
    data: payload,
  });

  return toAppRegistryItem(item);
}

export async function deleteRegistryItem(id: string): Promise<void> {
  await registryRequest({
    method: "DELETE",
    url: `/registry/entry/${id}`,
  });
}

// ----------------------------------------------------
// Registry Connections
// ----------------------------------------------------
export function saveMyRegistryConnection(userId: string, token: string, username?: string | null) {
  const store = getConnectionStore();
  store.myRegistryTokens.set(userId, { token, username: username ?? null, connectedAt: new Date().toISOString() });
}

export function getMyRegistryConnection(userId: string) {
  return getConnectionStore().myRegistryTokens.get(userId) ?? null;
}

export function saveBabylistConnection(userId: string, username: string) {
  const store = getConnectionStore();
  store.babylistConnections.set(userId, { username, syncedAt: new Date().toISOString() });
}

export function getBabylistConnection(userId: string) {
  return getConnectionStore().babylistConnections.get(userId) ?? null;
}

// ----------------------------------------------------
// External Sync + Merge
// ----------------------------------------------------
export async function upsertMyRegistryItems(
  userId: string,
  items: { externalId: string; name: string; brand?: string | null; price?: number | string | null; image?: string | null; link?: string | null; category?: string | null }[]
): Promise<AppRegistryItem[]> {
  const mapped: AppRegistryItem[] = items.map((entry) => ({
    id: entry.externalId ?? entry.name.trim().toLowerCase(),
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
    externalId: entry.externalId ?? entry.name,
    importedFrom: entry.link ?? null,
    url: entry.link ?? null,
    mentorNote: null,
  }));
  return addItemsToUserRegistry(userId, mapped);
}

export async function upsertBabylistItems(
  userId: string,
  items: { externalId: string; name: string; brand?: string | null; price?: number | string | null; image?: string | null; link?: string | null; category?: string | null }[],
  username: string
): Promise<AppRegistryItem[]> {
  const mapped: AppRegistryItem[] = items.map((entry) => ({
    id: entry.externalId ?? entry.name.trim().toLowerCase(),
    name: entry.name,
    brand: entry.brand ?? "Babylist",
    price: parsePrice(entry.price),
    image: entry.image ?? null,
    affiliateUrl: normalizeAffiliateLink(entry.link ?? "", "babylist"),
    registrySource: "babylist",
    category: resolveCategory(entry.category ?? "Uncategorized"),
    retailer: "Babylist",
    description: null,
    affiliateId: entry.externalId ?? null,
    externalId: entry.externalId ?? entry.name,
    importedFrom: entry.link ?? null,
    url: entry.link ?? null,
    mentorNote: null,
  }));
  saveBabylistConnection(userId, username);
  return addItemsToUserRegistry(userId, mapped);
}

export async function addItemsToUserRegistry(userId: string, items: AppRegistryItem[]): Promise<AppRegistryItem[]> {
  if (!items.length) {
    return listUserRegistryItems(userId);
  }

  const data = await registryRequest<{ items: RegistryItemRecord[] }>({
    method: "POST",
    url: "/registry/entry/bulk",
    data: { userId, items },
  });

  return data.items.map(toAppRegistryItem);
}

export async function mergeAffiliateFeeds(userId: string | null, affiliateItems: AppRegistryItem[]): Promise<AppRegistryItem[]> {
  if (!userId) return affiliateItems;
  const personal = await listUserRegistryItems(userId);
  const seen = new Set(personal.map((i) => i.externalId));
  return [...personal, ...affiliateItems.filter((i) => !seen.has(i.externalId))];
}

// ----------------------------------------------------
// Notes + Lists
// ----------------------------------------------------
export async function upsertRegistryNote(
  userId: string,
  productId: string,
  mentorId: string,
  note: string
): Promise<AppRegistryNote | null> {
  const response = await registryRequest<{ note: RegistryNoteRecord | null }>({
    method: "POST",
    url: "/registry/notes",
    data: {
      userId,
      productId,
      mentorId,
      note,
    },
  });
  return response.note ? toAppRegistryNote(response.note) : null;
}

export async function getRegistryNote(userId: string, productId: string, mentorId?: string): Promise<AppRegistryNote | null> {
  const response = await registryRequest<{ note: RegistryNoteRecord | null }>({
    method: "GET",
    url: "/registry/notes",
    params: {
      userId,
      productId,
      mentorId,
    },
  });
  return response.note ? toAppRegistryNote(response.note) : null;
}

export async function listRegistryNotesForUser(userId: string): Promise<AppRegistryNote[]> {
  const response = await registryRequest<{ notes: RegistryNoteRecord[] }>({
    method: "GET",
    url: "/registry/notes",
    params: { userId },
  });
  return (response.notes ?? []).map(toAppRegistryNote);
}
// ----------------------------------------------------
// Catalog Helpers (restore for API compatibility)
// ----------------------------------------------------
export async function addCatalogItemToUserRegistry(
  userId: string,
  catalogItemId: string
): Promise<AppRegistryItem> {
  const response = await registryRequest<{ item: RegistryCatalogRecord }>(
    {
      method: "GET",
      url: `/registry/catalog/${catalogItemId}`,
    },
    { requireAuth: false }
  );

  const catalogItem = response.item;
  if (!catalogItem) {
    throw new Error("Catalog item not found");
  }

  const payload = {
    name: catalogItem.title,
    brand: catalogItem.brand ?? catalogItem.retailer ?? "Taylor Concierge",
    price: parsePrice(catalogItem.price),
    category: catalogItem.category ?? null,
    imageUrl: catalogItem.image ?? null,
    url: catalogItem.url ?? null,
    retailer: catalogItem.retailer ?? null,
    source: catalogItem.source ?? "static",
    affiliateUrl: catalogItem.affiliateUrl ?? catalogItem.url ?? null,
    affiliateId: catalogItem.externalId ?? catalogItem.id,
    externalId: catalogItem.externalId ?? catalogItem.id,
    importedFrom: catalogItem.url ?? null,
  };

  const { item } = await registryRequest<{ item: RegistryItemRecord }>({
    method: "POST",
    url: "/registry/entry",
    data: {
      userId,
      item: payload,
    },
  });

  return toAppRegistryItem(item);
}

export async function addCatalogItemsToUserByFocus(
  userId: string,
  focus: string
): Promise<AppRegistryItem[]> {
  const items = listCatalogItemsByFocus(resolveCategory(focus));
  return addItemsToUserRegistry(userId, items);
}

// ----------------------------------------------------
// Catalog Accessors
// ----------------------------------------------------
export function listCatalogItems(): AppRegistryItem[] {
  return registryCatalog.map(cloneItem);
}

export function listCatalogItemsByFocus(category: RegistryCategory): AppRegistryItem[] {
  return registryCatalog.filter((item) => item.category === category).map(cloneItem);
};
