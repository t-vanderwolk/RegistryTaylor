import { useSyncExternalStore } from "react";

const STORAGE_KEY = "tm_registry_items";

const defaultItems = [
  {
    id: "registry-nuna-mixx",
    title: "Nuna MIXX Next Stroller",
    retailer: "Nordstrom",
    category: "Gear",
    quantity: 1,
    price: "$799",
    status: "planning",
    link: "https://www.nordstrom.com/",
    notes: "Preferred in Caviar with ring adapter.",
    addedBy: "admin",
    createdAt: "2024-06-01T10:00:00.000Z",
    updatedAt: "2024-06-01T10:00:00.000Z",
  },
  {
    id: "registry-doona",
    title: "Doona Car Seat & Stroller",
    retailer: "Doona",
    category: "Travel",
    quantity: 1,
    price: "$550",
    status: "ordered",
    link: "https://www.doona.com/",
    notes: "Client prefers midnight colorway.",
    addedBy: "mentor",
    createdAt: "2024-06-15T10:00:00.000Z",
    updatedAt: "2024-08-22T14:12:00.000Z",
  },
  {
    id: "registry-lalo-highchair",
    title: "The Chair by Lalo",
    retailer: "Lalo",
    category: "Feeding",
    quantity: 1,
    price: "$235",
    status: "delivered",
    link: "https://www.meetlalo.com/",
    notes: "Match accessories to sage splash mat.",
    addedBy: "client",
    createdAt: "2024-07-03T12:45:00.000Z",
    updatedAt: "2024-09-01T09:30:00.000Z",
  },
];

const listeners = new Set();

const loadFromStorage = () => {
  if (typeof window === "undefined") return defaultItems;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultItems;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error("Unable to read registry items from storage", error);
  }
  return defaultItems;
};

let registryItems = loadFromStorage();

const persist = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registryItems));
  } catch (error) {
    console.error("Unable to save registry items", error);
  }
};

const emit = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error("Registry listener error", error);
    }
  });
};

const setItems = (updater) => {
  const next = typeof updater === "function" ? updater(registryItems) : updater;
  registryItems = Array.isArray(next) ? next : [];
  persist();
  emit();
};

const nowISOString = () => new Date().toISOString();

const randomId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `registry-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
};

const addItem = (item) => {
  const timestamp = nowISOString();
  const id = item.id || randomId();
  const normalized = {
    id,
    title: item.title.trim(),
    retailer: item.retailer?.trim() || "",
    category: item.category?.trim() || "General",
    quantity: Number(item.quantity) || 1,
    price: item.price?.trim() || "",
    status: item.status || "planning",
    link: item.link?.trim() || "",
    notes: item.notes?.trim() || "",
    addedBy: item.addedBy || "client",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  setItems((current) => [normalized, ...current]);
  return id;
};

const updateItem = (id, updates) => {
  const timestamp = nowISOString();
  setItems((current) =>
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            ...updates,
            quantity: updates.quantity !== undefined ? Number(updates.quantity) || 1 : item.quantity,
            updatedAt: timestamp,
          }
        : item,
    ),
  );
};

const removeItem = (id) => {
  setItems((current) => current.filter((item) => item.id !== id));
};

const reset = () => {
  setItems(defaultItems);
};

export const registryStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => registryItems,
  addItem,
  updateItem,
  removeItem,
  reset,
};

export const useRegistryStore = () => {
  const items = useSyncExternalStore(registryStore.subscribe, registryStore.getSnapshot);

  return {
    items,
    addItem: registryStore.addItem,
    updateItem: registryStore.updateItem,
    deleteItem: registryStore.removeItem,
    resetRegistry: registryStore.reset,
  };
};
