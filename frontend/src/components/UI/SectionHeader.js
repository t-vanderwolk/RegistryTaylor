import React from "react";

const alignmentMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

<<<<<<< HEAD
const blushMap = {
  blush: {
    wrapper:
      "inline-flex items-center rounded-full border border-blush/35 bg-blush/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blush/90",
=======
const accentMap = {
  accent: {
    wrapper:
      "inline-flex items-center rounded-full border border-accent/35 bg-accent/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-accent/90",
>>>>>>> heroku/main
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
<<<<<<< HEAD
      "inline-flex items-center rounded-full border border-mauve/40 bg-mauve/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-charcoal/90",
=======
      "inline-flex items-center rounded-full border border-blueberry/40 bg-blueberry/10 px-4 py-1 text-[0.65rem] font-heading uppercase tracking-[0.35em] text-blueberry/90",
>>>>>>> heroku/main
  },
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
<<<<<<< HEAD
  blush = "blush",
}) => {
  const alignClasses = alignmentMap[align] ?? alignmentMap.center;
  const blushClasses = blushMap[blush] ?? blushMap.blush;
=======
  accent = "accent",
}) => {
  const alignClasses = alignmentMap[align] ?? alignmentMap.center;
  const accentClasses = accentMap[accent] ?? accentMap.accent;
>>>>>>> heroku/main
  const wrapperClasses = [
    "flex flex-col gap-3 sm:gap-4",
    alignClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={wrapperClasses}>
<<<<<<< HEAD
      {eyebrow && <span className={blushClasses.wrapper}>{eyebrow}</span>}
      {title && (
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
=======
      {eyebrow && <span className={accentClasses.wrapper}>{eyebrow}</span>}
      {title && (
        <h2 className="font-heading text-3xl text-blueberry sm:text-4xl">
>>>>>>> heroku/main
          {title}
        </h2>
      )}
      {description && (
<<<<<<< HEAD
        <p className="max-w-3xl font-body text-sm leading-relaxed text-charcoal/80 sm:text-base">
=======
        <p className="max-w-3xl font-body text-sm leading-relaxed text-darkText/80 sm:text-base">
>>>>>>> heroku/main
          {description}
        </p>
      )}
    </header>
  );
};

export default SectionHeader;
