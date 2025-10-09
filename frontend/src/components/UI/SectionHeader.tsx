import React from "react";
import clsx from "clsx";
import { H2, P } from "../../design-system/Typography";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, description, align = "center", className }) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        align === "left" ? "items-start text-left" : "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-shell px-3 py-1 text-[0.65rem] font-heading uppercase tracking-[0.34em] text-charcoal/70">
          {eyebrow}
        </span>
      )}
      <H2 className="text-charcoal">{title}</H2>
      {description &&
        (typeof description === "string" ? (
          <P className="max-w-2xl text-base text-charcoal/70">{description}</P>
        ) : (
          description
        ))}
    </div>
  );
};

export default SectionHeader;
