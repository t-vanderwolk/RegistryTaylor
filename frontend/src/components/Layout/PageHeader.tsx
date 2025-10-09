import React from "react";
import { H1, P } from "../../design-system/Typography";

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
};

const alignmentMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
  children,
}) => {
  const alignmentClasses =
    alignmentMap[align] ?? alignmentMap.center;

  return (
    <header
      className={[
        "flex flex-col gap-6",
        alignmentClasses,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && (
        <span
          className={[
            "inline-flex items-center justify-center rounded-full bg-shell px-4 py-2 text-[0.65rem] font-heading uppercase tracking-[0.38em] text-charcoal/80",
            eyebrowClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {eyebrow}
        </span>
      )}
      {typeof title === "string" ? (
        <H1 className={["max-w-4xl text-charcoal", titleClassName].filter(Boolean).join(" ")}>
          {title}
        </H1>
      ) : (
        title
      )}
      {description &&
        (typeof description === "string" ? (
          <P className={["max-w-3xl text-charcoal/70", descriptionClassName].filter(Boolean).join(" ")}>
            {description}
          </P>
        ) : (
          description
        ))}
      {children}
    </header>
  );
};

export default PageHeader;
