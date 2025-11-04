import type { ReactNode } from "react";
import MarketingLayout from "../(marketing)/layout";

type AcademyLayoutProps = {
  children: ReactNode;
};

export default function AcademyLayout({ children }: AcademyLayoutProps) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
