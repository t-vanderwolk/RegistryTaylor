import React from "react";
import ResponsiveContainer from "./ResponsiveContainer";
import SectionHeader from "./SectionHeader";

const Section = ({
  title,
  eyebrow,
  description,
  children,
  className = "",
  center = false,
  index = 0,
  tightTop = false,
  compact = false,
  ...rest
}) => {
  const isReversed = index % 2 === 1 && !center;
  const outerSpacing = tightTop
    ? "py-12 sm:py-14 lg:py-16"
    : "py-16 sm:py-20 lg:py-28";
  const padding = compact
    ? "px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
    : "px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20";

  const panelClasses = [
    "relative overflow-hidden rounded-[2.75rem] border border-gold/20 bg-cream/95 shadow-soft backdrop-blur-sm transition duration-500 ease-out",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ResponsiveContainer
      as="section"
      className={outerSpacing}
      padded={false}
      {...rest}
    >
      <div className={panelClasses}>
        <div
          className={[
            "relative z-10 flex flex-col gap-10 sm:gap-12 lg:gap-14",
            isReversed ? "md:flex-row-reverse" : "md:flex-row",
            center ? "md:flex-col" : "",
            padding,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {(title || eyebrow || description) && (
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              align={center ? "center" : "left"}
              className={center ? "w-full" : "md:max-w-sm"}
            />
          )}
          <div className={center ? "w-full" : "flex-1 font-body text-darkText/80"}>
            {children}
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default Section;
