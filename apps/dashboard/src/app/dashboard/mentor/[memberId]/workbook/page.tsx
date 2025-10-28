import { apiFetch } from "@/lib/apiClient";
import { requireMentor } from "@/lib/auth";
import type { WorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import MentorWorkbookView from "./MentorWorkbookView";

type MentorWorkbookPageProps = {
  params: {
    memberId: string;
  };
};

export const metadata = {
  title: "Member Workbook · Taylor-Made Mentor Studio",
};

export default async function MentorWorkbookPage({ params }: MentorWorkbookPageProps) {
  await requireMentor();

  let entries: WorkbookEntry[] = [];
  try {
    const data = await apiFetch<{ entries?: WorkbookEntry[] }>(`/api/workbook/${params.memberId}`, {
      cache: "no-store",
      credentials: "include",
    });
    entries = data.entries?.filter((entry) => entry.shared) ?? [];
  } catch (error) {
    console.error(error);
  }

  return <MentorWorkbookView entries={entries} />;
}
