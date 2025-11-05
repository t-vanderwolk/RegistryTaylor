"use client";

import useSWR from "swr";
import type { PlanData, RegistryItem, RegistryNote, RegistryCatalogItem, RegistrySource } from "@/types/plan";

type PlanDataResponse = {
  data?: PlanData;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<PlanData | undefined>;
  mutate: ReturnType<typeof useSWR<PlanData>>["mutate"];
};

type RegistryApiPayload = {
  items?: RegistryItem[];
  meta?: {
    category?: string | null;
    sources?: RegistrySource[];
  };
};

type RegistryItemsPayload = {
  items?: RegistryItem[];
};

type RegistryNotesPayload = {
  notes?: RegistryNote[];
};

type CatalogPayload = {
  catalog?: RegistryCatalogItem[];
};

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: init?.credentials ?? "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed for ${typeof input === "string" ? input : "resource"}`;
    try {
      const body = await response.json();
      message = body?.error ?? body?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

async function loadPlanData(): Promise<PlanData> {
  const [registry, owned, notes, catalog] = await Promise.all([
    fetchJson<RegistryApiPayload>("/api/registry"),
    fetchJson<RegistryItemsPayload>("/api/registry-items"),
    fetchJson<RegistryNotesPayload>("/api/registryNotes"),
    fetchJson<CatalogPayload>("/api/catalog-items"),
  ]);

  return {
    curated: registry.items ?? [],
    owned: owned.items ?? [],
    notes: notes.notes ?? [],
    catalog: catalog.catalog ?? [],
    meta: {
      category: registry.meta?.category ?? null,
      sources: registry.meta?.sources ?? [],
    },
  };
}

export default function usePlanData(): PlanDataResponse {
  const swr = useSWR<PlanData>("plan-data", loadPlanData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    data: swr.data,
    loading: swr.isLoading,
    error: swr.error ?? null,
    refresh: async () => swr.mutate(),
    mutate: swr.mutate,
  };
}
