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
    ? "gap-8 md:gap-12 px-6 py-12 sm:px-8 sm:py-14 md:px-12 md:py-16"
    : "gap-10 md:gap-16 px-6 py-14 sm:px-10 sm:py-20 md:px-16 md:py-24";

  return (
    <section
      className={`cc-container ${tightTop ? "my-14 sm:my-16 md:my-20" : "my-20 sm:my-24 md:my-32"}`}
      {...rest}
    >
      <div
        className={`
          relative rounded-[2.5rem] border border-babyBlue/20
          bg-white/95 shadow-soft transition duration-500 ease-out backdrop-blur-sm
          ${className}
        `}
      >
        {/* Inner content */}
        <div
          className={`relative z-10 flex flex-col md:flex-row space-y-10 md:space-y-0 ${
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
              <div className={`${center ? "mx-auto" : ""} h-1 w-12 sm:w-16 rounded-full bg-babyBlue/70 mb-6`} />
            )}
            <div className="text-darkText/85 leading-relaxed font-body">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;
