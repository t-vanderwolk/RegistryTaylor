import { apiFetch } from "@/lib/apiClient";
import { requireMentor } from "@/lib/auth";
import type { WorkbookEntry } from "@/app/dashboard/academy/workbook/workbookApi";
import MentorWorkbookView from "./MentorWorkbookView";
import MessagePanel from "@/components/connect/MessagePanel";

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

  return (
    <div className="space-y-8">
      <MentorWorkbookView entries={entries} />
      <MessagePanel participantId={params.memberId} />
    </div>
  );
}
