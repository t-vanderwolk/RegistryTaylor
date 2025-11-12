import { Suspense, type ReactNode } from "react";
import MemberDashboardLoading from "./MemberDashboardLoading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MemberSectionLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<MemberDashboardLoading />}>{children}</Suspense>;
}
