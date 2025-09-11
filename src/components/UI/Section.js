import React from "react";

/**
 * Section Component
 *
 * Props:
 * - title: optional heading text
 * - children: section content
 * - className: optional extra Tailwind classes
 * - center: boolean -> center-align text (Hero, CTA, etc.)
 */
const Section = ({ title, children, className = "", center = false }) => {
  return (
    <section
      className={`cc-container my-12 md:my-20 transform transition duration-500 ease-in-out hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div
        className={`border border-neutral-200 rounded-2xl bg-white p-8 md:p-12 shadow-sm animate-fadeIn ${className} ${
          center ? "text-center" : "text-left"
        }`}
      >
        {title && (
          <h2
            className={`font-serif text-3xl md:text-4xl mb-6 tracking-wide ${
              center ? "text-center" : "text-left"
            }`}
          >
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
};

export default Section;