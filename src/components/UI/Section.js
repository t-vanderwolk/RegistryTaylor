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
const Section = ({ title, children, className = "", center = false, index = 0, tightTop = false, compact = false }) => {
  const isReversed = index % 2 === 1 && !center; // alternate only if not a centered section
  const padding = compact ? "gap-8 md:gap-12 p-8 md:p-10" : "gap-10 md:gap-16 p-10 md:p-16";

  return (
    <section className={`cc-container ${tightTop ? "my-10 md:my-16" : "my-20 md:my-28"}`}>
      <div
        className={`
          relative overflow-hidden rounded-bubble border border-softLavender/50
          bg-white/85 shadow-soft backdrop-blur-sm hover:shadow-dreamy hover:-translate-y-1
          transform transition duration-700 ease-in-out
          ${className}
        `}
      >
        <div className="pointer-events-none absolute -top-24 left-8 h-56 w-56 rounded-full bg-babyPink/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-12 h-48 w-48 rounded-full bg-softSky/30 blur-3xl" />
        {/* Inner content */}
        <div
          className={`relative z-10 flex flex-col md:flex-row ${
            isReversed ? "md:flex-row-reverse" : ""
          } ${padding}`}
        >
          <div className={`${center ? "text-center w-full" : "flex-1"}`}>
            {title && (
              <h2
                className={`font-serif text-3xl md:text-4xl mb-6 tracking-wide text-cozyGray ${
                  center ? "text-center" : "text-left"
                }`}
              >
                {title}
              </h2>
            )}
            {title && (
              <div className={`${center ? "mx-auto" : ""} h-1 bg-babyPink w-16 rounded-full mb-6`} />
            )}
            <div className="text-cozyGray/90 leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;
