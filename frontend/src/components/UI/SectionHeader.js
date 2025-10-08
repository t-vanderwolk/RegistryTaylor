import React from "react";

const alignmentMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const accentMap = {
  accent: {
    wrapper:
      "inline-flex items-center rounded-full border border-accent/35 bg-accent/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-accent/90",
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
      "inline-flex items-center rounded-full border border-blueberry/40 bg-blueberry/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blueberry/90",
  },
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  accent = "accent",
}) => {
  const alignClasses = alignmentMap[align] ?? alignmentMap.center;
  const accentClasses = accentMap[accent] ?? accentMap.accent;
  const wrapperClasses = [
    "flex flex-col gap-3 sm:gap-4",
    alignClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={wrapperClasses}>
      {eyebrow && <span className={accentClasses.wrapper}>{eyebrow}</span>}
      {title && (
        <h2 className="font-heading text-3xl text-blueberry sm:text-4xl">
          {title}
        </h2>
      )}
      {description && (
        <p className="max-w-3xl font-body text-sm leading-relaxed text-darkText/80 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;
