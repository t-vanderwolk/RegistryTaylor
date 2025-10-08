import React from "react";
const baseClasses = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10";

const ResponsiveContainer = ({
  as: Component = "div",
  className = "",
  children,
  padded = false,
  ...rest
}) => {
  const padding = padded ? "py-12 sm:py-16 lg:py-20" : "";
  const combined = [baseClasses, padding, className].filter(Boolean).join(" ");
  return (
    <Component className={combined} {...rest}>
      {children}
    </Component>
  );
};

export default ResponsiveContainer;
