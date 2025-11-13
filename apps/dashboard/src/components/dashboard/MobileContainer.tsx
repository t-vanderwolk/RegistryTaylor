import type { ReactNode } from "react";

type MobileContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function MobileContainer({ children, className }: MobileContainerProps) {
  const classes = ["mx-auto flex w-full max-w-[420px] flex-col px-4 pb-24 pt-6", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
