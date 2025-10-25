import React from "react";

const alignmentMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const blushMap = {
  blush: {
    wrapper:
      "inline-flex items-center rounded-full border border-blush/35 bg-blush/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blush/90",
  },
  mauve: {
    wrapper:
      "inline-flex items-center rounded-full border border-mauve/40 bg-mauve/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-mauve/90",
  },
  gold: {
    wrapper:
      "inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-gold/90",
  },
  blueberry: {
    wrapper:
      "inline-flex items-center rounded-full border border-mauve/40 bg-mauve/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-charcoal/90",
  },
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  blush = "blush",
}) => {
  const alignClasses = alignmentMap[align] ?? alignmentMap.center;
  const blushClasses = blushMap[blush] ?? blushMap.blush;
  const wrapperClasses = [
    "flex flex-col gap-3 sm:gap-4",
    alignClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={wrapperClasses}>
      {eyebrow && <span className={blushClasses.wrapper}>{eyebrow}</span>}
      {title && (
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-3xl font-body text-sm leading-relaxed text-charcoal/80 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;
