import { randomUUID } from "node:crypto";
import prisma from "@tmbc/db/prisma";
import { Prisma, $Enums } from "@prisma/client";
import { normalizeAffiliateLink } from "@/app/api/registry/affiliate";
import registrySource from "@/data/registryItems.json";
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
type RegistryItemRecord = Prisma.RegistryItemGetPayload<{
  include: { mentorNotes: { include: { mentor: true } } };
}>;
type RegistryNoteRecord = Prisma.RegistryNoteGetPayload<{ include: { registryItem: true } }>;

function toAppRegistryItem(record: RegistryItemRecord): AppRegistryItem {
  const latestNote =
    record.mentorNotes.length > 0
      ? record.mentorNotes.reduce((a, b) => (b.updatedAt > a.updatedAt ? b : a))
      : null;

  return {
    id: record.id,
    name: record.name,
    brand: record.brand ?? record.retailer ?? "Taylor Concierge",
    price: record.price ? Number(record.price) : null,
    category: resolveCategory(record.category),
    image: record.imageUrl ?? null,
    affiliateUrl: record.affiliateUrl ?? record.url ?? "",
    registrySource: record.source as RegistrySource,
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
  return {
    id: record.id,
    userId: record.registryItem.userId,
    productId: record.registryItemId,
    mentorId: record.mentorId ?? undefined,
    note: record.content ?? "",
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

// ----------------------------------------------------
// Persistence Normalization
// ----------------------------------------------------
function externalKeyFromItem(item: AppRegistryItem): string {
  return item.externalId ?? item.affiliateId ?? item.id;
}

function normalizeForPersistence(userId: string, item: AppRegistryItem) {
  const externalId = externalKeyFromItem(item);
  const sourceUrl = item.affiliateUrl ?? item.url ?? "";
  const affiliateUrl = sourceUrl ? normalizeAffiliateLink(sourceUrl, item.registrySource) : "";
  const persistedUrl = item.url ?? sourceUrl ?? null;

  return {
    create: {
      userId,
      name: item.name,
      brand: item.brand ?? null,
      price: item.price ?? null,
      category: item.category ?? null,
      imageUrl: item.image ?? null,
      url: persistedUrl,
      retailer: item.retailer ?? null,
      notes: item.description ?? null,
      source: item.registrySource as $Enums.RegistrySource,
      externalId,
      importedFrom: item.importedFrom ?? null,
      affiliateUrl,
      affiliateId: item.affiliateId ?? null,
    },
    update: {
      name: item.name,
      brand: item.brand ?? null,
      price: item.price ?? null,
      category: item.category ?? null,
      imageUrl: item.image ?? null,
      url: persistedUrl,
      retailer: item.retailer ?? null,
      notes: item.description ?? null,
      source: item.registrySource as $Enums.RegistrySource,
      importedFrom: item.importedFrom ?? null,
      affiliateUrl,
      affiliateId: item.affiliateId ?? null,
    },
    externalId,
  };
}

// ----------------------------------------------------
// Core Registry Logic
// ----------------------------------------------------
export async function listUserRegistryItems(userId: string): Promise<AppRegistryItem[]> {
  const records = await prisma.registryItem.findMany({
    where: { userId },
    include: { mentorNotes: { include: { mentor: true } } },
    orderBy: [{ createdAt: "desc" }],
  });
  return records.map(toAppRegistryItem);
}

export async function getRegistryItems(userId: string): Promise<AppRegistryItem[]> {
  return listUserRegistryItems(userId);
}

export async function getCatalogItems() {
  return prisma.registryCatalogItem.findMany({
    orderBy: [{ source: "asc" }, { title: "asc" }],
  });
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
  const externalId = input.externalId ?? input.url ?? randomUUID();
  const record = await prisma.registryItem.create({
    data: {
      userId: input.userId,
      name: input.name,
      brand: input.brand ?? null,
      price: input.price ?? null,
      category: input.category ?? null,
      imageUrl: input.image ?? null,
      url: input.url ?? null,
      retailer: input.retailer ?? null,
      notes: input.description ?? null,
      source: (input.source ?? "macro") as $Enums.RegistrySource,
      affiliateUrl: input.affiliateUrl ?? input.url ?? null,
      affiliateId: input.affiliateId ?? input.externalId ?? externalId,
      externalId,
    },
    include: { mentorNotes: { include: { mentor: true } } },
  });
  return toAppRegistryItem(record);
}

export async function updateRegistryItem(id: string, data: Partial<AppRegistryItem>): Promise<AppRegistryItem> {
  const update: Prisma.RegistryItemUpdateInput = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.brand !== undefined) update.brand = data.brand ?? null;
  if (data.price !== undefined) update.price = data.price ?? null;
  if (data.category !== undefined) update.category = data.category ?? null;
  if (data.image !== undefined) update.imageUrl = data.image ?? null;
  if (data.url !== undefined) update.url = data.url ?? null;
  if (data.retailer !== undefined) update.retailer = data.retailer ?? null;
  if (data.description !== undefined) update.notes = data.description ?? null;
  if (data.affiliateUrl !== undefined) update.affiliateUrl = data.affiliateUrl ?? null;
  if (data.affiliateId !== undefined) update.affiliateId = data.affiliateId ?? null;
  // if (data.source !== undefined) update.source = data.source as $Enums.RegistrySource;

  const record = await prisma.registryItem.update({
    where: { id },
    data: update,
    include: { mentorNotes: { include: { mentor: true } } },
  });
  return toAppRegistryItem(record);
}

export async function deleteRegistryItem(id: string): Promise<void> {
  await prisma.registryItem.delete({ where: { id } });
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
  if (!items.length) return listUserRegistryItems(userId);
  const operations = items.map((item) => {
    const normalized = normalizeForPersistence(userId, item);
    return prisma.registryItem.upsert({
      where: { externalId_userId: { externalId: normalized.externalId, userId } },
      create: normalized.create,
      update: normalized.update,
    });
  });
  await prisma.$transaction(operations);
  return listUserRegistryItems(userId);
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
  const registryItem = await prisma.registryItem.findFirst({ where: { id: productId, userId } });
  if (!registryItem) return null;

  const trimmed = note.trim();
  if (!trimmed) {
    await prisma.registryNote.deleteMany({ where: { registryItemId: productId, mentorId } });
    return null;
  }

  const record = await prisma.registryNote.upsert({
    where: { registryItemId_mentorId: { registryItemId: productId, mentorId } },
    update: { content: trimmed },
    create: { registryItemId: productId, mentorId, content: trimmed },
    include: { registryItem: true },
  });
  return toAppRegistryNote(record);
}

export async function getRegistryNote(userId: string, productId: string, mentorId?: string): Promise<AppRegistryNote | null> {
  const record = await prisma.registryNote.findFirst({
    where: { registryItemId: productId, registryItem: { userId }, ...(mentorId ? { mentorId } : {}) },
    orderBy: { updatedAt: "desc" },
    include: { registryItem: true },
  });
  return record ? toAppRegistryNote(record) : null;
}

export async function listRegistryNotesForUser(userId: string): Promise<AppRegistryNote[]> {
  const records = await prisma.registryNote.findMany({
    where: { registryItem: { userId } },
    include: { registryItem: true },
    orderBy: { updatedAt: "desc" },
  });
  return records.map(toAppRegistryNote);
}
// ----------------------------------------------------
// Catalog Helpers (restore for API compatibility)
// ----------------------------------------------------
export async function addCatalogItemToUserRegistry(
  userId: string,
  catalogItemId: string
): Promise<AppRegistryItem> {
  const catalogItem = await prisma.registryCatalogItem.findUnique({
    where: { id: catalogItemId },
  });

  if (!catalogItem) {
    throw new Error("Catalog item not found");
  }

  const appItem: AppRegistryItem = {
    id: catalogItem.id,
    name: catalogItem.title,
    brand: catalogItem.brand ?? catalogItem.retailer ?? "Taylor Concierge",
    price: catalogItem.price ? Number(catalogItem.price) : null,
    category: resolveCategory(catalogItem.category),
    image: catalogItem.image ?? null,
    affiliateUrl: catalogItem.affiliateUrl ?? catalogItem.url ?? "",
    registrySource: catalogItem.source as RegistrySource,
    retailer: catalogItem.retailer ?? null,
    description: null,
    affiliateId: catalogItem.externalId ?? null,
    externalId: catalogItem.externalId ?? catalogItem.id,
    importedFrom: catalogItem.url ?? null,
    url: catalogItem.url ?? null,
    mentorNote: null,
  };

  const normalized = normalizeForPersistence(userId, appItem);
  const record = await prisma.registryItem.upsert({
    where: {
      externalId_userId: {
        externalId: normalized.externalId,
        userId,
      },
    },
    create: normalized.create,
    update: normalized.update,
    include: { mentorNotes: { include: { mentor: true } } },
  });

  return toAppRegistryItem(record);
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
