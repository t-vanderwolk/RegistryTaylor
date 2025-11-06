import React from "react";
import { Link } from "react-router-dom";

const COLOR_MAP = {
<<<<<<< HEAD
  mauve: "bg-mauve text-cream hover:bg-mauve/90",
  pink: "bg-blush text-charcoal hover:bg-blush/90",
  blueberry: "bg-mauve text-cream hover:bg-mauve/90",
  outline: "border border-mauve/40 bg-ivory text-charcoal hover:border-mauve/60 hover:bg-ivory/90",
  ghost: "bg-transparent text-charcoal hover:bg-blush/50",
  gold: "bg-gold text-charcoal hover:bg-gold/90",
=======
  primary: "bg-primary text-cream hover:bg-primary/90",
  pink: "bg-babyPink text-midnight hover:bg-babyPink/90",
  mauve: "bg-mauve text-cream hover:bg-mauve/90",
  blueberry: "bg-blueberry text-cream hover:bg-blueberry/90",
  outline: "border border-mauve/40 bg-cream text-blueberry hover:border-mauve/60 hover:bg-cream/90",
  ghost: "bg-transparent text-blueberry hover:bg-babyPink/50",
  gold: "bg-gold text-midnight hover:bg-gold/90",
>>>>>>> heroku/main
};

const Button = ({
  as = "button",
  to,
  variant = "pink",
  size = "md",
  className = "",
  children,
  ...rest
}) => {
  const Component = as === "link" ? Link : as;

  const baseClasses =
<<<<<<< HEAD
    "inline-flex min-h-[48px] items-center justify-center rounded-full font-heading text-xs uppercase tracking-[0.32em] shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";
=======
    "inline-flex min-h-[48px] items-center justify-center rounded-full font-heading text-xs uppercase tracking-[0.32em] shadow-soft transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-dreamy focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream";
>>>>>>> heroku/main

  const sizeClasses = {
    sm: "px-5 py-2 text-[0.68rem] sm:text-xs",
    md: "px-6 py-2.5 text-xs sm:text-sm",
    lg: "px-8 py-3 text-sm sm:text-base",
  }[size];

<<<<<<< HEAD
  const colorClasses = COLOR_MAP[variant] ?? COLOR_MAP.mauve;
=======
  const colorClasses = COLOR_MAP[variant] ?? COLOR_MAP.primary;
>>>>>>> heroku/main

  const componentProps = {
    className: `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`.trim(),
    ...rest,
  };

  if (Component === Link) {
    componentProps.to = to ?? "#";
  }

  if (Component === "button" && componentProps.type === undefined) {
    componentProps.type = "button";
  }

  return <Component {...componentProps}>{children}</Component>;
};

export default Button;
