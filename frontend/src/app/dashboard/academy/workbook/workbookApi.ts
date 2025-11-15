import { apiFetch } from "@/lib/apiClient";

export type WorkbookSectionState = {
  checklist?: Record<string, boolean>;
  text?: string;
  reflection?: string;
  completed?: boolean;
};

export type WorkbookContent = {
  text?: string;
  images?: string[];
  sections?: Record<string, WorkbookSectionState>;
  lastSavedAt?: string;
};

export type WorkbookEntry = {
  id: string;
  memberId: string;
  moduleSlug: string;
  content: WorkbookContent;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchWorkbookEntries(memberId: string): Promise<WorkbookEntry[]> {
  try {
    const data = await apiFetch<{ entries?: WorkbookEntry[] }>(`/api/workbook/${memberId}`, {
      cache: "no-store",
      credentials: "include",
    });
    return data.entries ?? [];
  } catch {
    return [];
  }
}

export async function getWorkbookEntry(moduleSlug: string): Promise<WorkbookEntry | null> {
  try {
    const data = await apiFetch<{ entry?: WorkbookEntry | null }>(`/api/workbook/module/${moduleSlug}`, {
      cache: "no-store",
      credentials: "include",
    });
    return data.entry ?? null;
  } catch {
    return null;
  }
}

export async function upsertWorkbookEntry({
  moduleSlug,
  content,
  shared,
}: {
  moduleSlug: string;
  content: WorkbookContent;
  shared: boolean;
}): Promise<WorkbookEntry> {
  const data = await apiFetch<{ entry: WorkbookEntry }>("/api/workbook", {
    method: "POST",
    body: JSON.stringify({ moduleSlug, content, shared }),
    cache: "no-store",
    credentials: "include",
  });
  return data.entry;
}

export async function updateShareState(id: string, shared: boolean): Promise<WorkbookEntry> {
  const data = await apiFetch<{ entry: WorkbookEntry }>(`/api/workbook/${id}/share`, {
    method: "PUT",
    body: JSON.stringify({ shared }),
    cache: "no-store",
    credentials: "include",
  });
  return data.entry;
}
