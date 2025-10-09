import React from "react";

type TypographyProps = React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> & {
  children: React.ReactNode;
};

export const H1: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <h1
    className={[
      "font-heading text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <h2
    className={[
      "font-heading text-2xl leading-tight text-ink sm:text-3xl lg:text-4xl",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </h2>
);

export const P: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <p
    className={[
      "font-body text-base leading-relaxed text-ink/80 sm:text-lg",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </p>
);
