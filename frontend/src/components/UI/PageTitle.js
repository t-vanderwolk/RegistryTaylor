import React from "react";

const PageTitle = ({ eyebrow, subtitle, alignment = "center", className = "" }) => {
  const alignmentClasses =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "right"
      ? "items-end text-right"
      : "items-center text-center";

  const containerClasses = [`flex flex-col gap-2`, alignmentClasses, className].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {eyebrow && (
        <span className="text-xs font-heading uppercase tracking-[0.45em] text-[#AF7C9D]">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl font-script text-[#C27AA6] sm:text-5xl md:text-6xl">Taylor-Made</h1>
      {subtitle && (
        <span className="text-sm font-heading uppercase tracking-[0.4em] text-[#77606E]">{subtitle}</span>
      )}
    </div>
  );
};

export default PageTitle;
