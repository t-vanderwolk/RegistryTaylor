import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function DashboardIndexPage() {
  const user = await requireUser();

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user.role === "MENTOR") {
    redirect("/dashboard/mentor");
  }

  redirect("/dashboard/member");
}
