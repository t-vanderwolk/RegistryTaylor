import type { Route } from "next";
import type { UserRole } from "@/lib/auth";

export type NavItem = {
  href: Route;
  label: string;
};

const memberNav: NavItem[] = [
  { href: "/dashboard/member" as const, label: "Home" },
  { href: "/dashboard/learn" as const, label: "Academy" },
  { href: "/dashboard/community" as const, label: "Community" },
  { href: "/dashboard/journal" as const, label: "Journal" },
  { href: "/dashboard/support" as const, label: "Support Hub" },
];

const mentorNav: NavItem[] = [
  { href: "/dashboard/mentor" as const, label: "Studio" },
  { href: "/dashboard/community" as const, label: "Community" },
  { href: "/dashboard/support" as const, label: "Support" },
  { href: "/dashboard/learn" as const, label: "Academy" },
];

const adminNav: NavItem[] = [
  { href: "/dashboard/admin" as const, label: "Command" },
  { href: "/dashboard/community" as const, label: "Community" },
  { href: "/dashboard/support" as const, label: "Support" },
  { href: "/dashboard/learn" as const, label: "Academy" },
];

export const DASHBOARD_NAV_MAP: Record<UserRole, NavItem[]> = {
  MEMBER: memberNav,
  MENTOR: mentorNav,
  ADMIN: adminNav,
};

export function getNavForRole(role: UserRole): NavItem[] {
  return DASHBOARD_NAV_MAP[role] ?? memberNav;
}
