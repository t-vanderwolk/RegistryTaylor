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
const Section = ({ title, children, className = "", center = false, index = 0 }) => {
  const isReversed = index % 2 === 1 && !center; // alternate only if not a centered section

  return (
    <section className="cc-container my-16 md:my-24">
      <div
        className={`
          relative rounded-2xl border-2 
          bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 
          transform transition duration-700 ease-in-out 
          ${className}
        `}
      >
        {/* Gold gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/40 via-transparent to-pink-200/30 pointer-events-none rounded-2xl" />

        {/* Inner content */}
        <div
          className={`relative z-10 flex flex-col md:flex-row ${
            isReversed ? "md:flex-row-reverse" : ""
          } gap-8 md:gap-12 p-8 md:p-12`}
        >
          <div className={`${center ? "text-center w-full" : "flex-1"}`}>
            {title && (
              <h2
                className={`font-serif text-3xl md:text-4xl mb-6 tracking-wide ${
                  center ? "text-center" : "text-left"
                }`}
              >
                {title}
              </h2>
            )}
            <div className="text-gray-700 leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;