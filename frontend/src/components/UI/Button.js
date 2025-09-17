import React from "react";
import { Link } from "react-router-dom";

const COLOR_MAP = {
  pink: "bg-babyPink",
  blue: "bg-babyBlue",
  purple: "bg-pastelPurple",
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
    "inline-flex items-center justify-center rounded-full font-heading text-cream tracking-wider shadow-toy transition duration-200 ease-out transform hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-dreamy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pastelPurple hover:animate-bounceSlow";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs sm:text-sm",
    md: "px-6 py-3 text-sm sm:text-base",
    lg: "px-8 py-4 text-base sm:text-lg",
  }[size];

  const colorClasses = COLOR_MAP[variant] ?? COLOR_MAP.pink;

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
