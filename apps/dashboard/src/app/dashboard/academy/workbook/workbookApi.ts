import type { WorkbookContent, WorkbookEntry } from "@/types/workbook";

type UpsertWorkbookEntryPayload = {
  moduleSlug: string;
  content: WorkbookContent;
  shared?: boolean;
};

export async function getWorkbookEntry(moduleSlug: string): Promise<WorkbookEntry | null> {
  if (!moduleSlug) {
    return null;
  }

  try {
    const response = await fetch(`/api/workbook/entry/${encodeURIComponent(moduleSlug)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { entry?: WorkbookEntry | null };
    return payload.entry ?? null;
  } catch (error) {
    console.error("Unable to fetch workbook entry", error);
    return null;
  }
}

export async function upsertWorkbookEntry({
  moduleSlug,
  content,
  shared = false,
}: UpsertWorkbookEntryPayload): Promise<WorkbookEntry> {
  if (!moduleSlug) {
    throw new Error("moduleSlug is required to save a workbook entry.");
  }

  const response = await fetch(`/api/workbook/entry/${encodeURIComponent(moduleSlug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content, shared: Boolean(shared) }),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorBody?.message ?? "Unable to save workbook entry.");
  }

  const payload = (await response.json()) as { entry: WorkbookEntry };
  return payload.entry;
}
