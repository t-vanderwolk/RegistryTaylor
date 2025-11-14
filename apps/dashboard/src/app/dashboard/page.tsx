import { redirect } from "next/navigation";
import type { Route } from "next";
import { fetchAuthenticatedUser } from "@/lib/auth";

type DashboardRoute = Extract<
  Route,
  "/login" | "/dashboard/member" | "/dashboard/mentor" | "/dashboard/admin"
>;

function getDashboardPath(role?: string | null): DashboardRoute {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "MENTOR":
      return "/dashboard/mentor";
    case "MEMBER":
      return "/dashboard/member";
    default:
      return "/login";
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardIndexPage() {
  const user = await fetchAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }

  redirect(getDashboardPath(user.role));
}
