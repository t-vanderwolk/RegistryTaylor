export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireMentor } from "@/lib/auth";
import MentorOverview from "@/components/mentor/MentorOverview";

export default async function MentorDashboard() {
  const user = await requireMentor();
  return <MentorOverview user={user} />;
}
