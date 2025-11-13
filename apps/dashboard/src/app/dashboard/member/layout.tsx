import { Suspense, type ReactNode } from "react";
import MemberDashboardLoading from "./MemberDashboardLoading";
import MobileContainer from "@/components/dashboard/MobileContainer";
import MobileFooterNav from "@/components/dashboard/MobileFooterNav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MemberSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#FFF7FA] pb-20 md:scroll-smooth">
      <Suspense fallback={<MemberDashboardLoading />}>
        <MobileContainer>{children}</MobileContainer>
      </Suspense>
      <MobileFooterNav />
    </div>
  );
}
