import InviteManager from "@/components/admin/InviteManager";
import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Admin · Invites",
  description: "Manage member, mentor, and admin invitations.",
};

export default async function AdminInvitesPage() {
  await requireAdmin();

  return <InviteManager />;
}
