import React from "react";

type TypographyProps = React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> & {
  children: React.ReactNode;
};

export const H1: React.FC<TypographyProps> = ({ children, className, ...rest }) => (
  <h1
    className={[
<<<<<<< HEAD
      "font-heading text-mauve text-4xl leading-tight sm:text-5xl lg:text-6xl",
=======
      "font-heading text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl",
>>>>>>> heroku/main
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
<<<<<<< HEAD
      "font-heading text-mauve text-2xl leading-tight sm:text-3xl lg:text-4xl",
=======
      "font-heading text-2xl leading-tight text-ink sm:text-3xl lg:text-4xl",
>>>>>>> heroku/main
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
<<<<<<< HEAD
      "font-body text-base leading-relaxed text-charcoal/80 sm:text-lg",
=======
      "font-body text-base leading-relaxed text-ink/80 sm:text-lg",
>>>>>>> heroku/main
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...rest}
  >
    {children}
  </p>
);
