export const dynamic = "force-dynamic";
export const revalidate = 0;

import { requireAdmin } from "@/lib/auth";
import AdminOverview from "@/components/admin/AdminOverview";

export default async function AdminDashboard() {
  const user = await requireAdmin();
  return <AdminOverview user={user} />;
}
