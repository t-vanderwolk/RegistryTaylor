import React from "react";
import MarketingLayout from "../../layouts/MarketingLayout";

type PageWrapperProps = {
  children: React.ReactNode;
  backgroundClassName?: string;
  contentClassName?: string;
};

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  backgroundClassName,
  contentClassName,
}) => {
  const backgroundClasses = ["bg-gradient-to-b from-ivory via-ivory/95 to-ivory", backgroundClassName]
    .filter(Boolean)
    .join(" ");

  const contentClasses = [
    "mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-24 sm:gap-20 sm:px-8 md:px-10",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MarketingLayout>
      <main className={backgroundClasses}>
        <div className={contentClasses}>{children}</div>
      </main>
    </MarketingLayout>
  );
};

export default PageWrapper;
