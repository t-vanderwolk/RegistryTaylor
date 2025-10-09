import React from "react";
import { H2, P } from "../../design-system/Typography";

type CardSectionProps = {
  title?: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  variant?: "card" | "plain";
  className?: string;
  contentClassName?: string;
  wrapperClassName?: string;
  id?: string;
  children: React.ReactNode;
};

const alignmentMap = {
  left: "items-start text-left",
  center: "items-center text-center",
} as const;

const CardSection: React.FC<CardSectionProps> = ({
  title,
  description,
  align = "left",
  variant = "card",
  className,
  contentClassName,
  wrapperClassName,
  id,
  children,
}) => {
  const alignmentClasses =
    alignmentMap[align] ?? alignmentMap.left;

  const containerClasses = [
    "flex flex-col gap-6",
    alignmentClasses,
  ]
    .filter(Boolean)
    .join(" ");

  const variantClasses =
    variant === "plain"
      ? ""
      : "rounded-lg border border-charcoal/10 bg-white/95 px-6 py-8 shadow-elevated-sm sm:px-10 sm:py-10";

  const baseContentClasses =
    contentClassName ?? "flex flex-col gap-8";

  const contentClasses = [
    baseContentClasses,
    variantClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      className={["w-full", wrapperClassName].filter(Boolean).join(" ")}
    >
      {(title || description) && (
        <div className={containerClasses}>
          {title && <H2 className="text-charcoal">{title}</H2>}
          {description &&
            (typeof description === "string" ? (
              <P className="max-w-3xl text-charcoal/70">{description}</P>
            ) : (
              description
            ))}
        </div>
      )}
      <div className={contentClasses}>
        {children}
      </div>
    </section>
  );
};

export default CardSection;
