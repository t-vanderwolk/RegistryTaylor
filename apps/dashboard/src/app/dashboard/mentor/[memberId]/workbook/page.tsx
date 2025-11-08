import { apiFetch } from "@/lib/apiClient";
import { getSession, requireMentor } from "@/lib/auth";
import type { WorkbookEntry } from "@/types/workbook";
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
  const session = await getSession();

  let entries: WorkbookEntry[] = [];
  try {
    const headers = session?.token ? { Authorization: `Bearer ${session.token}` } : undefined;
    const data = await apiFetch<{ entries?: WorkbookEntry[] }>(`/api/workbook/${params.memberId}`, {
      cache: "no-store",
      credentials: "include",
      headers,
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
