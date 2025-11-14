import { Suspense, type ReactNode } from "react";
import MemberDashboardLoading from "./MemberDashboardLoading";
import MobileContainer from "@/components/dashboard/MobileContainer";
import MobileFooterNav from "@/components/dashboard/MobileFooterNav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MemberSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-blush-50 pb-32 md:bg-gradient-to-b md:from-blush-50 md:via-ivory md:to-white md:scroll-smooth">
      <Suspense fallback={<MemberDashboardLoading />}>
        <MobileContainer>{children}</MobileContainer>
      </Suspense>
      <MobileFooterNav />
    </div>
  );
}
