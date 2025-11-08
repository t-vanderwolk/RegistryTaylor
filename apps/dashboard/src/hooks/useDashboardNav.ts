"use client";

import { useMemo } from "react";
import type { UserRole } from "@/lib/auth";
import { DASHBOARD_NAV_MAP, type NavItem } from "@/config/navigation";

export function useDashboardNav(role: UserRole): NavItem[] {
  return useMemo(() => DASHBOARD_NAV_MAP[role] ?? DASHBOARD_NAV_MAP.MEMBER, [role]);
}
