import { redirect } from "next/navigation";
import { fetchAuthenticatedUser, getDashboardPath } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardIndexPage() {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  redirect(getDashboardPath(user.role));
}
