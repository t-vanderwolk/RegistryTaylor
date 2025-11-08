export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireMember } from "@/lib/auth";
import SupportHub from "@/components/dashboard/SupportHub";

export default async function SupportPage() {
  const user = await requireMember();
  return <SupportHub user={user} />;
}
