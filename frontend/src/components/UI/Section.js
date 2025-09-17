import React from "react";

/**
 * Section Component
 *
 * Props:
 * - title: optional heading text
 * - children: section content
 * - className: optional extra Tailwind classes
 * - center: boolean -> center-align text (Hero, CTA, etc.)
 * - index: number -> auto alternates layout
 */
const Section = ({
  title,
  children,
  className = "",
  center = false,
  index = 0,
  tightTop = false,
  compact = false,
  ...rest
}) => {
  const isReversed = index % 2 === 1 && !center; // alternate only if not a centered section
  const padding = compact
    ? "gap-6 md:gap-12 p-6 sm:p-8 md:p-10"
    : "gap-8 md:gap-16 p-6 sm:p-10 md:p-16";

  return (
    <section
      className={`cc-container ${tightTop ? "my-10 sm:my-12 md:my-16" : "my-16 sm:my-20 md:my-28"}`}
      {...rest}
    >
      <div
        className={`
          relative rounded-[2.5rem] border border-babyPink/30
          bg-white/95 shadow-soft transition duration-500 ease-out backdrop-blur-sm
          ${className}
        `}
      >
        {/* Inner content */}
        <div
          className={`relative z-10 flex flex-col md:flex-row ${
            isReversed ? "md:flex-row-reverse" : ""
          } ${padding}`}
        >
          <div className={`${center ? "text-center w-full" : "flex-1"}`}>
            {title && (
              <h2
                className={`font-playful text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 tracking-tight text-darkText ${
                  center ? "text-center" : "text-left"
                }`}
              >
                {title}
              </h2>
            )}
            {title && (
              <div className={`${center ? "mx-auto" : ""} h-1 bg-babyBlue w-12 sm:w-16 rounded-full mb-6`} />
            )}
            <div className="text-darkText/85 leading-relaxed font-body">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;
