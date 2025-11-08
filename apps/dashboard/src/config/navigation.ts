import type { UserRole } from "@/lib/auth";

export type NavItem = {
  href: string;
  label: string;
};

const memberNav: NavItem[] = [
  { href: "/dashboard/member", label: "Home" },
  { href: "/dashboard/learn", label: "Academy" },
  { href: "/dashboard/community", label: "Community" },
  { href: "/dashboard/journal", label: "Journal" },
  { href: "/dashboard/support", label: "Support Hub" },
];

const mentorNav: NavItem[] = [
  { href: "/dashboard/mentor", label: "Studio" },
  { href: "/dashboard/community", label: "Community" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/learn", label: "Academy" },
];

const adminNav: NavItem[] = [
  { href: "/dashboard/admin", label: "Command" },
  { href: "/dashboard/community", label: "Community" },
  { href: "/dashboard/support", label: "Support" },
  { href: "/dashboard/learn", label: "Academy" },
];

export const DASHBOARD_NAV_MAP: Record<UserRole, NavItem[]> = {
  MEMBER: memberNav,
  MENTOR: mentorNav,
  ADMIN: adminNav,
};

export function getNavForRole(role: UserRole): NavItem[] {
  return DASHBOARD_NAV_MAP[role] ?? memberNav;
}
