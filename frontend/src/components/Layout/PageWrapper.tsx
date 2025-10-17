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
  const backgroundClasses = [
    "py-section sm:py-section-lg bg-gradient-to-br from-tmIvory via-white to-tmIvory",
    backgroundClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const contentClasses = [
    "mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 sm:gap-20 sm:px-8 md:px-12",
    contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MarketingLayout>
      <main className={backgroundClasses}>
        <div
          className={`rounded-[3rem] border border-white/60 bg-white/80 p-10 shadow-soft backdrop-blur ${contentClasses}`}
        >
          {children}
        </div>
      </main>
    </MarketingLayout>
  );
};

export default PageWrapper;
