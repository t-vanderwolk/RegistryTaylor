import React from "react";

type TypographyProps = React.HTMLAttributes<
  HTMLHeadingElement | HTMLParagraphElement
> & {
  children: React.ReactNode;
};

// Headline 1 — Large serif heading (for hero sections)
export const H1: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <h1
    className={[
      "font-heading text-3xl leading-tight text-tmCharcoal sm:text-4xl lg:text-5xl",
      "tracking-tight drop-shadow-sm",
      "motion-safe:animate-fade-in-up",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </h1>
);

// Headline 2 — Subsection heading (for content sections)
export const H2: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <h2
    className={[
      "font-heading text-2xl leading-snug text-tmCharcoal sm:text-3xl",
      "tracking-tight drop-shadow-sm",
      "motion-safe:animate-fade-in-up",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </h2>
);

// Paragraph — Default body copy
export const P: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <p
    className={[
      "font-body text-base leading-relaxed text-tmCharcoal/80 sm:text-lg",
      "motion-safe:animate-fade-in-up",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </p>
);
