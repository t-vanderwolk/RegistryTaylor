import { requireMember } from "@/lib/auth";
import RegistryDashboard from "./components/RegistryDashboard";

export default async function RegistryPage() {
  const user = await requireMember();

  return (
    <div className="min-h-screen bg-[#FFFAF8] px-4 py-10 text-[#3E2F35] sm:px-6 lg:px-10">
      <RegistryDashboard userId={user.id} userName={user.name ?? user.email} />
    </div>
  );
}
