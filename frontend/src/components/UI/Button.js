import React from "react";
import { Link } from "react-router-dom";

const COLOR_MAP = {
  primary: "bg-primary",
  pink: "bg-babyPink",
  blue: "bg-babyBlue",
  purple: "bg-pastelPurple",
  white: "bg-white text-blueberry border border-babyPink/40",
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
    "inline-flex items-center justify-center rounded-full font-heading text-white tracking-[0.32em] shadow-soft transition duration-200 ease-out transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-dreamy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/60";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs sm:text-sm",
    md: "px-6 py-3 text-sm sm:text-base",
    lg: "px-8 py-4 text-base sm:text-lg",
  }[size];

  const colorClasses = COLOR_MAP[variant] ?? COLOR_MAP.primary;

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
