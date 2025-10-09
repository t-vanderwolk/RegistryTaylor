import React from "react";
import { H2, P } from "./Typography";

type SectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const Section: React.FC<SectionProps> = ({ title, description, children, className, id }) => {
  return (
    <section
      id={id}
      className={[
        "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-6">
        {(title || description) && (
          <div className="max-w-3xl">
            {title && <H2 className="mb-4 text-ink">{title}</H2>}
            {description && <P className="text-ink/75">{description}</P>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
