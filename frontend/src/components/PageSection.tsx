import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function PageSection({ children, className, id }: PageSectionProps) {
  return (
    <section
      id={id}
      className={["px-6 py-16 md:px-12 md:py-24", className].filter(Boolean).join(" ")}
    >
      {children}
    </section>
  );
}
