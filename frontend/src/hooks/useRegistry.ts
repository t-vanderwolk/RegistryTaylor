import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { withAff } from "../utils/withAff";

export type RegistryCategory = "Nursery" | "Gear" | "Postpartum" | string;

export interface RegistryItem {
  id: number;
  userId: string;
  moduleId: string;
  category: RegistryCategory;
  productName: string;
  brand?: string | null;
  productUrl?: string | null;
  mentorTag?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistryInput {
  moduleId: string;
  category: RegistryCategory;
  productName: string;
  brand?: string;
  productUrl?: string;
  mentorTag?: string;
}

type RegistryStatus = "idle" | "loading" | "error" | "success";

const MOCK_USER_ID = "user_demo";

const toItem = (record: any): RegistryItem => ({
  id: record.id,
  userId: record.user_id,
  moduleId: record.module_id,
  category: record.category,
  productName: record.product_name,
  brand: record.brand,
  productUrl: record.product_url,
  mentorTag: record.mentor_tag,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export const useRegistry = (userId?: string, options: { autoLoad?: boolean } = {}) => {
  const { autoLoad = true } = options;
  const resolvedUser = userId || MOCK_USER_ID;
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [status, setStatus] = useState<RegistryStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const response = await api.get(`/api/registry/${resolvedUser}`);
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setItems(data.map(toItem));
      setStatus("success");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Unable to load registry items.");
      setStatus("error");
    }
  }, [resolvedUser]);

  useEffect(() => {
    if (autoLoad) {
      fetchItems();
    }
  }, [autoLoad, fetchItems]);

  const optimisticUpdate = useCallback((updater: (current: RegistryItem[]) => RegistryItem[]) => {
    setItems((current) => updater(current));
  }, []);

  const addItem = useCallback(
    async (input: RegistryInput) => {
      const payload = {
        module_id: input.moduleId,
        category: input.category,
        product_name: input.productName,
        brand: input.brand,
        product_url: input.productUrl ? withAff(input.productUrl) : null,
        mentor_tag: input.mentorTag,
      };

      const optimistic: RegistryItem = {
        id: Date.now(),
        userId: resolvedUser,
        moduleId: input.moduleId,
        category: input.category,
        productName: input.productName,
        brand: input.brand,
        productUrl: payload.product_url,
        mentorTag: input.mentorTag,
      };

      optimisticUpdate((current) => [optimistic, ...current]);

      try {
        const response = await api.post("/api/registry", payload);
        const saved = toItem(response.data?.data);
        optimisticUpdate((current) => [saved, ...current.filter((item) => item.id !== optimistic.id)]);
        return saved;
      } catch (err) {
        optimisticUpdate((current) => current.filter((item) => item.id !== optimistic.id));
        throw err;
      }
    },
    [optimisticUpdate, resolvedUser]
  );

  const updateItem = useCallback(
    async (id: number, input: Partial<RegistryInput>) => {
      const payload: Record<string, any> = {};
      if (input.category !== undefined) payload.category = input.category;
      if (input.productName !== undefined) payload.product_name = input.productName;
      if (input.brand !== undefined) payload.brand = input.brand;
      if (input.productUrl !== undefined) payload.product_url = input.productUrl ? withAff(input.productUrl) : null;
      if (input.mentorTag !== undefined) payload.mentor_tag = input.mentorTag;

      optimisticUpdate((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                category: input.category ?? item.category,
                productName: input.productName ?? item.productName,
                brand: input.brand ?? item.brand,
                productUrl:
                  input.productUrl !== undefined
                    ? input.productUrl
                      ? withAff(input.productUrl)
                      : null
                    : item.productUrl,
                mentorTag: input.mentorTag ?? item.mentorTag,
              }
            : item
        )
      );

      try {
        const response = await api.patch(`/api/registry/${id}`, payload);
        const saved = toItem(response.data?.data);
        optimisticUpdate((current) => current.map((item) => (item.id === id ? saved : item)));
        return saved;
      } catch (err) {
        await fetchItems();
        throw err;
      }
    },
    [fetchItems, optimisticUpdate]
  );

  const removeItem = useCallback(
    async (id: number) => {
      const snapshot = items;
      optimisticUpdate((current) => current.filter((item) => item.id !== id));
      try {
        await api.delete(`/api/registry/${id}`);
      } catch (err) {
        setItems(snapshot);
        throw err;
      }
    },
    [items, optimisticUpdate]
  );

  const grouped = useMemo(() => {
    return items.reduce<Record<string, RegistryItem[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [items]);

  return {
    items,
    grouped,
    status,
    error,
    addItem,
    updateItem,
    removeItem,
    refresh: fetchItems,
  };
};

export default useRegistry;
