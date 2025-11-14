import type { ReactNode } from "react";

type MobileContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function MobileContainer({ children, className }: MobileContainerProps) {
  const classes = [
    "mx-auto flex w-full max-w-6xl flex-col px-4 pb-28 pt-4 sm:px-5 md:px-0 md:pb-32 md:pt-8",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
