const MEMBER_DASHBOARD_ROUTES = {
  home: "/dashboard/member",
  learnRoot: "/dashboard/member/learn",
  learnWelcome: "/dashboard/member/learn/welcome",
  plan: "/dashboard/member/plan",
  registryHub: "/dashboard/member/plan",
  journal: "/dashboard/member/journal",
  events: "/dashboard/member/events",
  community: "/dashboard/member/community",
} as const;

export type MemberDashboardRoute = keyof typeof MEMBER_DASHBOARD_ROUTES;

export function getMemberDashboardRoute(key: MemberDashboardRoute) {
  return MEMBER_DASHBOARD_ROUTES[key];
}

export { MEMBER_DASHBOARD_ROUTES };
